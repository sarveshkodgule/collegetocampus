import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Award, Trophy, ShieldAlert, Star, Terminal, Coins, Flame, Cpu, ShieldCheck } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    id: 'sql_master',
    title: 'SQL Cyber Decryptor',
    desc: 'Bypassed server defenses to extract files in the Data Bank.',
    icon: Terminal,
    color: '#39FF14',
    check: (s) => s.heistLevelsCompleted > 0
  },
  {
    id: 'algo_slayer',
    title: 'Algorithm Gladiator',
    desc: 'Defeated a data structure monster in the DSA Arena.',
    icon: ShieldCheck,
    color: '#EF4444',
    check: (s) => s.xp >= 40
  },
  {
    id: 'placement_hunter',
    title: 'Logical Ninja',
    desc: 'Achieved a score of 50+ in Apti-Rush.',
    icon: Trophy,
    color: '#FF007F',
    check: (s) => s.aptiHighScore >= 50
  },
  {
    id: 'cto_badge',
    title: 'Incubator Founder',
    desc: 'Successfully launched a SaaS company from a dorm room.',
    icon: Cpu,
    color: '#F97316',
    check: (s) => s.xp >= 80
  },
  {
    id: 'decryptor_auditor',
    title: 'Compiler Auditor',
    desc: 'Audited and debugged corrupt code lines in Code Decryptor.',
    icon: ShieldAlert,
    color: '#EC4899',
    check: (s) => s.xp >= 60
  },
  {
    id: 'codex_scholar',
    title: 'Databank Archivist',
    desc: 'Unlocked all Metropolis database entries in the Codex Terminal.',
    icon: Star,
    color: '#00F3FF',
    check: (s) => localStorage.getItem('metropolis_codex_opened') === 'true' || s.xp >= 20
  },
  {
    id: 'code_snake_master',
    title: 'Syntactic Reptile',
    desc: 'Completed Level 5 in the Code Snake Arena.',
    icon: Terminal,
    color: '#10B981',
    check: (s) => s.xp >= 150
  },
  {
    id: 'ai_champion_badge',
    title: 'AI Champion',
    desc: 'Completed all 10 stages in the AI Master Challenge.',
    icon: Trophy,
    color: '#00F3FF',
    check: (s) => s.xp >= 300
  }
];

