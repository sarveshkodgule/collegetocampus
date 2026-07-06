import React, { useEffect } from 'react';
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

import { jsPDF } from 'jspdf';
import { playHubBgm, stopHubBgm, playCardHover } from '../games/utils/audio';

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
  },
  {
    id: 'code-inspector',
    title: 'PR Review Sector',
    subtitle: 'Code Inspector',
    description: 'Stop software disasters! Scan, debug, and eliminate BUG-0 corrupted code in a live, animated IDE cockpit.',
    icon: Terminal,
    color: '#EC4899', // Fuchsia
    accentClass: 'theme-code-inspector',
    difficulty: 'Critical',
    reputationReward: '+35 Rep'
  },
  {
    id: 'interview-escape',
    title: 'Assessment Suite',
    subtitle: 'Interview Escape Room',
    description: 'Solve technical riddles under lock! Traverse SQL, DSA, debugging, and behavioral rooms to earn the Offer Letter.',
    icon: Shield,
    color: '#00F3FF', // Cyan
    accentClass: 'theme-interview-escape',
    difficulty: 'Adventure',
    reputationReward: '+60 Rep'
  }
];

export default function Hub() {
  const { setGame, coins, streak, rank } = usePlayerStore();

  const handleDownloadPDF = (gameId) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // Dark blue #1e3a8a
    
    let title = '';
    let lines = [];
    
    switch(gameId) {
      case 'career-tower':
        title = "Career Tower: Life Architect Player Manual";
        lines = [
          "GAME CONCEPT & LEVELING SYSTEM",
          "Reimagines a developer's career roadmap as a giant constellation skill tree.",
          "Players select a Starting Class, complete contracts, earn gold/XP, and",
          "spend Focus Points to light up skill stars. Upgrading nodes directly improves",
          "your placement capability stats.",
          "",
          "SELECTING YOUR CLASS ARCHE-TYPE",
          "* Frontend Mage: UI/UX & React wizardry. Starts with +2 Focus Points,",
          "  +10 Velocity (reduces cooldown times by 15%).",
          "* Backend Guardian: Database & API wall. Starts with +50 Coins and",
          "  +10 Complexity Depth (reduces query latency costs by 15%).",
          "* AI Alchemist: Neural networks & model tuner. Starts with +50 XP and",
          "  +10 DSA Intelligence (deals 15% extra damage in the DSA Arena).",
          "* UI/UX Rogue: Styling & Design master. Starts with +50 Reputation and",
          "  +10 Synergy Charisma (boosts trust gains in visual novel stories by 15%).",
          "",
          "THE STRATEGY PLAYBOOK",
          "1. Contracts Board: Accept freelance gigs from the metropolis lobby. Complete",
          "   coding tasks under pressure to build currency reserves.",
          "2. Constellation Nodes: Unlocking nodes awards stat gains. Balance your build",
          "   between UI, databases, and algorithms to qualify for top-tier jobs.",
          "3. Risks & Outages: Failing a contract task costs 1 Heart. If hearts hit 0,",
          "   your system locks out. Spend 50 coins in the profile center to reboot.",
          "4. Market Swings: Career markets shift dynamically. Node costs and quest rewards",
          "   fluctuate based on sector demand."
        ];
        break;
      case 'sql-heist':
        title = "Data Bank: SQL Heist Player Manual";
        lines = [
          "MISSION OBJECTIVE",
          "Hack relational database terminals inside a high-security vault.",
          "Inspect table schemas, formulate SQL statements, track database",
          "intruders, and recover security files.",
          "",
          "STUDENT SQL CHEAT SHEET",
          "* SELECT: Speficies target columns to retrieve.",
          "* WHERE: Filters rows matching criteria (e.g. status = 'OFFLINE').",
          "* JOIN / ON: Links matching primary keys across tables.",
          "* GROUP BY: Aggregates records. Use HAVING to filter grouped data.",
          "* ORDER BY: Sorts records (ASC/DESC). Use LIMIT to restrict rows.",
          "",
          "CASE LEVEL SOLVE CODES (HINTS)",
          "* Case 1 (Security cams): SELECT location FROM security_cameras",
          "  WHERE status = 'OFFLINE' to find open access spots.",
          "* Case 2 (Employee clearance): SELECT access_code FROM badge_registry",
          "  JOIN employees ON badge_registry.emp_id = employees.emp_id",
          "  WHERE name = 'Sarah Connor'.",
          "* Case 3 (Intruder traces): SELECT ip_address FROM network_logs",
          "  WHERE action = 'DENIED' GROUP BY ip_address HAVING count(*) > 1."
        ];
        break;
      case 'algo-arena':
        title = "DSA Arena: Algorithm Arena Player Manual";
        lines = [
          "GAME CONCEPT & FIGHTER SCHEME",
          "Battle data structures monsters inside the computer memory heap.",
          "Attack beasts by choosing the optimal algorithmic complexity for coding solutions.",
          "",
          "MONSTER WEAKNESS MANUAL",
          "* Array Beast (Level 1): Vulnerable to Indexing & Binary Search.",
          "  * Strategy: Access arrays in O(1) constant time, binary search in O(log n).",
          "* String Phantom (Level 2): Vulnerable to Pattern Matching & String manipulations.",
          "  * Strategy: KMP algorithms search substrings in O(N+M) linear time.",
          "* Tree Golem (Level 3): Vulnerable to Recursion & Graph traversals.",
          "  * Strategy: BFS/DFS traversals visit all tree nodes in O(V+E) time.",
          "",
          "COMPLEXITY ATTACKS CHEAT SHEET",
          "* O(1) [Ultimate attack]: Direct index access, HashMap lookups.",
          "* O(log n) [Strong slash]: Binary search in sorted arrays.",
          "* O(n) [Linear swipe]: Single loop array traversals.",
          "* O(n log n) [Dual strike]: Optimal sorting (Merge Sort / Quick Sort).",
          "* O(n^2) [Weak tackle]: Nested loops (Bubble Sort / Selection Sort)."
        ];
        break;
      case 'apti-rush':
        title = "Aptitude District: Apti Rush Player Manual";
        lines = [
          "GAME CONCEPT & RUNNER SPEEDRUN",
          "A high-speed mathematical runner. Solve reasoning and verbal puzzles",
          "in under 10 seconds to dodge sector obstacles and maintain multipliers.",
          "",
          "PUZZLE SOLVER SHORTCUTS",
          "* Combined Work rates: Time taken by A & B together = (X × Y) / (X + Y).",
          "* Speed Conversion: Convert km/h to m/s by multiplying by 5/18.",
          "* Percentage Splits: Calculate 15% as 10% + half of 10%.",
          "* Profit & Loss: Selling Price = Cost Price × (100 + Profit%) / 100.",
          "",
          "STREAK & SCORE SYSTEMS",
          "1. Correct answers increase your streak counter.",
          "2. Streak milestones (5, 10, 20) double your combo score multiplier.",
          "3. High combo multiplier grants extra coins and placement credits."
        ];
        break;
      case 'startup-garage':
        title = "Startup Garage Tycoon Player Manual";
        lines = [
          "GAME CONCEPT & METRICS PANEL",
          "Tycoon simulation where you grow a SaaS company from a small garage.",
          "Allocate development sprints and build a tech giant.",
          "",
          "CORE STATS METERS",
          "* Cash Flow: Salaries + servers consume money. Bankruptcy hits if cash is 0.",
          "* Hype Index: Attracts users and raises company valuation.",
          "* Code Quality: Prevents server bugs. Low code quality halts user growth.",
          "* Monthly Recurring Revenue (MRR): Direct income generated from users.",
          "",
          "DEVELOPMENT SPRINTS GUIDE",
          "* Feature Sprints: Raise product tier and boost MRR cashflow.",
          "* QA Sprints: squash server bugs and clean server logs.",
          "* Marketing Sprints: Build public hype and accelerate user onboarding.",
          "* Server Upgrades: Reduce latency to maximize onboarding speed."
        ];
        break;
      case 'internship-detective':
        title = "Internship Detective Visual Novel Player Manual";
        lines = [
          "GAME CONCEPT & INVESTIGATION STEPS",
          "Survive SDE incident outages and git conflict reviews.",
          "Connect clues on the pinboard corkboard, manage relationship meters,",
          "and pitch system fixes to the Tech Lead.",
          "",
          "DIPLOMATIC SCORE METER",
          "* Rohan (Senior Dev): Skeptical backend wizard. Trust rises by checking SOP runbooks.",
          "* Neha (Tech Lead): Diplomatic planner. Alignment rises by prioritizing clients.",
          "",
          "CASE FILE WALKTHROUGHS",
          "* Level 1 (DB Outage): Connect Server logs + Replica lag metrics.",
          "  * Fix: Redirect analytical reads to secondary replica.",
          "* Level 2 (Git Conflict): Connect Git commits + Code diff reports.",
          "  * Fix: Revert buggy commit, resolve locally, push test suites.",
          "* Level 3 (API Gateway): Connect Traffic spams + Firewall settings.",
          "  * Fix: Deploy Nginx token-bucket IP Rate limiter reverse proxies."
        ];
        break;
      default:
        title = "Silicon Metropolis Placement Manual";
        lines = [
          "Choose a training sector card to solve placement challenges, earn coins,",
          "gain reputation, and build your placement eligibility rating."
        ];
    }
    
    // Draw Title
    doc.text(title, 20, 20);
    
    // Subtitle / Header bar
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);
    
    // Draw Body text
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // Slate gray #334155
    
    let y = 35;
    lines.forEach((line) => {
      // If line is empty, skip and add vertical spacing
      if (line === "") {
        y += 6;
        return;
      }
      
      // If line is a header section (all caps, no bullet)
      if (line === line.toUpperCase() && !line.startsWith("*") && !line.startsWith("1")) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(37, 99, 235); // Blue #2563eb
        y += 4;
        doc.text(line, 20, y);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        y += 6;
      } else {
        doc.text(line, 20, y);
        y += 6;
      }
      
      // Handle page overflow if needed
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    
    // Save/Download PDF
    const filename = `${gameId}_placement_guide.pdf`;
    doc.save(filename);
  };

  useEffect(() => {
    // Play cyberpunk city ambient loop
    playHubBgm();
    return () => stopHubBgm();
  }, []);

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
              onMouseEnter={playCardHover}
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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    className="game-btn" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', borderColor: b.color, color: b.color, backgroundColor: 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPDF(b.id);
                    }}
                  >
                    📄 Guide PDF
                  </button>
                  <span className="game-btn game-btn-primary" style={styles.enterBtn}>
                    ENTER SECTOR
                  </span>
                </div>
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
