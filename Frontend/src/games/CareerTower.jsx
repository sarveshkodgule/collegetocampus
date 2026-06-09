import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Compass, Award, Star, Code, Cpu, Server, Database } from 'lucide-react';

const CLASSES = [
  {
    id: 'Frontend Mage',
    desc: 'Wields CSS grids and JavaScript spells to construct flawless, responsive interfaces.',
    icon: Code,
    color: '#06B6D4',
    bonus: '+20% Speed in Apti-Rush'
  },
  {
    id: 'Backend Guardian',
    desc: 'Shields databases with robust server architectures and optimized SQL query pipelines.',
    icon: Server,
    color: '#3B82F6',
    bonus: 'Bypass 1 IDS Alert in SQL Heist'
  },
  {
    id: 'AI Alchemist',
    desc: 'Combines Python libraries and tensor matrices to predict future trends.',
    icon: Cpu,
    color: '#A855F7',
    bonus: '+15% Critical Damage in Arena'
  }
];

const SKILL_NODES = [
  { id: 'html_css', label: 'HTML & CSS basics', cost: 50, category: 'Frontend', requires: null },
  { id: 'javascript', label: 'JS Async & ES6', cost: 80, category: 'Frontend', requires: 'html_css' },
  { id: 'react_core', label: 'React Hook Mastery', cost: 120, category: 'Frontend', requires: 'javascript' },
  
  { id: 'db_basics', label: 'SQL Table Structs', cost: 60, category: 'Backend', requires: null },
  { id: 'db_joins', label: 'Multi-table JOINs', cost: 90, category: 'Backend', requires: 'db_basics' },
  { id: 'db_index', label: 'Index Optimization', cost: 130, category: 'Backend', requires: 'db_joins' },

  { id: 'python', label: 'Python & Pandas', cost: 70, category: 'AI', requires: null },
  { id: 'neural_nets', label: 'Deep Learning', cost: 140, category: 'AI', requires: 'python' }
];

export default function CareerTower() {
  const { classType, setClass, coins, addCoins, unlockedSkills, unlockSkill } = usePlayerStore();

  const handleSelectClass = (clsId) => {
    setClass(clsId);
    // Give some starting coins
    addCoins(50);
  };

  const handleUnlockNode = (node) => {
    if (coins < node.cost) {
      alert("⚠️ Insufficient coins! Complete more daily challenges or clear Apti-Rush to earn currency.");
      return;
    }
    if (node.requires && !unlockedSkills.includes(node.requires)) {
      alert(`⚠️ Prerequisite locked! Unlock "${SKILL_NODES.find(n => n.id === node.requires).label}" first.`);
      return;
    }
    unlockSkill(node.id);
    addCoins(-node.cost);
  };

  return (
    <div style={styles.container}>
      {/* 1. CLASS SELECTION SCREEN */}
      {!classType ? (
        <div style={styles.lobbyPanel} className="game-card">
          <Compass size={64} color="var(--accent-secondary)" className="float-animation" />
          <h2 style={styles.title}>CHOOSE YOUR DEVELOPER CLASS</h2>
          <p style={styles.desc}>
            Select your path to unlock your custom Career Skill Tree. Your starting class gives you unique passive bonuses across the city districts.
          </p>

          <div style={styles.classesGrid}>
            {CLASSES.map((cls) => {
              const ClsIcon = cls.icon;
              return (
                <div key={cls.id} style={styles.classCard} className="game-card">
                  <div style={{ ...styles.iconBg, backgroundColor: `rgba(${hexToRgb(cls.color)}, 0.1)`, borderColor: cls.color }}>
                    <ClsIcon size={24} color={cls.color} />
                  </div>
                  <h3 style={styles.classTitle}>{cls.id}</h3>
                  <p style={styles.classDesc}>{cls.desc}</p>
                  <div style={{ ...styles.classBonus, color: cls.color }}>🎁 Passive: {cls.bonus}</div>
                  <button 
                    className="game-btn game-btn-primary" 
                    style={{ ...styles.selectBtn, backgroundColor: cls.color }}
                    onClick={() => handleSelectClass(cls.id)}
                  >
                    Select Class
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. THE SKILL TREE GRID */
        <div style={styles.treePanel}>
          <div style={styles.treeHeader}>
            <div style={styles.classBadge}>
              <Award size={14} color="var(--accent-color)" />
              <span>ACTIVE CLASS: {classType}</span>
            </div>
            <h2 style={styles.title}>CAREER ARCHITECT TREE</h2>
            <p style={styles.desc}>
              Spend coins earned from placements to unlock advanced tech stacks. Unlocking nodes unlocks higher paying quests in GigaCorp!
            </p>
          </div>

          <div style={styles.treeGrid}>
            {['Frontend', 'Backend', 'AI'].map((cat) => (
              <div key={cat} className="game-card" style={styles.columnCard}>
                <h3 style={styles.columnTitle}>{cat} Specialization</h3>
                <div style={styles.nodesList}>
                  {SKILL_NODES.filter(node => node.category === cat).map((node) => {
                    const isUnlocked = unlockedSkills.includes(node.id);
                    const isSelectable = !node.requires || unlockedSkills.includes(node.requires);
                    
                    let nodeStyle = { ...styles.nodeCard };
                    if (isUnlocked) {
                      nodeStyle.borderColor = 'var(--success-color)';
                      nodeStyle.boxShadow = 'var(--glow-success)';
                    } else if (!isSelectable) {
                      nodeStyle.opacity = 0.5;
                      nodeStyle.cursor = 'not-allowed';
                    }

                    return (
                      <div key={node.id} style={nodeStyle} className="game-card">
                        <div style={styles.nodeBody}>
                          <span style={styles.nodeName}>{node.label}</span>
                          {isUnlocked ? (
                            <span style={styles.unlockedText}>✅ UNLOCKED</span>
                          ) : (
                            <button 
                              className="game-btn" 
                              style={styles.unlockBtn} 
                              disabled={!isSelectable}
                              onClick={() => handleUnlockNode(node)}
                            >
                              🔑 {node.cost} Coins
                            </button>
                          )}
                        </div>
                        {node.requires && !isUnlocked && (
                          <div style={styles.reqText}>
                            Req: {SKILL_NODES.find(n => n.id === node.requires).label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 70px)',
    width: '100vw',
  },
  lobbyPanel: {
    maxWidth: '900px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    backgroundColor: 'rgba(10, 15, 36, 0.7)',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    letterSpacing: '2px',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    maxWidth: '650px',
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginTop: '1.5rem',
    width: '100%',
  },
  classCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    minHeight: '260px',
  },
  iconBg: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  classDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  classBonus: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700',
  },
  selectBtn: {
    marginTop: 'auto',
    border: 'none',
    color: '#fff',
    width: '100%',
  },
  treePanel: {
    width: '100%',
    maxWidth: '1000px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    justifyContent: 'center',
  },
  treeHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  classBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid var(--accent-color)',
    padding: '4px 12px',
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--accent-color)',
    letterSpacing: '1px',
    boxShadow: 'var(--glow-accent)',
  },
  treeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  columnCard: {
    backgroundColor: 'rgba(5, 7, 24, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: '380px',
  },
  columnTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    color: 'var(--accent-color)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem',
    letterSpacing: '1px',
  },
  nodesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  nodeCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  nodeBody: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeName: {
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  unlockBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem',
    letterSpacing: '0',
  },
  unlockedText: {
    fontSize: '0.7rem',
    color: 'var(--success-color)',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  reqText: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  }
};
