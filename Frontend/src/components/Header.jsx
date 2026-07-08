import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Heart, Coins, Flame, Trophy, Award, RefreshCw, Home } from 'lucide-react';

export default function Header() {
  const { 
    name, 
    avatar, 
    rank, 
    xp, 
    coins, 
    hearts, 
    maxHearts, 
    streak, 
    activeGame, 
    setGame,
    resetGame 
  } = usePlayerStore();

  // Simple XP calculation for visual bar
  // Leveling brackets: 100 XP per level approx for early game
  const xpInCurrentLevel = xp % 100;
  const level = Math.floor(xp / 100) + 1;
  const progressPercent = Math.min(100, xpInCurrentLevel);

  return (
    <header style={styles.header} className="game-header">
      {/* Brand / Title */}
      <div style={styles.brand} onClick={() => setGame(null)}>
        <span style={styles.logoIcon}>🎮</span>
        <h1 style={styles.logoText}>PLACEMENT QUEST</h1>
      </div>

      {/* Stats Panel */}
      <div style={styles.statsContainer} className="game-header-stats">
        {/* Streak */}
        <div style={styles.statItem} title="Daily Streak">
          <Flame size={18} color="#FF5722" className="float-animation" />
          <span style={{ ...styles.statVal, color: '#FF5722' }}>{streak}d</span>
        </div>

        {/* Hearts */}
        <div style={styles.statItem} title="Hearts (Lives)">
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: maxHearts }).map((_, idx) => (
              <Heart 
                key={idx} 
                size={16} 
                fill={idx < hearts ? '#EF4444' : 'transparent'} 
                color={idx < hearts ? '#EF4444' : '#4B5563'} 
                style={{ filter: idx < hearts ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' : 'none' }}
              />
            ))}
          </div>
        </div>

        {/* Coins */}
        <div style={styles.statItem} title="Placement Coins">
          <Coins size={18} color="#F59E0B" />
          <span style={{ ...styles.statVal, color: '#F59E0B' }}>{coins}</span>
        </div>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Player Level & XP */}
        <div style={styles.profileSection} onClick={() => setGame('profile')}>
          <div style={styles.avatar}>{avatar}</div>
          <div style={styles.profileInfo}>
            <div style={styles.profileName}>
              {name} <span style={styles.levelBadge}>LVL {level}</span>
            </div>
            <div style={styles.rankContainer}>
              <Award size={12} color="var(--accent-color)" />
              <span style={styles.rankText}>{rank}</span>
            </div>
            <div style={styles.xpBarContainer}>
              <div style={{ ...styles.xpBarFill, width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={styles.navButtons}>
          {activeGame && (
            <button 
              className="game-btn" 
              style={styles.navBtn} 
              onClick={() => setGame(null)}
              title="Return to City Hub"
            >
              <Home size={16} />
              <span>Hub</span>
            </button>
          )}
          <button 
            className="game-btn" 
            style={{ ...styles.navBtn, borderColor: '#EF4444', color: '#EF4444' }} 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all progress?")) {
                resetGame();
              }
            }}
            title="Reset Game"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '70px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    position: 'relative',
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  logoIcon: {
    fontSize: '1.8rem',
    filter: 'drop-shadow(0 0 8px var(--accent-color))',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    letterSpacing: '3px',
    background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
  },
  statsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '0.5rem 0.8rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.03)',
  },
  statVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  divider: {
    width: '1px',
    height: '30px',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  avatar: {
    fontSize: '1.75rem',
    backgroundColor: 'var(--bg-tertiary)',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--accent-color)',
    boxShadow: 'var(--glow-accent)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  profileName: {
    fontWeight: '600',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  levelBadge: {
    fontSize: '0.7rem',
    backgroundColor: 'var(--accent-secondary)',
    color: '#000',
    fontWeight: '800',
    padding: '1px 6px',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
  },
  rankContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  rankText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  xpBarContainer: {
    width: '120px',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '2px',
  },
  xpBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))',
    borderRadius: '2px',
  },
  navButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  navBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.75rem',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
};
