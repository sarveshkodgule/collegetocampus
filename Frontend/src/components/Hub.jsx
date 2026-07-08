import React, { useEffect, useState } from 'react';
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
  Star,
  Shield,
  Laptop,
  Database
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
  },
  {
    id: 'resume-tycoon',
    title: 'Development Center',
    subtitle: 'Resume Builder Tycoon',
    description: 'Life simulator. Allocate weekly hours, study DSA, deploy repos, and network to graduate with elite portfolios.',
    icon: Laptop,
    color: '#F97316', // Orange
    accentClass: 'theme-resume-tycoon',
    difficulty: 'Strategy',
    reputationReward: '+45 Rep'
  },
  {
    id: 'code-snake',
    title: 'Code Snake Arena',
    subtitle: 'Code Snake Traversal',
    description: 'Navigate the compiler grid as a data stream. Collect syntax keywords, deploy blocks, and eliminate logic loops!',
    icon: Terminal,
    color: '#10B981', // Emerald
    accentClass: 'theme-code-snake',
    difficulty: 'Medium',
    reputationReward: '+120 Rep'
  },
  {
    id: 'ai-master',
    title: 'AI Master Challenge',
    subtitle: 'AI Master Show',
    description: 'Futuristic TV game show. Answer AI/ML challenges, use model lifelines, bypass safe thresholds, and claim Champion standing.',
    icon: Trophy,
    color: '#00F3FF', // Cyan
    accentClass: 'theme-ai-master',
    difficulty: 'Hard',
    reputationReward: '+150 Rep'
  }
];

