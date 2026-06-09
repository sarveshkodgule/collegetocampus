import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { 
  Compass, 
  Terminal, 
  ShieldAlert, 
  Zap, 
  Briefcase, 
  Rocket, 
  Trophy, 
  Clock, 
  Star 
} from 'lucide-react';

const BUILDINGS = [
  {
    id: 'career-tower',
    title: 'Career Tower',
    subtitle: 'Skill Tree: Life Architect',
    description: 'Forge your developer career build. Choose starting classes and invest skill points in core languages.',
    icon: Compass,
    color: '#3B82F6', // Blue
    accentClass: 'theme-career-tower',
    difficulty: 'Strategy',
    reputationReward: '+15 Rep'
  },
  {
    id: 'sql-heist',
    title: 'Data Bank',
    subtitle: 'SQL Heist',
    description: 'Hack terminal databases. Write optimized SELECT and JOIN queries to extract files and track culprits.',
    icon: Terminal,
    color: '#39FF14', // Neon Green
    accentClass: 'theme-sql-heist',
    difficulty: 'Medium',
    reputationReward: '+30 Rep'
  },
  {
    id: 'algo-arena',
    title: 'Dsa Arena',
    subtitle: 'Algorithm Arena',
    description: 'Fight data structure monsters and compete in code speed duels using optimal big-O complexity attacks.',
    icon: ShieldAlert,
    color: '#EF4444', // Crimson
    accentClass: 'theme-algo-arena',
    difficulty: 'Hard',
    reputationReward: '+50 Rep'
  },
  {
    id: 'apti-rush',
    title: 'Aptitude District',
    subtitle: 'Apti Rush',
    description: 'Fast-paced WarioWare quants and logic runner. Answer questions in 10s to charge combo multipliers!',
    icon: Zap,
    color: '#FF007F', // Pink
    accentClass: 'theme-apti-rush',
    difficulty: 'Reflexes',
    reputationReward: '+10 Rep'
  },
  {
    id: 'internship-detective',
    title: 'Office Complex',
    subtitle: 'Internship Detective',
    description: 'Survive your first internship. Handle QA friction, code reviews, and Git crises in a visual novel branching story.',
    icon: Briefcase,
    color: '#6366F1', // Indigo
    accentClass: 'theme-internship-detective',
    difficulty: 'Social / Soft Skills',
    reputationReward: '+25 Rep'
  },
  {
    id: 'startup-garage',
    title: 'Startup Garage',
    subtitle: 'Startup Simulator',
    description: 'Bootstrapped tycoon. Allocate hours, hire devs, balance Hype vs. Product Quality, and build a SaaS unicorn.',
    icon: Rocket,
    color: '#F97316', // Orange
    accentClass: 'theme-startup-garage',
    difficulty: 'Management',
    reputationReward: '+40 Rep'
  }
];

export default function Hub() {
  const { setGame, coins, streak, rank } = usePlayerStore();

  return (
    <div style={styles.container} className="grid-overlay">
      {/* City Title Header */}
      <div style={styles.welcomeBanner}>
        <div style={styles.cityBadge}>SYSTEM MAIN HUB</div>
        <h2 style={styles.cityTitle}>SILICON METROPOLIS</h2>
        <p style={styles.cityDesc}>Select a sector to begin training, earn points, and level up your placement eligibility.</p>
      </div>

      {/* Grid of Buildings */}
      <div style={styles.grid}>
        {BUILDINGS.map((b) => {
          const IconComponent = b.icon;
          return (
            <div 
              key={b.id} 
              className="game-card" 
              style={{ ...styles.card, '--accent-color': b.color }}
              onClick={() => setGame(b.id)}
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={{ ...styles.iconWrapper, backgroundColor: `rgba(${hexToRgb(b.color)}, 0.1)`, borderColor: b.color }}>
                  <IconComponent size={28} color={b.color} />
                </div>
                <div style={styles.difficultyBadge}>{b.difficulty}</div>
              </div>

              {/* Card Body */}
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{b.title}</h3>
                <h4 style={{ ...styles.cardSubtitle, color: b.color }}>{b.subtitle}</h4>
                <p style={styles.cardDesc}>{b.description}</p>
              </div>

              {/* Card Footer / Rewards */}
              <div style={styles.cardFooter}>
                <div style={styles.rewardBadge}>
                  <Star size={12} fill="#EAB308" color="#EAB308" />
                  <span>{b.reputationReward}</span>
                </div>
                <span className="game-btn game-btn-primary" style={styles.enterBtn}>
                  ENTER SCTOR
                </span>
              </div>

              {/* Glowing Background Accent */}
              <div style={{ ...styles.glowBacklight, backgroundColor: b.color }}></div>
            </div>
          );
        })}
      </div>

      {/* Daily Challenge Board Footer */}
      <div style={styles.dailyBoard}>
        <div style={styles.dailyHeader}>
          <Clock size={16} color="var(--accent-secondary)" />
          <h3 style={styles.dailyTitle}>ACTIVE DAILY MISSION</h3>
        </div>
        <div style={styles.dailyMission}>
          <p style={styles.dailyMissionText}>
            🔥 Solve a **Medium** database breach case in the **Data Bank** today to unlock +50 Coins and +1 Streak multiplier!
          </p>
          <button 
            className="game-btn game-btn-primary" 
            style={styles.dailyBtn}
            onClick={() => setGame('sql-heist')}
          >
            Launch SQL Heist
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert hex to RGB values for transparent borders
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}

const styles = {
  container: {
    padding: '2.5rem',
    overflowY: 'auto',
    height: 'calc(100vh - 70px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  welcomeBanner: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cityBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--accent-secondary)',
    border: '1px solid var(--accent-secondary)',
    padding: '4px 12px',
    borderRadius: '4px',
    letterSpacing: '3px',
    boxShadow: 'var(--glow-secondary)',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
  },
  cityTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '4px',
    marginTop: '0.5rem',
  },
  cityDesc: {
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '280px',
    backgroundColor: 'rgba(19, 23, 34, 0.65)',
    backdropFilter: 'blur(8px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  difficultyBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  cardBody: {
    margin: '1.5rem 0',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '0.25rem',
  },
  cardSubtitle: {
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.75rem',
  },
  cardDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  rewardBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    color: '#EAB308',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  enterBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.7rem',
    letterSpacing: '1px',
  },
  glowBacklight: {
    position: 'absolute',
    bottom: '-30px',
    right: '-30px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    filter: 'blur(50px)',
    opacity: 0.12,
    pointerEvents: 'none',
    transition: 'all 0.3s ease',
  },
  dailyBoard: {
    backgroundColor: 'rgba(6, 182, 212, 0.03)',
    border: '1px dashed rgba(6, 182, 212, 0.15)',
    borderRadius: 'var(--border-radius-md)',
    padding: '1.25rem 2rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backdropFilter: 'blur(4px)',
  },
  dailyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dailyTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    color: 'var(--accent-secondary)',
  },
  dailyMission: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  dailyMissionText: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  dailyBtn: {
    padding: '0.4rem 1rem',
    fontSize: '0.75rem',
    borderColor: 'var(--accent-secondary)',
    color: 'var(--accent-secondary)',
    boxShadow: 'var(--glow-secondary)',
  }
};
