import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Rocket, TrendingUp, AlertCircle, Cpu, Award, Zap, Coins } from 'lucide-react';

const EVENTS = [
  {
    week: 1,
    title: 'Server Outage!',
    desc: 'Your cheap server crashed due to bad memory management. Product Quality reduced by 15%.',
    impact: (s) => ({ ...s, quality: Math.max(0, s.quality - 15) })
  },
  {
    week: 2,
    title: 'Reddit Viral Post!',
    desc: 'Your product showcase went viral on r/developer. Hype increases by 35%!',
    impact: (s) => ({ ...s, hype: Math.min(100, s.hype + 35) })
  },
  {
    week: 3,
    title: 'Competitor Launch',
    desc: 'A rival launched a similar product. Users are leaving. You lose 100 users, but your stress spikes!',
    impact: (s) => ({ ...s, users: Math.max(0, s.users - 100), stress: Math.min(100, s.stress + 20) })
  }
];

export default function StartupGarage() {
  const { addCoins, addXP, setGame } = usePlayerStore();

  const [simState, setSimState] = useState('lobby'); // 'lobby', 'simulating', 'victory', 'defeat'
  const [week, setWeek] = useState(1);
  
  // Game Stats
  const [stats, setStats] = useState({
    money: 1200,
    hype: 10,
    quality: 50,
    users: 0,
    stress: 20
  });

  // Hours Allocation
  const [hours, setHours] = useState({
    coding: 10,
    marketing: 10,
    debt: 10,
    networking: 10
  });

  const [activeEvent, setActiveEvent] = useState(null);

  const startSimulation = () => {
    setWeek(1);
    setStats({
      money: 1200,
      hype: 10,
      quality: 50,
      users: 0,
      stress: 20
    });
    setHours({
      coding: 10,
      marketing: 10,
      debt: 10,
      networking: 10
    });
    setActiveEvent(null);
    setSimState('simulating');
  };

  const handleHourChange = (type, val) => {
    const newHours = { ...hours, [type]: Math.max(0, hours[type] + val) };
    const total = Object.values(newHours).reduce((a, b) => a + b, 0);
    
    if (total <= 40) {
      setHours(newHours);
    }
  };

  const nextWeek = () => {
    // 1. Calculate stats update based on hours allocation
    let dMoney = -150; // Base weekly burn rate
    let dHype = hours.marketing * 2;
    let dQuality = (hours.coding * 1.5) - (hours.marketing * 0.5); // coding increases quality, rapid feature launch degrades it slightly
    let dStress = (hours.coding + hours.marketing + hours.networking) * 0.8 - hours.debt * 1.5;

    // Networking yields VC funds
    if (hours.networking > 10) {
      dMoney += (hours.networking - 10) * 40;
    }

    // Resolve hour effects
    const nextHype = Math.min(100, Math.max(0, stats.hype + dHype));
    const nextQuality = Math.min(100, Math.max(0, stats.quality + dQuality));
    const nextStress = Math.min(100, Math.max(0, stats.stress + dStress));
    
    // User growth equation
    const newUsersCount = Math.floor(nextHype * nextQuality * 0.15);
    const nextUsers = stats.users + newUsersCount;

    let nextMoney = stats.money + dMoney;

    let updatedStats = {
      money: nextMoney,
      hype: nextHype,
      quality: nextQuality,
      users: nextUsers,
      stress: nextStress
    };

    // Apply Random Events
    const currentEvent = EVENTS.find(e => e.week === week);
    if (currentEvent) {
      updatedStats = currentEvent.impact(updatedStats);
      setActiveEvent(currentEvent);
    } else {
      setActiveEvent(null);
    }

    // Set stats
    setStats(updatedStats);

    // Check Win/Loss conditions
    if (updatedStats.money <= 0 || updatedStats.stress >= 100) {
      setSimState('defeat');
      return;
    }

    if (week >= 4) {
      if (updatedStats.users >= 500) {
        setSimState('victory');
        addCoins(200);
        addXP(80);
      } else {
        setSimState('defeat');
      }
    } else {
      setWeek((w) => w + 1);
    }
  };

  const totalHours = Object.values(hours).reduce((a, b) => a + b, 0);

  return (
    <div style={styles.container}>
      {/* 1. LOBBY STATE */}
      {simState === 'lobby' && (
        <div className="game-card" style={styles.lobbyPanel}>
          <Rocket size={64} color="var(--accent-color)" className="float-animation" />
          <h2 style={styles.title}>STARTUP GARAGE: BOOTSTRAP TO UNICORN</h2>
          <p style={styles.desc}>
            You have 4 weeks to launch your SaaS software product from your hostel dorm. Allocate your 40 hours of action points each week carefully to build users, maintain codebase quality, and pitch VCs for cash before your burn rate bankrupts you!
          </p>

          <div style={styles.rulesBox}>
            <div style={styles.ruleItem}>💼 **Weekly Burn Rate:** Servers and coffee cost **-$150/week**.</div>
            <div style={styles.ruleItem}>⚙️ **Codebase Debt:** Launching features increases Hype, but degrades Product Quality unless you spend hours fixing debt.</div>
            <div style={styles.ruleItem}>🏆 **Unicorn Condition:** Survive 4 weeks and acquire **500+ active users** to succeed.</div>
          </div>

          <button className="game-btn game-btn-primary" style={styles.actionBtn} onClick={startSimulation}>
            LAUNCH SIMULATOR
          </button>
        </div>
      )}

      {/* 2. SIMULATION VIEW */}
      {simState === 'simulating' && (
        <div style={styles.simPanel}>
          {/* HUD Stats */}
          <div style={styles.statsBar}>
            <div style={styles.statCard} className="game-card">
              <span style={styles.statLabel}>💸 RUNWAY CASH</span>
              <span style={{ ...styles.statVal, color: stats.money <= 300 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                ${stats.money}
              </span>
            </div>
            <div style={styles.statCard} className="game-card">
              <span style={styles.statLabel}>🔥 PRODUCT HYPE</span>
              <span style={styles.statVal}>{stats.hype}%</span>
            </div>
            <div style={styles.statCard} className="game-card">
              <span style={styles.statLabel}>🔧 CODE QUALITY</span>
              <span style={{ ...styles.statVal, color: stats.quality <= 30 ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                {stats.quality}%
              </span>
            </div>
            <div style={styles.statCard} className="game-card">
              <span style={styles.statLabel}>📈 TOTAL USERS</span>
              <span style={{ ...styles.statVal, color: 'var(--accent-secondary)' }}>{stats.users}</span>
            </div>
            <div style={styles.statCard} className="game-card">
              <span style={styles.statLabel}>🔋 STRESS LEVEL</span>
              <span style={{ ...styles.statVal, color: stats.stress >= 75 ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                {stats.stress}%
              </span>
            </div>
          </div>

          {/* Core Dashboard Grid */}
          <div style={styles.dashboardGrid}>
            {/* Hour Allocator Menu */}
            <div className="game-card" style={styles.allocatorCard}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>WEEK {week} / 4: TIME MANAGER</h3>
                <span style={styles.hoursRemaining}>Hours Used: {totalHours} / 40 hrs</span>
              </div>

              <div style={styles.allocatorList}>
                {/* Coding */}
                <div style={styles.allocateRow}>
                  <div>
                    <div style={styles.allocateTitle}>Coding Core Features</div>
                    <div style={styles.allocateDesc}>Increases product quality and hype potential, raises stress.</div>
                  </div>
                  <div style={styles.controls}>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('coding', -5)}>-</button>
                    <span style={styles.ctrlVal}>{hours.coding}h</span>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('coding', 5)}>+</button>
                  </div>
                </div>

                {/* Marketing */}
                <div style={styles.allocateRow}>
                  <div>
                    <div style={styles.allocateTitle}>Reddit/Twitter Marketing</div>
                    <div style={styles.allocateDesc}>Boosts Hype and user awareness significantly.</div>
                  </div>
                  <div style={styles.controls}>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('marketing', -5)}>-</button>
                    <span style={styles.ctrlVal}>{hours.marketing}h</span>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('marketing', 5)}>+</button>
                  </div>
                </div>

                {/* Debt */}
                <div style={styles.allocateRow}>
                  <div>
                    <div style={styles.allocateTitle}>Paying Technical Debt</div>
                    <div style={styles.allocateDesc}>Fixes server bugs, decreases Stress, prevents outages.</div>
                  </div>
                  <div style={styles.controls}>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('debt', -5)}>-</button>
                    <span style={styles.ctrlVal}>{hours.debt}h</span>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('debt', 5)}>+</button>
                  </div>
                </div>

                {/* Networking */}
                <div style={styles.allocateRow}>
                  <div>
                    <div style={styles.allocateTitle}>Pitching VCs & Vibe</div>
                    <div style={styles.allocateDesc}>Secures external funding to raise Runway Cash.</div>
                  </div>
                  <div style={styles.controls}>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('networking', -5)}>-</button>
                    <span style={styles.ctrlVal}>{hours.networking}h</span>
                    <button style={styles.ctrlBtn} onClick={() => handleHourChange('networking', 5)}>+</button>
                  </div>
                </div>
              </div>

              <button 
                className="game-btn game-btn-primary" 
                style={styles.submitBtn} 
                disabled={totalHours !== 40}
                onClick={nextWeek}
              >
                SUBMIT WEEK {week} PLANS
              </button>
            </div>

            {/* Event Display Panel */}
            <div className="game-card" style={styles.eventCard}>
              <div style={styles.panelHeader}>
                <h3 style={styles.panelTitle}>STARTUP NEWSFEED</h3>
              </div>
              {activeEvent ? (
                <div style={styles.activeEventBox}>
                  <AlertCircle size={32} color="var(--accent-color)" className="pulse-glow-animation" />
                  <h4 style={styles.eventTitle}>{activeEvent.title}</h4>
                  <p style={styles.eventDescText}>{activeEvent.desc}</p>
                </div>
              ) : (
                <div style={styles.newsPlaceholder}>
                  ☕ The compile finishes. No major crashes reported. Users are browsing...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. VICTORY SCREEN */}
      {simState === 'victory' && (
        <div className="game-card" style={styles.lobbyPanel}>
          <Award size={64} color="var(--success-color)" className="float-animation" />
          <h2 style={{ ...styles.title, color: 'var(--success-color)' }}>ACQUIRED / UNICORN STATUS!</h2>
          <p style={styles.desc}>
            Sensational product market fit! Your SaaS startup reached **{stats.users} active users**! An international corporation acquired you for $5M.
          </p>

          <div style={styles.rewardsPanel}>
            <div>💎 +200 Coins added to global balance</div>
            <div>⚡ +80 XP applied to Rank</div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="game-btn game-btn-primary" onClick={() => setGame(null)}>Return to Hub</button>
            <button className="game-btn" onClick={startSimulation}>Replay</button>
          </div>
        </div>
      )}

      {/* 4. DEFEAT SCREEN */}
      {simState === 'defeat' && (
        <div className="game-card" style={styles.lobbyPanel}>
          <AlertCircle size={64} color="var(--danger-color)" className="float-animation" />
          <h2 style={{ ...styles.title, color: 'var(--danger-color)' }}>STARTUP BANKRUPTCY</h2>
          <p style={styles.desc}>
            Your startup crashed. {stats.money <= 0 ? 'You ran out of Runway Cash to keep servers online.' : 'Your stress levels hit 100% leading to developer burnout.'} 
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="game-btn game-btn-primary" onClick={startSimulation}>Restart Incubator</button>
            <button className="game-btn" onClick={() => setGame(null)}>Hub City</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 70px)',
    width: '100vw',
  },
  lobbyPanel: {
    maxWidth: '600px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    backgroundColor: 'rgba(21, 17, 14, 0.95)',
    borderWidth: '2px',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.75rem',
    letterSpacing: '2px',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  rulesBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(249, 115, 22, 0.15)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '1rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    width: '100%',
  },
  ruleItem: {
    fontSize: '0.85rem',
  },
  actionBtn: {
    width: '220px',
    justifyContent: 'center',
  },
  simPanel: {
    width: '100%',
    maxWidth: '950px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '1rem',
  },
  statCard: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(38, 31, 26, 0.5)',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
    marginBottom: '4px',
  },
  statVal: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '800',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '1.5rem',
  },
  allocatorCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    backgroundColor: 'rgba(38, 31, 26, 0.7)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.75rem',
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    color: 'var(--accent-color)',
  },
  hoursRemaining: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  allocatorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  allocateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocateTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  allocateDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ctrlBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
  ctrlVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: '700',
    width: '30px',
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '1rem',
    letterSpacing: '2px',
  },
  eventCard: {
    backgroundColor: 'rgba(38, 31, 26, 0.7)',
    display: 'flex',
    flexDirection: 'column',
  },
  activeEventBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    gap: '0.75rem',
    padding: '2rem 1rem',
  },
  eventTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--accent-color)',
  },
  eventDescText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  newsPlaceholder: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    padding: '2rem 1rem',
    textAlign: 'center',
    margin: 'auto 0',
  },
  rewardsPanel: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.15)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
    fontSize: '0.85rem',
    color: 'var(--success-color)',
  }
};
