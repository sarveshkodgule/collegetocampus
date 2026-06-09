import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Briefcase, Heart, Award, ShieldAlert, Star, Users, MessageSquare } from 'lucide-react';

const STORY_NODES = {
  start: {
    speaker: 'Rohan (Senior Backend Dev)',
    avatar: '👨‍💻',
    text: 'Welcome to the team! No time to ease in, unfortunately. The server is throwing 500 Internal Errors and our client demo is in 30 minutes. What is your first move?',
    options: [
      { text: '🔍 Log into the production server and inspect tail logs.', next: 'check_logs' },
      { text: '🙋 Ask Rohan if there is a checklist or runbook for outages.', next: 'ask_runbook' },
      { text: '🤷 Say it is probably a frontend bug and check your emails.', next: 'blame_game' }
    ]
  },
  check_logs: {
    speaker: 'Terminal Shell logs',
    avatar: '💻',
    text: 'LOGS: "FATAL: connection limit exceeded for database postgres". The connection pool has exhausted!',
    options: [
      { text: '⚙️ Raise the DB pool size limit in the database configuration.', next: 'raise_pool' },
      { text: '⚠️ Bruteforce restart the PostgreSQL server to clear sessions.', next: 'restart_db' }
    ]
  },
  ask_runbook: {
    speaker: 'Rohan (Senior Backend Dev)',
    avatar: '👨‍💻',
    text: 'Good choice. Standard operating procedure says we check the replica lag first. Oh, look! The replica is lagging by 10GB. The primary server is overloaded with read operations.',
    options: [
      { text: '🚀 Redirect all analytical reporting reads to the read-replica.', next: 'redirect_reads' },
      { text: '🔌 Disable the analytical dashboard temporarily.', next: 'disable_dashboard' }
    ]
  },
  blame_game: {
    speaker: 'Neha (Tech Lead)',
    avatar: '👩‍💼',
    text: 'नेहा comments: "That dashboard is server-side rendered. It is definitely not a simple client bug." Rohan looks unimpressed by your attempt to deflect. Your Office Reputation drops!',
    options: [
      { text: '🏃 Apologize and check the server logs.', next: 'check_logs' },
      { text: '🙋 Ask Rohan for the runbook.', next: 'ask_runbook' }
    ]
  },
  raise_pool: {
    speaker: 'Rohan (Senior Backend Dev)',
    avatar: '👨‍💻',
    text: 'Outstanding! The server connections cleared up, and latency returned to normal. We shipped the client demo with 100% uptime!',
    ending: 'success',
    coins: 100,
    xp: 50,
    rep: 30
  },
  restart_db: {
    speaker: 'System Alert',
    avatar: '🚨',
    text: 'CRITICAL: Database did not shutdown cleanly. Data corruptions detected. We missed the client demo. The team is furious.',
    ending: 'failure',
    coins: 10,
    xp: 10,
    rep: -20
  },
  redirect_reads: {
    speaker: 'Neha (Tech Lead)',
    avatar: '👩‍💼',
    text: 'Excellent architectural choice! Offloading queries to the read replica resolved the primary database exhaustion instantly. The client was super impressed by our system design!',
    ending: 'success',
    coins: 120,
    xp: 60,
    rep: 40
  },
  disable_dashboard: {
    speaker: 'Client feedback',
    avatar: '🏢',
    text: 'The primary dashboard was disabled during the demo. While we survived, the client was disappointed they couldn\'t review their logs. Semi-successful launch.',
    ending: 'neutral',
    coins: 50,
    xp: 20,
    rep: 10
  }
};