export default function ProfilePage() {
  const store = usePlayerStore();
  const { 
    name, avatar, rank, xp, coins, streak, classType, unlockedSkills, 
    heistLevelsCompleted, aptiHighScore, setGame,
    collegeName, department, gradYear, rollNumber, email
  } = store;

  const level = Math.floor(xp / 100) + 1;
  const xpNeededForNext = 100 - (xp % 100);

  const getAcademicYear = (year) => {
    if (!year) return 'N/A';
    const currentYear = new Date().getFullYear();
    const diff = year - currentYear;
    if (diff >= 3) return 'FY (First Year)';
    if (diff === 2) return 'SY (Second Year)';
    if (diff === 1) return 'TY (Third Year)';
    if (diff <= 0) return 'LY (Final Year / Graduate)';
    return `${year} Grad`;
  };

  const [leaderboard, setLeaderboard] = React.useState([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        const fallbackMocks = [
          { name: 'Rohan (Lead)', avatar: '👨‍💻', rank: 'Lead SDE', xp: 4200, classType: 'Backend Guardian', email: 'rohan@silicon.io' },
          { name: 'Neha (Architect)', avatar: '👩‍💼', rank: 'Architect', xp: 3800, classType: 'UI/UX Rogue', email: 'neha@silicon.io' },
          { name: 'Thomas Neo', avatar: '🕶️', rank: 'Senior SDE', xp: 2100, classType: 'AI Alchemist', email: 'neo@silicon.io' }
        ];

        let dbLeaderboard = [];
        if (data.success && data.leaderboard && data.leaderboard.length > 0) {
          dbLeaderboard = data.leaderboard;
        }

        // Merge & deduplicate
        const displayList = [...dbLeaderboard];
        fallbackMocks.forEach(mock => {
          if (!displayList.some(p => p.name === mock.name || p.email === mock.email)) {
            displayList.push(mock);
          }
        });
        displayList.sort((a, b) => b.xp - a.xp);
        setLeaderboard(displayList);
      })
      .catch(() => {
        // Fallback mock players
        setLeaderboard([
          { name: 'Rohan (Lead)', avatar: '👨‍💻', rank: 'Lead SDE', xp: 4200, classType: 'Backend Guardian' },
          { name: 'Neha (Architect)', avatar: '👩‍💼', rank: 'Architect', xp: 3800, classType: 'UI/UX Rogue' },
          { name: 'Thomas Neo', avatar: '🕶️', rank: 'Senior SDE', xp: 2100, classType: 'AI Alchemist' }
        ]);
      });
  }, []);

  const playHoverSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch(e) {}
  };

  const handleSpeakProfile = () => {
    try {
      window.speechSynthesis.cancel();
      const text = `Welcome back developer ${name}. You are a level ${level} ${classType || 'unspecialized programmer'}. You currently hold ${coins} placement coins and have unlocked ${unlockedSkills.length} career constellation skills.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch(e) {}
  };

  return (
    <div style={styles.container} className="grid-overlay profile-container">
      <div style={styles.grid} className="profile-grid">
        {/* Left Card: Player Details */}
        <div className="game-card" style={styles.detailsCard}>
          <div style={styles.avatarWrapper} className="float-animation">
            <span style={styles.avatar}>{avatar}</span>
          </div>

          <button 
            className="game-btn" 
            style={{ padding: '4px 10px', fontSize: '0.7rem', marginBottom: '1rem', borderColor: 'var(--accent-color)', color: 'var(--accent-color)', backgroundColor: 'transparent' }}
            onClick={handleSpeakProfile}
            onMouseEnter={playHoverSound}
          >
            🔊 Speak Summary
          </button>
          
          <h2 style={styles.hackerName}>{name}</h2>
          {email && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              @{email.split('@')[0]}
            </div>
          )}
          <div style={styles.rankBadge}>
            <Award size={14} color="#00F3FF" />
            <span>{rank}</span>
          </div>

          <div style={styles.statsSummary}>
            <div style={styles.sumBox} onMouseEnter={playHoverSound}>
              <span style={styles.sumVal}>{level}</span>
              <span style={styles.sumLabel}>LEVEL</span>
            </div>
            <div style={styles.sumBox} onMouseEnter={playHoverSound}>
              <span style={styles.sumVal}>{coins}</span>
              <span style={styles.sumLabel}>COINS</span>
            </div>
            <div style={styles.sumBox} onMouseEnter={playHoverSound}>
              <span style={{ ...styles.sumVal, color: '#FF5722' }}>{streak}d</span>
              <span style={styles.sumLabel}>STREAK</span>
            </div>
          </div>

          {/* Level Progress */}
          <div style={styles.xpSection}>
            <div style={styles.xpLabelRow}>
              <span>XP: {xp}</span>
              <span>{xpNeededForNext} XP to next level</span>
            </div>
            <div style={styles.xpBarContainer}>
              <div style={{ ...styles.xpBarFill, width: `${xp % 100}%` }}></div>
            </div>
          </div>

          {/* Specialization Class */}
          <div style={styles.specBox}>
            <span style={styles.specLabel}>SPECIALIZATION CLASS:</span>
            <span style={{ ...styles.specVal, color: classType ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
              {classType || 'No Class Selected'}
            </span>
            {!classType && (
              <button 
                className="game-btn game-btn-primary" 
                style={styles.treeBtn}
                onClick={() => setGame('career-tower')}
              >
                Choose Class
              </button>
            )}
          </div>

          {/* Academic Profile */}
          <div style={{ ...styles.specBox, marginTop: '1rem' }}>
            <span style={styles.specLabel}>🎓 ACADEMIC STANDING</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'left' }}>
              <div><strong style={{ color: 'var(--accent-secondary)' }}>University:</strong> <span style={{ color: '#FFF' }}>{collegeName || 'N/A'}</span></div>
              <div><strong style={{ color: 'var(--accent-secondary)' }}>Branch:</strong> <span style={{ color: '#FFF' }}>{department || 'N/A'}</span></div>
              <div><strong style={{ color: 'var(--accent-secondary)' }}>Student ID:</strong> <span style={{ color: '#FFF' }}>{rollNumber || 'N/A'}</span></div>
              <div><strong style={{ color: 'var(--accent-secondary)' }}>Year Standing:</strong> <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{getAcademicYear(gradYear)}</span></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Game Stats & Badges */}
        <div style={styles.statsPanel}>
          {/* Section 1: Mini-game Metrics */}
          <div className="game-card" style={styles.metricsCard}>
            <h3 style={styles.panelTitle}>⚡ PLACEMENT SECTOR STATS</h3>
            <div style={styles.metricsGrid}>
              <div style={styles.metricRow}>
                <span style={styles.mName}>🏦 Data Bank Cases Cracked:</span>
                <span style={styles.mVal}>{heistLevelsCompleted} Cases</span>
              </div>
              <div style={styles.metricRow}>
                <span style={styles.mName}>⚡ Apti-Rush Highscore:</span>
                <span style={styles.mVal}>{aptiHighScore} Pts</span>
              </div>
              <div style={styles.metricRow}>
                <span style={styles.mName}>🌳 Skill Tree Unlocked:</span>
                <span style={styles.mVal}>{unlockedSkills.length} Nodes</span>
              </div>
            </div>
          </div>

          {/* Section 2: Badges Achievements */}
          <div className="game-card" style={styles.achievementsCard}>
            <h3 style={styles.panelTitle}>🏆 HACKER ACHIEVEMENTS</h3>
            <div style={styles.achievementsGrid}>
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = ach.check(store);
                const AchIcon = ach.icon;
                
                return (
                  <div 
                    key={ach.id} 
                    style={{ 
                      ...styles.badgeCard, 
                      borderColor: isUnlocked ? ach.color : 'rgba(255,255,255,0.03)',
                      opacity: isUnlocked ? 1 : 0.35,
                      boxShadow: isUnlocked ? `0 0 10px rgba(${hexToRgb(ach.color)}, 0.2)` : 'none'
                    }}
                    className="game-card"
                    onMouseEnter={playHoverSound}
                  >
                    <div style={{ ...styles.badgeIconBg, backgroundColor: isUnlocked ? `rgba(${hexToRgb(ach.color)}, 0.1)` : 'rgba(0,0,0,0.2)' }}>
                      <AchIcon size={24} color={isUnlocked ? ach.color : '#4B5563'} />
                    </div>
                    <div>
                      <h4 style={{ ...styles.badgeTitle, color: isUnlocked ? ach.color : 'var(--text-primary)' }}>
                        {ach.title}
                      </h4>
                      <p style={styles.badgeDesc}>{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Third Column: Global Leaderboard */}
        <div className="game-card" style={styles.leaderboardCard}>
          <h3 style={styles.panelTitle}>🏆 CAMPUS LEADERBOARD</h3>
          <div style={styles.leaderboardList}>
            {leaderboard.map((player, idx) => (
              <div key={idx} style={styles.leaderboardRow} onMouseEnter={playHoverSound}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={styles.rankNum}>{idx + 1}</span>
                  <span style={{ fontSize: '1.25rem' }}>{player.avatar || '🚀'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={styles.leaderName}>{player.name}</span>
                    <span style={styles.leaderSub}>{player.classType || 'SDE Recruit'}</span>
                  </div>
                </div>
                <span style={styles.leaderXp}>{player.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}

const styles = {
  container: {
    padding: '2.5rem',
    minHeight: 'calc(100vh - 70px)',
    width: '100vw',
    overflowY: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 2fr 1.4fr',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'start',
  },
  detailsCard: {
    backgroundColor: 'rgba(19, 23, 34, 0.75)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
    minHeight: '420px',
  },
  avatarWrapper: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid var(--accent-color)',
    boxShadow: 'var(--glow-accent)',
    marginBottom: '1rem',
  },
  avatar: {
    fontSize: '3.5rem',
  },
  hackerName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '0.25rem',
  },
  rankBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    color: 'var(--accent-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    padding: '3px 10px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  statsSummary: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    padding: '1rem 0',
    marginBottom: '1.5rem',
  },
  sumBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sumVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
  },
  sumLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  xpSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '1.5rem',
  },
  xpLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  xpBarContainer: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))',
    boxShadow: 'var(--glow-accent)',
  },
  specBox: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  specLabel: {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    fontWeight: '700',
  },
  specVal: {
    fontSize: '0.9rem',
    fontWeight: '800',
    letterSpacing: '1px',
    fontFamily: 'var(--font-title)',
  },
  treeBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem',
    marginTop: '4px',
  },
  statsPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: '100%',
  },
  metricsCard: {
    backgroundColor: 'rgba(19, 23, 34, 0.75)',
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    color: 'var(--accent-secondary)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
    letterSpacing: '1px',
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
  },
  mName: {
    color: 'var(--text-secondary)',
  },
  mVal: {
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  achievementsCard: {
    backgroundColor: 'rgba(19, 23, 34, 0.75)',
  },
  achievementsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  badgeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: '1px',
  },
  badgeIconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  badgeDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    lineHeight: '1.3',
  },
  leaderboardCard: {
    backgroundColor: 'rgba(19, 23, 34, 0.75)',
    padding: '1.5rem',
    height: '100%',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '0.5rem',
    overflowY: 'auto',
    flex: 1
  },
  leaderboardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.02)',
    transition: 'all 0.2s ease',
  },
  rankNum: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-color)',
    width: '18px'
  },
  leaderName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#FFF'
  },
  leaderSub: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)'
  },
  leaderXp: {
    fontSize: '0.85rem',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-secondary)'
  }
};