export default function Hub() {
  const { setGame, coins, streak, rank } = usePlayerStore();
  const [codexOpen, setCodexOpen] = useState(false);
  const [codexTab, setCodexTab] = useState('algo');

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
      case 'code-inspector':
        title = "Code Inspector: Code Decryptor Manual";
        lines = [
          "GAME CONCEPT & AUDITING",
          "Identify and patch compilation and logical bugs in modern codebase files.",
          "Read code line snippets, spot error locations, and fix them under lock.",
          "",
          "DEBUGGING TACTICS",
          "* Array Indices: Verify loop bounds do not trigger index out of bounds.",
          "* Null Pointers: Check reference null pointers before invoking attributes.",
          "* Logical conditions: Match variable comparison expressions.",
          "",
          "LEVEL SOLUTIONS (HINTS)",
          "* Level 1 (Python dict): Correct key mappings syntax.",
          "* Level 2 (JS arrays): Correct loop checks to prevent double increments.",
          "* Level 3 (C++ references): Correct pointer addresses."
        ];
        break;
      case 'interview-escape':
        title = "Assessment Suite: Interview Escape Room Manual";
        lines = [
          "GAME MISSION",
          "Solve progressive coding and architecture interview riddles under lock.",
          "Traverse SQL databases, memory structures, API networks, and system gates.",
          "",
          "SECTOR OUTLINES",
          "* Room 1 (Entry Gate): Answer basic syntax definitions.",
          "* Room 2 (Database Locker): Match relational queries and index keys.",
          "* Room 3 (API Firewall): Fix rate-limiting and authorization headers.",
          "* Room 4 (System Core): Diagnose replica lags and data pipelines.",
          "* Room 5 (Placement Board): Answer advanced System Design parameters."
        ];
        break;
      case 'resume-tycoon':
        title = "Development Center: Resume Builder Tycoon Manual";
        lines = [
          "GAME STRATEGY",
          "Life simulation. Manage weekly hour distributions across semesters.",
          "Balance sleep, studying DSA, deploying projects, and networking.",
          "",
          "CORE METRICS",
          "* GPA standing: Study in the library to raise academic metrics.",
          "* SDE stats: Practice coding in the lab to unlock React/Python nodes.",
          "* Energy level: rest in hostel room to recover health.",
          "* Project Stars: Complete high-quality hackathons.",
          "",
          "PLACEMENT SUCCESS HINTS",
          "Upgrade laptop configurations in the shop to gain speed boosts.",
          "Accept recruiter interviews at placement cell in Semester 4.",
          "Verify company qualifications (Google, Netflix, OpenAI) before applying."
        ];
        break;
      case 'code-snake':
        title = "Code Snake Arena Player Manual";
        lines = [
          "GAME CONCEPT",
          "Navigate the compiler grid as an AI data stream. Collect syntax",
          "tokens to complete coding missions while dodging bugs and virus files.",
          "",
          "CONTROLS & SHORTCUTS",
          "* Keyboard: Use Arrow Keys or WASD keys to redirect the snake stream.",
          "* Mobile: Tap the glassmorphic on-screen d-pad arrow buttons.",
          "",
          "LIFELINE POWER-UPS",
          "* Debug Shield (🛡️): Absorbs one wrong token or self-collision impact.",
          "* Speed Boost (⚡): Accelerates speed ticks and doubles score ratings.",
          "* Token Magnet (🧲): Attracts correct syntax tokens toward the head.",
          "* Time Freeze (❄️): suspends active countdown timers for 8 seconds.",
          "* Syntax Scanner (🔍): Highlights the next target token in cyan.",
          "",
          "CRITICAL TACTICS",
          "1. Only eat correct tokens (e.g. def, :, return for Python).",
          "2. Avoid wrong keywords to prevent tail shrinking and combo resets.",
          "3. Dodge crawling bugs (🐛) and hunting viruses (👾) on grid points."
        ];
        break;
      case 'ai-master':
        title = "AI Master Challenge Player Manual";
        lines = [
          "Futuristic TV game show. Answer AI/ML challenges to rank up",
          "from AI Beginner to the ultimate title of AI Champion.",
          "",
          "SAFETY THRESHOLDS (KBC RULES)",
          "* Safe Havens: Question 4 and Question 7 are checkpoints.",
          "* If you fail a later question, your progress drops back to",
          "  the last safety haven, preserving partial XP and coins.",
          "",
          "MODEL LIFELINES",
          "* 50:50 Scanner: Scan and wipe two incorrect answers from screen.",
          "* AI Mentor: Generates constructive mathematical ML suggestions.",
          "* Dataset Preview: Inspect row logs or database features.",
          "* Compute Time: Inject +30 seconds of compute time to the clock.",
          "",
          "ML TOPICS CHEATSHEET",
          "* Step 1-3: Python dicts, NumPy ravel/ndim, and Pandas dropna.",
          "* Step 4-6: Precision/Recall ratios, L1/L2 penalties, and CNN striding.",
          "* Step 7-10: LSTM cell gates, self-attention, and DQN target nets."
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

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loadingDaily, setLoadingDaily] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        const fallbackMocks = [
          { name: 'Linus Torvalds', avatar: '🐧', rank: 'Architect', xp: 2400, email: 'linus@torvalds.org' },
          { name: 'Thomas Anderson', avatar: '🕶️', rank: 'Tech Lead', xp: 1800, email: 'neo@matrix.io' },
          { name: 'Sarah Connor', avatar: '🦾', rank: 'Developer', xp: 1200, email: 'sconnor@cyberdyne.com' }
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
        setLoadingLeaderboard(false);
      })
      .catch(() => {
        setLoadingLeaderboard(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('http://localhost:5000/api/daily-challenge', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDailyChallenge(data);
        }
        setLoadingDaily(false);
      })
      .catch(() => {
        setLoadingDaily(false);
      });
  }, []);

  useEffect(() => {
    // Play cyberpunk city ambient loop
    playHubBgm();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCodexOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      stopHubBgm();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap-reverse', gap: '2.5rem' }} className="grid-overlay hub-layout-wrapper">
      {/* Left Column: Welcome, Grid of Sectors, Daily Mission */}
      <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* City Title Header */}
        <div style={styles.welcomeBanner}>
          <div style={styles.cityBadge}>SYSTEM MAIN HUB</div>
          <h2 style={styles.cityTitle}>SILICON METROPOLIS</h2>
          <p style={styles.cityDesc}>Select a sector to begin training, earn points, and level up your placement eligibility.</p>
          <button 
            className="game-btn game-btn-primary" 
            style={{ 
              marginTop: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 16px', 
              fontSize: '0.75rem',
              background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #0369a1 100%)',
              boxShadow: 'var(--glow-secondary)',
              borderColor: 'var(--accent-secondary)'
            }}
            onClick={() => {
              setCodexOpen(true);
              localStorage.setItem('metropolis_codex_opened', 'true');
            }}
          >
            <Database size={14} /> 📁 DATABANK CODEX TERMINAL
          </button>
        </div>

        {/* Grid of Buildings */}
        <div style={styles.grid} className="hub-grid">
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
            {loadingDaily ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Syncing rotation matrix...</div>
            ) : dailyChallenge ? (
              <>
                <p style={styles.dailyMissionText}>
                  🔥 <strong>Featured Challenge:</strong> {dailyChallenge.game.desc} (Reward: <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>+{dailyChallenge.coinsReward} Coins</span>, <span style={{ color: '#00F3FF', fontWeight: 'bold' }}>+{dailyChallenge.xpReward} XP</span>)
                </p>
                {dailyChallenge.completed ? (
                  <button 
                    className="game-btn" 
                    style={{ ...styles.dailyBtn, borderColor: 'var(--success-color)', color: 'var(--success-color)', cursor: 'default', backgroundColor: 'transparent' }}
                    disabled
                  >
                    ✅ Completed Today
                  </button>
                ) : (
                  <button 
                    className="game-btn game-btn-primary" 
                    style={styles.dailyBtn}
                    onClick={() => {
                      localStorage.setItem('active_daily_challenge_game', dailyChallenge.game.id);
                      setGame(dailyChallenge.game.id);
                    }}
                  >
                    Launch {dailyChallenge.game.name}
                  </button>
                )}
              </>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>System offline. Check connection.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Live Global Leaderboard (Vertical standings in top corner) */}
      <div style={styles.topLeaderboardBanner} className="game-card vertical-leaderboard-sidebar">
        <div style={styles.leaderboardHeader}>
          <Trophy size={18} color="#EAB308" className="pulse-glow-animation" />
          <div style={styles.leaderboardTitleGroup}>
            <span style={styles.leaderboardMainTitle}>METROPOLIS STANDINGS</span>
            <span style={styles.leaderboardSubtitle}>Top placement contenders (real-time sync)</span>
          </div>
        </div>
        
        <div style={styles.leaderboardRowList}>
          {loadingLeaderboard ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Loading SDE standings...</div>
          ) : (
            leaderboard.slice(0, 5).map((player, idx) => {
              const playerUsername = player.email ? player.email.split('@')[0] : player.name.toLowerCase().replace(/\s+/g, '');
              return (
                <div key={idx} style={styles.leaderboardPill}>
                  <span style={styles.pillRankBadge}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <span style={styles.pillAvatar}>{player.avatar || '🚀'}</span>
                  <div style={styles.pillInfo}>
                    <span style={styles.pillName}>{player.name}</span>
                    <span style={styles.pillRank}>@{playerUsername}</span>
                  </div>
                  <span style={styles.pillXp}>{player.xp} XP</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. CODEX DATABASE OVERLAY MODAL */}
      {codexOpen && (
        <div style={styles.codexModal}>
          <div style={styles.codexContent} className="game-card">
            {/* Header */}
            <div style={styles.codexHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Database size={24} color="var(--accent-secondary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-title)', fontSize: '1.2rem', letterSpacing: '2px', color: '#FFF' }}>
                  METROPOLIS CODEX TERMINAL
                </h3>
              </div>
              <button 
                className="game-btn" 
                style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)', backgroundColor: 'transparent' }}
                onClick={() => setCodexOpen(false)}
              >
                Close databank [ESC]
              </button>
            </div>

            {/* Main Tabs Navigation */}
            <div style={styles.codexTabs}>
              <button 
                style={{ ...styles.codexTabBtn, borderBottom: codexTab === 'algo' ? '2px solid var(--accent-secondary)' : 'none', color: codexTab === 'algo' ? '#FFF' : 'var(--text-secondary)' }}
                onClick={() => setCodexTab('algo')}
              >
                ⚔️ Boss Intel
              </button>
              <button 
                style={{ ...styles.codexTabBtn, borderBottom: codexTab === 'decrypt' ? '2px solid var(--accent-secondary)' : 'none', color: codexTab === 'decrypt' ? '#FFF' : 'var(--text-secondary)' }}
                onClick={() => setCodexTab('decrypt')}
              >
                🔎 Bug Registry
              </button>
              <button 
                style={{ ...styles.codexTabBtn, borderBottom: codexTab === 'escape' ? '2px solid var(--accent-secondary)' : 'none', color: codexTab === 'escape' ? '#FFF' : 'var(--text-secondary)' }}
                onClick={() => setCodexTab('escape')}
              >
                🔑 SQL Cryptography
              </button>
              <button 
                style={{ ...styles.codexTabBtn, borderBottom: codexTab === 'tycoon' ? '2px solid var(--accent-secondary)' : 'none', color: codexTab === 'tycoon' ? '#FFF' : 'var(--text-secondary)' }}
                onClick={() => setCodexTab('tycoon')}
              >
                🎓 Semester Manual
              </button>
            </div>

            {/* Tab Contents */}
            <div style={styles.codexBody}>
              {codexTab === 'algo' && (
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>⚔️ ALGORITHM ARENA - MONSTER INTEL REFERENCE</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Each Boss Golem in the Algorithm Arena is weak against certain complexity types or code paradigms. Use this cheat sheet to anticipate questions:
                  </p>
                  <div style={styles.codexGrid}>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>1. Array Beast:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on memory offset indexing, arrays lookup times (O(1)), and stability in sorting methods.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>2. String Phantom:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on string equality checks (O(min(M, N))) and skip patterns like Knuth-Morris-Pratt (KMP).</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>3. Stack Sentinel:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on Last-In-First-Out (LIFO) recursive buffers and stack tracking algorithms.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>4. Hash Goblin:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on bucket hashing, open addressing, separate chaining, and linear collision run degradation (O(N)).</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>5. Tree Guardian:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on balanced Binary Search Tree heights (O(log N)), tree traversals (In-order sorted output), and BST features.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>6. Heap Chimera:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on heap construction bounds (O(N)), Min/Max heap root index locations (0), and insertions (O(log N)).</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>7. Graph Wyrm:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on BFS queuing, DFS backtracking recursion, V-1 tree edges, and adjacency list worst-case checks (O(V+E)).</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>8. Dijkstra Dragon:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Focuses on single-source paths, negative edge weights conflicts, and priority queue optimizations (O(E log V)).</span>
                    </div>
                  </div>
                </div>
              )}

              {codexTab === 'decrypt' && (
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>🔎 CODE DECRYPTOR - COMPILER THREAT REGISTRY</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Learn to audit source files like a security analyst. Here are common SDE compilation threats:
                  </p>
                  <div style={styles.codexGrid}>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>🐛 Null Pointer / Leaks:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Occurs when assigning core headers or credentials statically to null, or expanding dynamic vectors without deleting pointers.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>💀 SQL Concatenations:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Building database statements via raw string additions allows injections. Remedy using parameterized inputs ($1, ?).</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>👾 Concurrency Mutex Locks:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Iterating dictionary keys or collections directly while deleting items in multiple threads throws runtime exceptions.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>🛡️ Stack Overflows:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Using raw functions like strcpy copies streams indiscriminately. Use safe limits bound calls.</span>
                    </div>
                  </div>
                </div>
              )}

              {codexTab === 'escape' && (
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>🔑 SQL CRYPTOGRAPHY - DATABASE GATEWAYS SHEET</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Escape room panels verify queries dynamically. Review these query structures:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={styles.codeSnippet} className="game-card">
                      <code style={{ color: '#00F3FF', fontSize: '0.8rem' }}>SELECT * FROM security_cameras WHERE status = 'OFFLINE';</code>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Queries offline security locks.</span>
                    </div>
                    <div style={styles.codeSnippet} className="game-card">
                      <code style={{ color: '#00F3FF', fontSize: '0.8rem' }}>SELECT access_code FROM employees JOIN badge_registry ON employees.emp_id = badge_registry.emp_id WHERE name = 'Thomas Anderson';</code>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Binds multiple tables on matching fields recursively.</span>
                    </div>
                  </div>
                </div>
              )}

              {codexTab === 'tycoon' && (
                <div>
                  <h4 style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>🎓 SEMESTER BALANCING MANUAL</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Surviving campus semesters requires balancing energy and learning metrics:
                  </p>
                  <div style={styles.codexGrid}>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>🛌 Hostel Rests:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Energy drops when coding or studying. Take naps or watch podcasts to restore energy.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>📚 Library DSA:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Solve Big-O puzzles to raise DSA scores and CGPA scales.</span>
                    </div>
                    <div style={styles.codexItem} className="game-card">
                      <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem' }}>🛍️ Tech Upgrades:</strong>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Buy SSD rigs or workstations from the shop to compile typing simulator scripts double-time.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  },
  topLeaderboardBanner: {
    width: '320px',
    padding: '1.5rem',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 243, 255, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem',
    alignSelf: 'stretch',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto',
  },
  leaderboardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.75rem',
  },
  leaderboardTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  leaderboardMainTitle: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#FFF',
  },
  leaderboardSubtitle: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
  },
  leaderboardRowList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '100%',
  },
  leaderboardPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    width: '100%',
    justifyContent: 'space-between',
  },
  pillRankBadge: {
    fontWeight: 'bold',
  },
  pillAvatar: {
    fontSize: '1rem',
  },
  pillInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  pillName: {
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: '1.2',
  },
  pillRank: {
    fontSize: '0.55rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  pillXp: {
    fontWeight: 'bold',
    color: '#00F3FF',
    marginLeft: 'auto',
  },
  codexModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '2rem',
  },
  codexContent: {
    maxWidth: '850px',
    width: '100%',
    maxHeight: '85vh',
    height: '100%',
    backgroundColor: 'var(--bg-secondary)',
    border: '2px solid var(--accent-secondary)',
    borderRadius: '16px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: 'var(--glow-secondary)',
  },
  codexHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1rem',
  },
  codexTabs: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  codexTabBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-title)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  codexBody: {
    flex: 1,
    overflowY: 'auto',
    textAlign: 'left',
    paddingRight: '8px',
  },
  codexGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  codexItem: {
    padding: '1rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  codeSnippet: {
    padding: '12px 18px',
    backgroundColor: '#05070c',
    border: '1px solid rgba(0, 243, 255, 0.15)',
    borderRadius: '6px',
    fontFamily: 'var(--font-mono)',
  }
};