export default function InternshipDetective() {
  const { addCoins, addXP, setGame } = usePlayerStore();

  const [currentNode, setCurrentNode] = useState('start');
  const [techSkill, setTechSkill] = useState(10);
  const [diplomacy, setDiplomacy] = useState(10);

  const handleSelectOption = (opt) => {
    // Increment virtual stats for flavor
    if (opt.next === 'check_logs') setTechSkill(prev => prev + 10);
    if (opt.next === 'ask_runbook') setDiplomacy(prev => prev + 10);
    if (opt.next === 'blame_game') setDiplomacy(prev => prev - 10);
    
    setCurrentNode(opt.next);
  };

  const claimEnding = (node) => {
    addCoins(node.coins);
    addXP(node.xp);
    setGame(null);
  };

  const node = STORY_NODES[currentNode];

  return (
    <div style={styles.container}>
      <div className="game-card" style={styles.vnPanel}>
        {/* VN Header */}
        <div style={styles.vnHeader}>
          <div style={styles.badge}>
            <Briefcase size={14} color="var(--accent-color)" />
            <span>INTERNSHIP INCIDENT FILE</span>
          </div>
          <div style={styles.vnStats}>
            <span style={styles.vStat}>💻 TECH: {techSkill}</span>
            <span style={styles.vStat}>🤝 DIPLOMACY: {diplomacy}</span>
          </div>
        </div>

        {/* Narrative Box */}
        {!node.ending ? (
          <div style={styles.narrativeWorkspace}>
            {/* Visual Speaker */}
            <div style={styles.speakerBox}>
              <span style={styles.speakerAvatar} className="float-animation">{node.avatar}</span>
              <span style={styles.speakerName}>{node.speaker}</span>
            </div>

            {/* Dialog speech bubble */}
            <div style={styles.speechBubble}>
              <p style={styles.speechText}>"{node.text}"</p>
            </div>

            {/* Branch Choices */}
            <div style={styles.choicesGrid}>
              {node.options.map((opt, idx) => (
                <button 
                  key={idx}
                  className="game-btn game-card"
                  style={styles.choiceBtn}
                  onClick={() => handleSelectOption(opt)}
                >
                  <MessageSquare size={16} color="var(--accent-color)" style={{ minWidth: '16px' }} />
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Ending view */
          <div style={styles.endingBox}>
            <div style={styles.speakerAvatar} className="float-animation">
              {node.ending === 'success' ? '🏆' : node.ending === 'failure' ? '💔' : '⚠️'}
            </div>
            <h3 style={{ ...styles.endingTitle, color: node.ending === 'success' ? 'var(--success-color)' : node.ending === 'failure' ? 'var(--danger-color)' : 'var(--warning-color)' }}>
              {node.ending === 'success' ? 'LAUNCH SUCCESSFUL' : node.ending === 'failure' ? 'LAUNCH FAILED' : 'PARTIAL LAUNCH'}
            </h3>
            
            <p style={styles.endingDesc}>{node.text}</p>

            <div style={styles.rewardsPanel}>
              <h4 style={{ color: 'var(--accent-color)', marginBottom: '4px' }}>Incident Payout:</h4>
              <div>💎 +{node.coins} Coins added</div>
              <div>⚡ +{node.xp} XP applied</div>
              <div style={{ color: node.rep >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                ⭐ {node.rep >= 0 ? `+${node.rep}` : node.rep} Office Reputation
              </div>
            </div>

            <button className="game-btn game-btn-primary" onClick={() => claimEnding(node)}>
              Complete Case
            </button>
          </div>
        )}
      </div>
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
  vnPanel: {
    width: '100%',
    maxWidth: '750px',
    backgroundColor: 'rgba(23, 27, 38, 0.9)',
    borderWidth: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  vnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.75rem',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-color)',
    fontWeight: '700',
  },
  vnStats: {
    display: 'flex',
    gap: '1.25rem',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
  },
  vStat: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '4px 10px',
    borderRadius: '4px',
  },
  narrativeWorkspace: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  speakerBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  speakerAvatar: {
    fontSize: '2.5rem',
  },
  speakerName: {
    fontWeight: '800',
    fontSize: '1.05rem',
    color: 'var(--accent-secondary)',
  },
  speechBubble: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderLeft: '4px solid var(--accent-color)',
    padding: '1.5rem',
    borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0',
  },
  speechText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
  choicesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  choiceBtn: {
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255,255,255,0.05)',
    padding: '1rem 1.25rem',
    width: '100%',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    textAlign: 'left',
  },
  endingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.25rem',
    padding: '1.5rem 0',
  },
  endingTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    letterSpacing: '2px',
  },
  endingDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    maxWidth: '500px',
  },
  rewardsPanel: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
    fontSize: '0.85rem',
  }
};
