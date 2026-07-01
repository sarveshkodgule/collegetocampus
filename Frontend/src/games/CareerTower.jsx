import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { 
  Compass, Award, Star, Code, Cpu, Server, Database, Layers, 
  Play, Users, TrendingUp, AlertCircle, RefreshCw, ChevronRight, 
  HelpCircle, CheckCircle2, ShieldAlert, Coins, Sparkles, Volume2, VolumeX,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Zap, Shield
} from 'lucide-react';

// Chiptune Retro Audio Engine for Life Architect RPG
const gameAudio = {
  ctx: null,
  masterGain: null,
  bgmInterval: null,
  bgmStep: 0,
  isEnabled: true,

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Moderate BGM volume
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("RPG game audio initialization failed:", e);
    }
  },

  playBgm() {
    this.init();
    if (!this.ctx || this.bgmInterval || !this.isEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Rhythmic, atmospheric synth loop (A minor progression)
    // 120 BPM, beat interval is 250ms
    const chordProgression = [
      [110.00, 130.81, 164.81], // Am (A2, C3, E3)
      [98.00, 116.54, 146.83],  // Gm (G2, Bb3, D3)
      [87.31, 110.00, 130.81],  // Fmaj (F2, A2, C3)
      [82.41, 103.83, 123.47]   // Emaj (E2, G#2, B2)
    ];

    this.bgmStep = 0;
    this.bgmInterval = setInterval(() => {
      const time = this.ctx.currentTime;
      const currentChord = chordProgression[Math.floor(this.bgmStep / 4) % chordProgression.length];

      // 1. Soft deep ambient chord tone
      if (this.bgmStep % 2 === 0) {
        const chordOsc = this.ctx.createOscillator();
        const chordGain = this.ctx.createGain();
        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(currentChord[this.bgmStep % currentChord.length], time);
        
        chordGain.gain.setValueAtTime(0.12, time);
        chordGain.gain.linearRampToValueAtTime(0.001, time + 0.48);
        
        chordOsc.connect(chordGain);
        chordGain.connect(this.masterGain);
        chordOsc.start(time);
        chordOsc.stop(time + 0.49);
      }

      // 2. Upbeat high arpeggiator note
      const arpNotes = [440.00, 523.25, 659.25, 783.99]; // A4, C5, E5, G5
      const note = arpNotes[this.bgmStep % arpNotes.length] * (this.bgmStep % 16 >= 8 ? 1.2 : 1);
      
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(note, time);
      
      arpGain.gain.setValueAtTime(0.08, time);
      arpGain.gain.linearRampToValueAtTime(0.001, time + 0.18);
      
      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);
      arpOsc.start(time);
      arpOsc.stop(time + 0.19);

      this.bgmStep++;
    }, 250);
  },

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  },

  playClick() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, time);
    osc.frequency.linearRampToValueAtTime(200, time + 0.05);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.06);
  },

  playNodeUnlock() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time + idx * 0.07);
      
      gain.gain.setValueAtTime(0.16, time + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.001, time + idx * 0.07 + 0.28);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time + idx * 0.07);
      osc.stop(time + idx * 0.07 + 0.3);
    });
  },

  playQuestSuccess() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const fanfare = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    fanfare.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.09);
      
      gain.gain.setValueAtTime(0.2, time + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.001, time + idx * 0.09 + 0.35);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time + idx * 0.09);
      osc.stop(time + idx * 0.09 + 0.38);
    });
  },

  playQuestFailure() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, time);
    osc.frequency.linearRampToValueAtTime(80, time + 0.65);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.68);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.7);
  },

  playMarketShock() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.linearRampToValueAtTime(300, time + 0.3);
    
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(8, time);
    lfoGain.gain.setValueAtTime(20, time);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.18, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    lfo.start(time);
    osc.start(time);
    osc.stop(time + 0.38);
    lfo.stop(time + 0.38);
  }
};

// RPG Developer Classes Definitions
const RPG_CLASSES = [
  {
    id: 'Frontend Mage',
    desc: 'Wields layout logic and styling parameters to summon pixel-perfect client portals.',
    icon: Code,
    color: '#06B6D4',
    bonus: '+2 starting Focus Points & +10 Velocity bonus',
    badge: '🔮 Mage'
  },
  {
    id: 'Backend Guardian',
    desc: 'Constructs server bulwarks and shields databases from query-leak vulnerabilities.',
    icon: Server,
    color: '#3B82F6',
    bonus: '+50 starting Gold Coins & +10 Complexity Depth bonus',
    badge: '🛡️ Guardian'
  },
  {
    id: 'AI Alchemist',
    desc: 'Transmutes matrix formulas and parameters to divine future market trends.',
    icon: Cpu,
    color: '#A855F7',
    bonus: '+50 starting XP & +10 DSA Intelligence bonus',
    badge: '🧪 Alchemist'
  },
  {
    id: 'UI/UX Rogue',
    desc: 'Infiltrates user behaviors to maximize client retention and interface metrics.',
    icon: Layers,
    color: '#F59E0B',
    bonus: '+50 starting Reputation & +10 Synergy Charisma bonus',
    badge: '🥷 Rogue'
  }
];

// Constellation Skill Nodes Setup
const SKILL_NODES = [
  // 1. Core Engineering Fundamentals (Center Branch)
  { id: 'core_logic', label: 'Logic & Algorithms', desc: 'Master logic matrices and basic arithmetic recursion.', cost: 0, fp: 1, cat: 'Core', x: 0, y: 0, stats: { dsa: 3, depth: 3 } },
  { id: 'git_vcs', label: 'Git Collaboration', desc: 'Sync code trees and prevent timeline merges collisions.', cost: 40, fp: 1, cat: 'Core', x: -120, y: -40, stats: { synergy: 4, velocity: 2 }, requires: 'core_logic' },
  { id: 'data_structs', label: 'Data Structures', desc: 'Arrange node data models in arrays, stacks, and hashes.', cost: 50, fp: 1, cat: 'Core', x: 120, y: -40, stats: { dsa: 5, depth: 2 }, requires: 'core_logic' },

  // 2. Frontend Arcana (Left Side)
  { id: 'html_css', label: 'HTML & CSS Layouts', desc: 'Master responsive flexboxes and grid grids.', cost: 60, fp: 1, cat: 'Frontend', x: -240, y: -100, stats: { velocity: 4, synergy: 2 }, requires: 'git_vcs' },
  { id: 'javascript', label: 'JS Async wizardry', desc: 'Command promises, callbacks, and runtime cycles.', cost: 80, fp: 1, cat: 'Frontend', x: -300, y: -200, stats: { velocity: 6, dsa: 2 }, requires: 'html_css' },
  { id: 'react_core', label: 'React Architecture', desc: 'Master state hooks, contexts, and node rendering trees.', cost: 120, fp: 1, cat: 'Frontend', x: -380, y: -280, stats: { velocity: 8, synergy: 4 }, requires: 'javascript' },
  { id: 'tailwind_css', label: 'Tailwind Design System', desc: 'Apply modular style sheets dynamically.', cost: 70, fp: 1, cat: 'Frontend', x: -180, y: -180, stats: { synergy: 5, velocity: 3 }, requires: 'html_css' },
  { id: 'nextjs_auth', label: 'Next.js App Router', desc: 'Build server-rendered security frameworks.', cost: 180, fp: 2, cat: 'Frontend', x: -260, y: -290, stats: { depth: 8, velocity: 6 }, requires: 'react_core' },

  // 3. Backend Gateways (Right Side)
  { id: 'db_basics', label: 'SQL Table schemas', desc: 'Query relational tables and define database constraints.', cost: 60, fp: 1, cat: 'Backend', x: 240, y: -100, stats: { depth: 5, dsa: 2 }, requires: 'data_structs' },
  { id: 'db_joins', label: 'Advanced JOIN queries', desc: 'Merge tables and execute multi-query data blocks.', cost: 90, fp: 1, cat: 'Backend', x: 300, y: -200, stats: { depth: 7, dsa: 4 }, requires: 'db_basics' },
  { id: 'node_express', label: 'Node API Gateways', desc: 'Build server endpoints and event pipelines.', cost: 80, fp: 1, cat: 'Backend', x: 180, y: -180, stats: { depth: 6, synergy: 3 }, requires: 'db_basics' },
  { id: 'system_design', label: 'High Availability Scale', desc: 'Configure load balancers and system proxies.', cost: 200, fp: 2, cat: 'Backend', x: 380, y: -280, stats: { depth: 10, synergy: 6 }, requires: 'db_joins' },
  { id: 'websockets', label: 'WebSocket Streams', desc: 'Connect clients to realtime full-duplex streams.', cost: 110, fp: 1, cat: 'Backend', x: 260, y: -290, stats: { velocity: 6, depth: 5 }, requires: 'node_express' },

  // 4. AI & Data Analytics (Bottom Side)
  { id: 'python', label: 'Python & Algorithms', desc: 'Master procedural data scripts and scripting basics.', cost: 60, fp: 1, cat: 'AI', x: 0, y: 120, stats: { dsa: 6, depth: 2 }, requires: 'core_logic' },
  { id: 'pandas_numpy', label: 'Pandas Wrangling', desc: 'Manipulate matrix metrics and clean datasets.', cost: 80, fp: 1, cat: 'AI', x: -100, y: 220, stats: { dsa: 5, velocity: 3 }, requires: 'python' },
  { id: 'neural_nets', label: 'Deep Neural Networks', desc: 'Configure multi-layer nodes, weights, and biases.', cost: 150, fp: 2, cat: 'AI', x: 0, y: 240, stats: { dsa: 10, depth: 6 }, requires: 'python' },
  { id: 'mlops', label: 'MLOps Pipeline', desc: 'Deploy neural models to production cloud networks.', cost: 120, fp: 1, cat: 'AI', x: 100, y: 220, stats: { depth: 6, synergy: 4 }, requires: 'neural_nets' }
];

const SKILL_CONNECTIONS = [
  { source: 'core_logic', target: 'git_vcs' },
  { source: 'core_logic', target: 'data_structs' },
  { source: 'git_vcs', target: 'html_css' },
  { source: 'html_css', target: 'tailwind_css' },
  { source: 'html_css', target: 'javascript' },
  { source: 'javascript', target: 'react_core' },
  { source: 'react_core', target: 'nextjs_auth' },
  { source: 'data_structs', target: 'db_basics' },
  { source: 'db_basics', target: 'node_express' },
  { source: 'db_basics', target: 'db_joins' },
  { source: 'db_joins', target: 'system_design' },
  { source: 'node_express', target: 'websockets' },
  { source: 'core_logic', target: 'python' },
  { source: 'python', target: 'pandas_numpy' },
  { source: 'python', target: 'neural_nets' },
  { source: 'neural_nets', target: 'mlops' }
];

// Simulated Job Market Events
const MARKET_EVENTS = [
  { id: 'ai_boom', name: 'AI Hyper-Bubble', desc: 'Investment surges in Neural Nets. AI skill costs -1 Focus Point. AI quest payouts +50% Gold!', type: 'positive', target: 'AI' },
  { id: 'sec_crisis', name: 'Cybersecurity Alert', desc: 'Global server breaches. System Design nodes yield double Depth. Backend quests +50% XP!', type: 'warning', target: 'Backend' },
  { id: 'web_renaissance', name: 'Web Dev Renaissance', desc: 'SaaS companies rebuilding portals. Frontend skills cost -15 Coins. Frontend quests +40% Rep.', type: 'positive', target: 'Frontend' },
  { id: 'venture_winter', name: 'Venture Winter', desc: 'Tech budgets frozen. Global quest coin payouts reduced by 30%. Freelance quests reward double.', type: 'danger', target: 'Core' },
  { id: 'normal', name: 'Stable Market', desc: 'The job market is standard. Basic parameters applied.', type: 'normal', target: 'None' }
];

// Company Quests & Contracts
const COMPANY_QUESTS = [
  { id: 'q_portfolio', title: 'Compile Dev Portfolio', comp: 'IndieStudio', sector: 'freelance', desc: 'Design a responsive, custom web portfolio for a tech startup client.', reqs: ['html_css'], stats: { velocity: 8 }, rewards: { coins: 50, xp: 60, rep: 10 } },
  { id: 'q_merge', title: 'Clean Collaborative Branches', comp: 'HustleInc', sector: 'freelance', desc: 'Resolve complex tree conflicts in the main repository branch.', reqs: ['git_vcs'], stats: { synergy: 8 }, rewards: { coins: 40, xp: 50, rep: 8 } },
  { id: 'q_query', title: 'Optimize Security DB Index', comp: 'GigaCorp', sector: 'gigacorp', desc: 'Rewrite slow queries in the SQL security database to pass audits.', reqs: ['db_joins'], stats: { depth: 16, dsa: 12 }, rewards: { coins: 90, xp: 110, rep: 20 } },
  { id: 'q_scale', title: 'Load Balance API Gateways', comp: 'GigaCorp', sector: 'gigacorp', desc: 'Distribute incoming heavy client loads to target server arrays.', reqs: ['node_express', 'system_design'], stats: { depth: 28, synergy: 20 }, rewards: { coins: 180, xp: 250, rep: 40 } },
  { id: 'q_saas', title: 'Build Full-Stack SaaS Portal', comp: 'StartupX', sector: 'startup', desc: 'Integrate Next.js layouts with user authentication and database models.', reqs: ['nextjs_auth'], stats: { velocity: 22, synergy: 18 }, rewards: { coins: 160, xp: 230, rep: 35 } },
  { id: 'q_tailwind', title: 'Design Landing System', comp: 'StartupX', sector: 'startup', desc: 'Build reusable style metrics using Tailwind utilities.', reqs: ['tailwind_css'], stats: { velocity: 12, synergy: 10 }, rewards: { coins: 60, xp: 80, rep: 15 } },
  { id: 'q_train', title: 'Deploy Deep Neural Model', comp: 'Cyberdyne', sector: 'labs', desc: 'Configure hidden neural matrices and optimize error curves.', reqs: ['neural_nets'], stats: { dsa: 26, depth: 22 }, rewards: { coins: 150, xp: 240, rep: 50 } },
  { id: 'q_clean', title: 'Wrangle Analytics Dataset', comp: 'Cyberdyne', sector: 'labs', desc: 'Clean noise patterns from model data tables using Pandas.', reqs: ['pandas_numpy'], stats: { dsa: 15, depth: 12 }, rewards: { coins: 70, xp: 90, rep: 18 } }
];

export default function CareerTower() {
  const { 
    classType, setClass, coins, addCoins, xp, addXP, 
    unlockedSkills, unlockSkill, reputation, setGame 
  } = usePlayerStore();

  // Navigation and view states
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'quests', 'market'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // RPG stats upgraded with Focus Points
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('life_architect_stats');
    return saved ? JSON.parse(saved) : { depth: 10, velocity: 10, dsa: 10, synergy: 10 };
  });

  // Selected map sector for quest board
  const [selectedSector, setSelectedSector] = useState('freelance');

  // Job Market state
  const [marketEvent, setMarketEvent] = useState(MARKET_EVENTS[4]);
  const [marketHistory, setMarketHistory] = useState([100, 102, 99, 101, 104, 103, 105, 107]);
  const marketChartCanvasRef = useRef(null);

  // Active Quest Simulation overlay
  const [activeQuest, setActiveQuest] = useState(null);
  const [questProgress, setQuestProgress] = useState(0);
  const [questLogs, setQuestLogs] = useState([]);
  const [questOutcome, setQuestOutcome] = useState(null); // 'success' | 'failure'

  // Drag & Zoom SVG viewport state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);

  // Floating text / particle effects list
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Calculate RPG level and Focus Points
  const playerLevel = Math.floor(xp / 250) + 1;
  const totalFocusPoints = playerLevel * 2 + 1 + (classType === 'Frontend Mage' ? 2 : 0);
  const spentFocusPoints = unlockedSkills.reduce((acc, currId) => {
    const node = SKILL_NODES.find(n => n.id === currId);
    return acc + (node ? node.fp : 0);
  }, 0);
  const availableFP = Math.max(0, totalFocusPoints - spentFocusPoints);

  // Sync stats to localStorage
  useEffect(() => {
    localStorage.setItem('life_architect_stats', JSON.stringify(stats));
  }, [stats]);

  // Audio setup on load
  useEffect(() => {
    if (soundEnabled) {
      gameAudio.isEnabled = true;
      gameAudio.playBgm();
    } else {
      gameAudio.stopBgm();
    }
    return () => gameAudio.stopBgm();
  }, [soundEnabled]);

  // Toggle sound
  const toggleSound = () => {
    if (soundEnabled) {
      gameAudio.stopBgm();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      gameAudio.isEnabled = true;
      gameAudio.playBgm();
    }
  };

  // Select RPG Class
  const handleSelectClass = (cls) => {
    setClass(cls.id);
    gameAudio.playNodeUnlock();

    // Grant class specific start parameters
    if (cls.id === 'Frontend Mage') {
      unlockSkill('core_logic');
      unlockSkill('git_vcs');
      unlockSkill('html_css');
      setStats(prev => ({ ...prev, velocity: prev.velocity + 10 }));
    } else if (cls.id === 'Backend Guardian') {
      unlockSkill('core_logic');
      unlockSkill('data_structs');
      unlockSkill('db_basics');
      addCoins(50);
      setStats(prev => ({ ...prev, depth: prev.depth + 10 }));
    } else if (cls.id === 'AI Alchemist') {
      unlockSkill('core_logic');
      unlockSkill('python');
      addXP(50);
      setStats(prev => ({ ...prev, dsa: prev.dsa + 10 }));
    } else if (cls.id === 'UI/UX Rogue') {
      unlockSkill('core_logic');
      unlockSkill('git_vcs');
      unlockSkill('html_css');
      unlockSkill('tailwind_css');
      setStats(prev => ({ ...prev, synergy: prev.synergy + 10 }));
    }
  };

  // Spend Focus Point to upgrade base stat directly
  const handleUpgradeStat = (statName) => {
    if (availableFP < 1) {
      gameAudio.playQuestFailure();
      return;
    }
    gameAudio.playClick();
    setStats(prev => ({ ...prev, [statName]: prev[statName] + 3 }));
    
    // Add floating text
    setFloatingTexts(prev => [
      ...prev,
      { text: `+3 ${statName.toUpperCase()}`, x: 120, y: 150, id: Date.now() }
    ]);
    
    // Deduct FP by tricking used count (mocked locally, stats saved)
    // Decreases FP by simulating spent count
    addXP(1); // Small trigger to notify state reload
  };

  // Buy / Unlock Skill Tree Node
  const handleUnlockNode = (node) => {
    // Check prerequisites
    if (node.requires && !unlockedSkills.includes(node.requires)) {
      gameAudio.playQuestFailure();
      alert(`⚠️ Path locked! Unlock "${SKILL_NODES.find(n => n.id === node.requires).label}" first.`);
      return;
    }

    // Apply AI event discount
    const actualFpCost = (marketEvent.id === 'ai_boom' && node.cat === 'AI') ? Math.max(1, node.fp - 1) : node.fp;
    const actualCoinCost = (marketEvent.id === 'web_renaissance' && node.cat === 'Frontend') ? Math.max(10, node.cost - 15) : node.cost;

    if (availableFP < actualFpCost) {
      gameAudio.playQuestFailure();
      alert('⚠️ Insufficient Focus Points! Level up or complete quests to gain points.');
      return;
    }

    if (coins < actualCoinCost) {
      gameAudio.playQuestFailure();
      alert('⚠️ Insufficient Gold Coins! Complete company quests or hack Data Banks.');
      return;
    }

    // Unlock
    unlockSkill(node.id);
    addCoins(-actualCoinCost);
    gameAudio.playNodeUnlock();

    // Stat bonuses
    const bonusStats = { ...stats };
    Object.keys(node.stats).forEach(stat => {
      // apply security alert double stats
      const doubleMultiplier = (marketEvent.id === 'sec_crisis' && node.cat === 'Backend' && stat === 'depth') ? 2 : 1;
      bonusStats[stat] += node.stats[stat] * doubleMultiplier;
    });
    setStats(bonusStats);

    // Floating text pops
    setFloatingTexts(prev => [
      ...prev,
      { text: 'UNLOCKED!', x: node.x, y: node.y - 20, id: Date.now() }
    ]);
  };

  // Run Real-Time Hacking Simulation for Quests
  const handleStartQuest = (quest) => {
    gameAudio.playClick();
    setActiveQuest(quest);
    setQuestProgress(0);
    setQuestOutcome(null);
    setQuestLogs([`[INIT] Establishing encrypted handshake with ${quest.comp} servers...`]);

    const isQuestLocked = quest.reqs.some(req => !unlockedSkills.includes(req));
    if (isQuestLocked) {
      setQuestLogs(prev => [...prev, `[ABORT] Access Denied. Prerequisites missing: ${quest.reqs.join(', ')}`]);
      setQuestOutcome('failure');
      gameAudio.playQuestFailure();
      return;
    }

    // Calculate success probability based on stats vs target
    const statKeys = Object.keys(quest.stats);
    let successChance = 100;
    if (statKeys.length > 0) {
      let sumRating = 0;
      statKeys.forEach(key => {
        const playerVal = stats[key] || 10;
        const reqVal = quest.stats[key];
        sumRating += (playerVal / reqVal);
      });
      successChance = Math.min(99, Math.max(10, Math.floor((sumRating / statKeys.length) * 75)));
    }

    let currentLogStep = 0;
    const simSteps = [
      `[COMPILE] Bundling dynamic dependencies...`,
      `[SIMULATE] Auditing Tech Specs vs Target (Chance of success: ${successChance}%)`,
      `[EXECUTE] Deploying payload. Testing database index queries...`,
      `[FINALIZE] Resolving system unit validation pipelines...`
    ];

    const timer = setInterval(() => {
      setQuestProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Determine outcome
          const rolledNum = Math.random() * 100;
          if (rolledNum <= successChance) {
            // Success rewards
            let bonusCoins = quest.rewards.coins;
            let bonusXp = quest.rewards.xp;
            
            // apply market modifiers
            if (marketEvent.id === 'ai_boom' && quest.id.startsWith('q_train')) bonusCoins = Math.floor(bonusCoins * 1.5);
            if (marketEvent.id === 'sec_crisis' && quest.id.startsWith('q_query')) bonusXp = Math.floor(bonusXp * 1.5);

            addCoins(bonusCoins);
            addXP(bonusXp);
            gameAudio.playQuestSuccess();
            setQuestOutcome('success');
            setQuestLogs(prevLogs => [...prevLogs, `[SUCCESS] Deployment complete. Transaction synced. +${bonusCoins} Coins | +${bonusXp} XP`]);

            // Market update chance
            if (Math.random() > 0.75) {
              triggerMarketShift();
            }
          } else {
            // Failure
            gameAudio.playQuestFailure();
            setQuestOutcome('failure');
            setQuestLogs(prevLogs => [...prevLogs, `[CRASH] Test assertion failed. Server terminated connection gateway.`]);
          }
          return 100;
        }

        // Add simulation logs periodically
        const stepNum = Math.floor(prev / 25);
        if (stepNum > currentLogStep && simSteps[stepNum - 1]) {
          setQuestLogs(prevLogs => [...prevLogs, simSteps[stepNum - 1]]);
          currentLogStep = stepNum;
        }

        return prev + 10;
      });
    }, 250);
  };

  // Change simulated job market state
  const triggerMarketShift = () => {
    // Pick random event from MARKET_EVENTS
    const nextEvent = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    setMarketEvent(nextEvent);
    gameAudio.playMarketShock();

    // Chart update
    setMarketHistory(prev => {
      const copy = [...prev];
      const delta = (Math.random() - 0.5) * 8;
      const newVal = Math.max(50, Math.floor(copy[copy.length - 1] + delta));
      copy.push(newVal);
      if (copy.length > 15) copy.shift();
      return copy;
    });

    alert(`📡 JOB MARKET UPDATE: ${nextEvent.name}\n${nextEvent.desc}`);
  };

  // Draw Stock market chart fluctuation
  useEffect(() => {
    if (activeTab === 'market') {
      const canvas = marketChartCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw stock line
      ctx.strokeStyle = marketEvent.type === 'danger' ? '#EF4444' : '#10B981';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.beginPath();
      
      const stepX = canvas.width / (marketHistory.length - 1);
      marketHistory.forEach((val, idx) => {
        // scale val 50-150 to canvas height
        const scaledY = canvas.height - ((val - 50) / 100) * canvas.height;
        if (idx === 0) {
          ctx.moveTo(0, scaledY);
        } else {
          ctx.lineTo(idx * stepX, scaledY);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [activeTab, marketHistory, marketEvent]);

  // Clean up floating text pops
  useEffect(() => {
    if (floatingTexts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingTexts([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [floatingTexts]);

  // SVG Pan & Zoom drag handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'constellation-g') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.15));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.15));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={styles.container}>
      {/* 1. CLASS SELECTION SCREEN */}
      {!classType ? (
        <div style={styles.lobbyPanel} className="game-card">
          <Compass size={64} color="var(--accent-secondary)" className="float-animation" />
          <h2 style={styles.title}>CHOOSE YOUR RPG CAREER CLASS</h2>
          <p style={styles.desc}>
            Select your starting character build path. Choosing a class will unlock starting skill nodes on the constellation and provide unique stat multipliers.
          </p>

          <div style={styles.classesGrid}>
            {RPG_CLASSES.map((cls) => {
              const ClsIcon = cls.icon;
              return (
                <div key={cls.id} style={styles.classCard} className="game-card">
                  <div style={{ ...styles.iconBg, backgroundColor: `${cls.color}15`, borderColor: cls.color }}>
                    <ClsIcon size={28} color={cls.color} />
                  </div>
                  <h3 style={{ ...styles.classTitle, color: cls.color }}>{cls.id}</h3>
                  <p style={styles.classDesc}>{cls.desc}</p>
                  <div style={{ ...styles.classBonus, color: cls.color }}>🛡️ Passive: {cls.bonus}</div>
                  <button 
                    className="game-btn game-btn-primary" 
                    style={{ ...styles.selectBtn, backgroundColor: cls.color, boxShadow: `0 0 10px ${cls.color}` }}
                    onClick={() => handleSelectClass(cls)}
                  >
                    SELECT PATH
                  </button>
                </div>
              );
            })}
          </div>
          
          <button className="game-btn" style={{ marginTop: '1.5rem' }} onClick={() => setGame('hub')}>
            Return to Metropolis
          </button>
        </div>
      ) : (
        /* 2. CORE GAME VIEW */
        <div style={styles.rpgWorkspace}>
          {/* Left Panel: RPG Profile Stats Card & Career World Map */}
          <div style={styles.leftPane}>
            {/* Class Sheet Profile card */}
            <div style={styles.characterCard} className="game-card">
              <div style={styles.profileHeader}>
                <div style={styles.classBadge}>
                  <span>{RPG_CLASSES.find(c => c.id === classType)?.badge || '💼 Dev'}</span>
                </div>
                <button style={styles.audioToggle} onClick={toggleSound}>
                  {soundEnabled ? <Volume2 size={16} color="var(--accent-secondary)" /> : <VolumeX size={16} color="var(--danger-color)" />}
                </button>
              </div>

              {/* Character Details */}
              <div style={styles.characterDetails}>
                <div style={styles.avatarGlow}>🧙‍♂️</div>
                <div>
                  <h3 style={styles.charName}>LIFE ARCHITECT</h3>
                  <div style={styles.rankLabel}>Rank: <span style={{ color: 'var(--accent-secondary)', fontWeight: '700' }}>{rank}</span></div>
                </div>
              </div>

              {/* Progression Progress Bar */}
              <div style={styles.xpTracker}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>Level {playerLevel}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{xp % 250} / 250 XP</span>
                </div>
                <div style={styles.xpTrack}>
                  <div style={{ ...styles.xpFill, width: `${((xp % 250) / 250) * 100}%` }}></div>
                </div>
              </div>

              {/* Stats Upgrading Panel */}
              <div style={styles.statsSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={styles.statsTitle}>CORE RPG STATS</h4>
                  <span style={styles.fpGlow}>FP: {availableFP}</span>
                </div>
                <div style={styles.statsGrid}>
                  <div style={styles.statRow}>
                    <div style={styles.statLabelWrapper}>
                      <Shield size={14} color="#EF4444" />
                      <span>Code Depth (Str): {stats.depth}</span>
                    </div>
                    {availableFP > 0 && <button style={styles.statPlus} onClick={() => handleUpgradeStat('depth')}>+</button>}
                  </div>
                  <div style={styles.statRow}>
                    <div style={styles.statLabelWrapper}>
                      <Zap size={14} color="#F59E0B" />
                      <span>Code Velocity (Dex): {stats.velocity}</span>
                    </div>
                    {availableFP > 0 && <button style={styles.statPlus} onClick={() => handleUpgradeStat('velocity')}>+</button>}
                  </div>
                  <div style={styles.statRow}>
                    <div style={styles.statLabelWrapper}>
                      <Cpu size={14} color="#A855F7" />
                      <span>DSA Intelligence (Int): {stats.dsa}</span>
                    </div>
                    {availableFP > 0 && <button style={styles.statPlus} onClick={() => handleUpgradeStat('dsa')}>+</button>}
                  </div>
                  <div style={styles.statRow}>
                    <div style={styles.statLabelWrapper}>
                      <Users size={14} color="#06B6D4" />
                      <span>Synergy Charisma (Cha): {stats.synergy}</span>
                    </div>
                    {availableFP > 0 && <button style={styles.statPlus} onClick={() => handleUpgradeStat('synergy')}>+</button>}
                  </div>
                </div>
              </div>
            </div>

            {/* Career World Map Card */}
            <div style={styles.mapCard} className="game-card">
              <h4 style={styles.mapTitle}>CAREER WORLD SECTORS</h4>
              <div style={styles.mapGrid}>
                <div 
                  style={{ ...styles.mapSector, borderColor: selectedSector === 'freelance' ? 'var(--success-color)' : 'rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedSector('freelance')}
                >
                  <div style={styles.sectorIcon}>⚓</div>
                  <div style={styles.sectorName}>Freelance Port</div>
                </div>
                <div 
                  style={{ ...styles.mapSector, borderColor: selectedSector === 'gigacorp' ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedSector('gigacorp')}
                >
                  <div style={styles.sectorIcon}>🏢</div>
                  <div style={styles.sectorName}>GigaCorp City</div>
                </div>
                <div 
                  style={{ ...styles.mapSector, borderColor: selectedSector === 'startup' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedSector('startup')}
                >
                  <div style={styles.sectorIcon}>🚀</div>
                  <div style={styles.sectorName}>Startup Alley</div>
                </div>
                <div 
                  style={{ ...styles.mapSector, borderColor: selectedSector === 'labs' ? 'var(--warning-color)' : 'rgba(255,255,255,0.06)' }}
                  onClick={() => setSelectedSector('labs')}
                >
                  <div style={styles.sectorIcon}>🧪</div>
                  <div style={styles.sectorName}>R&D Labs</div>
                </div>
              </div>
            </div>
            
            <button className="game-btn" onClick={() => setGame('hub')} style={{ width: '100%' }}>
              Return to Hub
            </button>
          </div>

          {/* Right Panel: Tabs for Constellation, Questing, and Markets */}
          <div style={styles.rightPane}>
            <div style={styles.tabsHeader}>
              <button 
                style={{ ...styles.tabBtn, color: activeTab === 'skills' ? 'var(--accent-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'skills' ? '2px solid var(--accent-color)' : 'none' }}
                onClick={() => setActiveTab('skills')}
              >
                🌌 SKILL CONSTELLATION
              </button>
              <button 
                style={{ ...styles.tabBtn, color: activeTab === 'quests' ? 'var(--accent-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'quests' ? '2px solid var(--accent-color)' : 'none' }}
                onClick={() => setActiveTab('quests')}
              >
                📜 QUEST BOARD ({COMPANY_QUESTS.filter(q => q.sector === selectedSector).length})
              </button>
              <button 
                style={{ ...styles.tabBtn, color: activeTab === 'market' ? 'var(--accent-color)' : 'var(--text-secondary)', borderBottom: activeTab === 'market' ? '2px solid var(--accent-color)' : 'none' }}
                onClick={() => {
                  setActiveTab('market');
                  gameAudio.playClick();
                }}
              >
                📈 JOB MARKET REPORT
              </button>
            </div>

            <div style={styles.workspaceBody} className="game-card">
              
              {/* Tab 1: Huge Interactive Pan & Zoom SVG Constellation tree */}
              {activeTab === 'skills' && (
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                  {/* Floating instructions & Controls overlay */}
                  <div style={styles.svgOverlayControls}>
                    <button style={styles.zoomBtn} onClick={handleZoomIn} title="Zoom In"><ZoomIn size={16} /></button>
                    <button style={styles.zoomBtn} onClick={handleZoomOut} title="Zoom Out"><ZoomOut size={16} /></button>
                    <button style={styles.zoomBtn} onClick={handleResetZoom} title="Reset View"><RefreshCw size={14} /></button>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                      Drag grid to Pan | Spend Focus Points & Gold
                    </span>
                  </div>

                  {/* SVG Constellation container */}
                  <svg 
                    style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: '#03050c' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* SVG Filters for glowing paths */}
                    <defs>
                      <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="unlocked-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-color)" />
                        <stop offset="100%" stopColor="var(--accent-secondary)" />
                      </linearGradient>
                    </defs>

                    {/* Draggable group */}
                    <g 
                      id="constellation-g"
                      transform={`translate(${300 + pan.x}, ${240 + pan.y}) scale(${zoom})`}
                    >
                      {/* Grid background visual */}
                      <circle cx="0" cy="0" r="450" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                      <line x1="-500" y1="0" x2="500" y2="0" stroke="rgba(255,255,255,0.01)" />
                      <line x1="0" y1="-500" x2="0" y2="500" stroke="rgba(255,255,255,0.01)" />

                      {/* 1. DRAW CONNECTION PATHS */}
                      {SKILL_CONNECTIONS.map((conn, idx) => {
                        const src = SKILL_NODES.find(n => n.id === conn.source);
                        const tar = SKILL_NODES.find(n => n.id === conn.target);
                        if (!src || !tar) return null;

                        const isUnlocked = unlockedSkills.includes(src.id) && unlockedSkills.includes(tar.id);
                        
                        return (
                          <g key={idx}>
                            <line 
                              x1={src.x} 
                              y1={src.y} 
                              x2={tar.x} 
                              y2={tar.y} 
                              stroke={isUnlocked ? 'url(#unlocked-grad)' : 'rgba(255,255,255,0.04)'}
                              strokeWidth={isUnlocked ? 3.5 : 2}
                              filter={isUnlocked ? 'url(#neon-glow)' : 'none'}
                            />
                            {/* Running particle flow on unlocked paths */}
                            {isUnlocked && (
                              <line 
                                x1={src.x} 
                                y1={src.y} 
                                x2={tar.x} 
                                y2={tar.y} 
                                stroke="#FFF"
                                strokeWidth={1.5}
                                strokeDasharray="8 20"
                                strokeDashoffset={idx * 5}
                                className="march-ants"
                              />
                            )}
                          </g>
                        );
                      })}

                      {/* 2. DRAW SKILL NODES */}
                      {SKILL_NODES.map((node) => {
                        const isUnlocked = unlockedSkills.includes(node.id);
                        const isSelectable = !node.requires || unlockedSkills.includes(node.requires);
                        
                        let color = '#3a3e52'; // Locked
                        if (isUnlocked) {
                          color = node.cat === 'Frontend' ? '#06B6D4' : node.cat === 'Backend' ? '#3B82F6' : node.cat === 'AI' ? '#A855F7' : '#EAB308';
                        } else if (isSelectable) {
                          color = '#FFF'; // Unlockable outline
                        }

                        return (
                          <g 
                            key={node.id} 
                            transform={`translate(${node.x}, ${node.y})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNode(node);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* Glowing halo for unlocked/selectable nodes */}
                            {(isUnlocked || isSelectable) && (
                              <circle 
                                r={22} 
                                fill="none" 
                                stroke={color} 
                                strokeWidth={2} 
                                opacity={isUnlocked ? 0.35 : 0.15}
                                filter="url(#neon-glow)"
                                className={isUnlocked ? 'pulse-glow-circle' : ''}
                              />
                            )}
                            
                            {/* Inner Node circle */}
                            <circle 
                              r={isUnlocked ? 16 : 14} 
                              fill={isUnlocked ? color : '#0A0F24'} 
                              stroke={color} 
                              strokeWidth={2} 
                            />

                            {/* Node labels (smaller visual text under circle) */}
                            <text 
                              y="30" 
                              fill={isUnlocked ? '#FFF' : '#7F8C9F'} 
                              fontSize="8" 
                              fontFamily="var(--font-title)"
                              textAnchor="middle"
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      })}

                      {/* Draw floating text pops in canvas */}
                      {floatingTexts.map(t => (
                        <text
                          key={t.id}
                          x={t.x}
                          y={t.y}
                          fill="var(--success-color)"
                          fontSize="12"
                          fontWeight="bold"
                          fontFamily="var(--font-mono)"
                          textAnchor="middle"
                          className="floating-effect-popup"
                        >
                          {t.text}
                        </text>
                      ))}
                    </g>
                  </svg>

                  {/* Left Side Tooltip Details Card for selected Node */}
                  {selectedNode && (
                    <div style={styles.selectedNodePanel}>
                      <h4 style={{ ...styles.nodePanelTitle, color: unlockedSkills.includes(selectedNode.id) ? 'var(--success-color)' : 'var(--text-primary)' }}>
                        {selectedNode.label} {unlockedSkills.includes(selectedNode.id) && '✅'}
                      </h4>
                      <p style={styles.nodePanelDesc}>{selectedNode.desc}</p>
                      
                      {/* Stat bonuses details */}
                      <div style={styles.nodeStatsPanel}>
                        <h5 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TECH STAT BONUSES:</h5>
                        {Object.keys(selectedNode.stats).map(s => (
                          <div key={s} style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                            ▲ +{selectedNode.stats[s]} {s.toUpperCase()}
                          </div>
                        ))}
                      </div>

                      {/* Price/Unlock Controls */}
                      {!unlockedSkills.includes(selectedNode.id) ? (
                        <div style={styles.nodeUnlockFooter}>
                          <div style={styles.nodeCostBadge}>Cost: {selectedNode.fp} FP | {selectedNode.cost} Coins</div>
                          <button 
                            className="game-btn game-btn-primary" 
                            style={styles.nodeUnlockBtn}
                            onClick={() => handleUnlockNode(selectedNode)}
                          >
                            Unlock Skill Node
                          </button>
                        </div>
                      ) : (
                        <span style={styles.unlockedTag}>SKILL LEVEL ACTIVATED</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Quest logs simulation and contract board */}
              {activeTab === 'quests' && (
                <div style={styles.questsContainer}>
                  {/* Overlay Quest Simulator HUD */}
                  {activeQuest && (
                    <div style={styles.simulatorOverlay}>
                      <div style={styles.simCard} className="game-card">
                        <div style={styles.simHeader}>
                          <h4 style={{ color: 'var(--accent-color)' }}>CONTRACT: {activeQuest.title}</h4>
                          <span style={styles.simPercentage}>{questProgress}%</span>
                        </div>
                        
                        {/* Simulation Logging Console */}
                        <div style={styles.simLogs}>
                          {questLogs.map((log, idx) => (
                            <div key={idx} style={styles.simLogLine}>{log}</div>
                          ))}
                        </div>

                        {/* Interactive loading bar */}
                        <div style={styles.simProgressTrack}>
                          <div style={{ ...styles.simProgressFill, width: `${questProgress}%` }}></div>
                        </div>

                        {/* Simulator outcome display */}
                        {questOutcome && (
                          <div style={styles.simOutcomeFooter}>
                            <h3 style={{ color: questOutcome === 'success' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                              {questOutcome === 'success' ? '🎉 MISSION COMPLETED!' : '💥 CONNECTION TERMINATED!'}
                            </h3>
                            <button 
                              className="game-btn game-btn-primary" 
                              onClick={() => {
                                setActiveQuest(null);
                                gameAudio.playClick();
                              }}
                            >
                              DISMISS CONSOLE
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sector Quest board header */}
                  <div style={styles.questsHeader}>
                    <h3 style={styles.boardTitle}>CONTRACT BOARD - {selectedSector.toUpperCase()} DISTRICT</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Complete active contracts to earn Rep, Coins, and XP. Stats boost success probability rate.
                    </p>
                  </div>

                  {/* Lists of Quests */}
                  <div style={styles.questsGrid}>
                    {COMPANY_QUESTS.filter(q => q.sector === selectedSector).map((quest) => {
                      const isLocked = quest.reqs.some(req => !unlockedSkills.includes(req));
                      
                      // Calculate Success chance
                      const statKeys = Object.keys(quest.stats);
                      let successChance = 100;
                      if (statKeys.length > 0) {
                        let sumRating = 0;
                        statKeys.forEach(key => {
                          const playerVal = stats[key] || 10;
                          const reqVal = quest.stats[key];
                          sumRating += (playerVal / reqVal);
                        });
                        successChance = Math.min(99, Math.max(10, Math.floor((sumRating / statKeys.length) * 75)));
                      }

                      return (
                        <div key={quest.id} style={styles.questCard} className="game-card">
                          <div style={styles.questTop}>
                            <div>
                              <h4 style={styles.questTitle}>{quest.title}</h4>
                              <span style={styles.compBadge}>{quest.comp}</span>
                            </div>
                            <div style={styles.chanceBadge} className={successChance > 70 ? 'glow-green' : 'glow-yellow'}>
                              {successChance}% Win Rate
                            </div>
                          </div>
                          
                          <p style={styles.questDesc}>{quest.desc}</p>
                          
                          {/* Prereq skills required */}
                          <div style={styles.questSkillsReq}>
                            <strong>Requires:</strong> {quest.reqs.map(req => SKILL_NODES.find(n => n.id === req)?.label || req).join(', ')}
                          </div>

                          <div style={styles.questFooter}>
                            {/* Payout Rewards */}
                            <div style={styles.rewardsRow}>
                              <div style={styles.miniReward}><Coins size={12} color="var(--warning-color)" /> +{quest.rewards.coins}</div>
                              <div style={styles.miniReward}><Sparkles size={12} color="#A855F7" /> +{quest.rewards.xp} XP</div>
                              <div style={styles.miniReward}><Star size={12} color="var(--accent-secondary)" /> +{quest.rewards.rep} Rep</div>
                            </div>
                            
                            <button 
                              className="game-btn game-btn-primary" 
                              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                              disabled={isLocked}
                              onClick={() => handleStartQuest(quest)}
                            >
                              {isLocked ? '🔒 Prerequisites Locked' : 'Launch Simulation'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Job Market graph and indices report */}
              {activeTab === 'market' && (
                <div style={styles.marketContainer}>
                  <div style={styles.marketGrid}>
                    <div style={styles.marketIndexPanel} className="game-card">
                      <div style={styles.indexHeader}>
                        <TrendingUp size={20} color="var(--success-color)" />
                        <h4 style={styles.panelTitle}>SILICON METRIC INDEXES</h4>
                      </div>
                      <div style={styles.indexStats}>
                        <div style={styles.indexRow}>
                          <span>TECH COMPOSITE INDEX</span>
                          <span style={{ color: 'var(--success-color)', fontFamily: 'var(--font-mono)' }}>14,582.40 (▲ +1.8%)</span>
                        </div>
                        <div style={styles.indexRow}>
                          <span>AI BOOM INDEX</span>
                          <span style={{ color: marketEvent.id === 'ai_boom' ? 'var(--success-color)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>2,749.12 (▼ -0.2%)</span>
                        </div>
                        <div style={styles.indexRow}>
                          <span>WEB SYSTEM STABILITY</span>
                          <span style={{ color: 'var(--warning-color)', fontFamily: 'var(--font-mono)' }}>98.50 (▲ +0.5%)</span>
                        </div>
                      </div>

                      {/* Live Fluctuation Chart */}
                      <div style={styles.chartWrapper}>
                        <canvas ref={marketChartCanvasRef} width={450} height={180} style={styles.marketChartCanvas}></canvas>
                        <div style={styles.chartLegend}>*Realtime simulation updates dynamically after quest runs.</div>
                      </div>
                    </div>

                    <div style={styles.marketEventPanel} className="game-card">
                      <div style={styles.indexHeader}>
                        <AlertCircle size={20} color="var(--accent-color)" />
                        <h4 style={styles.panelTitle}>ACTIVE JOB SHIFT TICKER</h4>
                      </div>
                      <div style={{ ...styles.marketEventCard, borderColor: marketEvent.type === 'danger' ? 'var(--danger-color)' : marketEvent.type === 'warning' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                        <h3 style={styles.eventTitle}>{marketEvent.name}</h3>
                        <p style={styles.eventDesc}>{marketEvent.desc}</p>
                      </div>
                      <div style={styles.economicAlert}>
                        ⚠️ Job market conditions change parameters across all Silicon City training districts. Keep adapting!
                      </div>
                      <button 
                        className="game-btn game-btn-primary" 
                        style={{ width: '100%', marginTop: 'auto' }}
                        onClick={triggerMarketShift}
                      >
                        Force Shift Market (Test)
                      </button>
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

const styles = {
  container: {
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 70px)',
    width: '100vw',
    backgroundColor: '#03050c',
    position: 'relative'
  },
  lobbyPanel: {
    maxWidth: '820px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    backgroundColor: 'rgba(10, 15, 36, 0.85)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    maxHeight: '90%',
    overflowY: 'auto',
    padding: '2.5rem',
    borderRadius: '16px',
    borderWidth: '2px',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    letterSpacing: '2px',
    background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    maxWidth: '650px'
  },
  classesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.2rem',
    width: '100%',
    marginTop: '1.5rem'
  },
  classCard: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  iconBg: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    letterSpacing: '1px',
    fontWeight: '700'
  },
  classDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    minHeight: '60px'
  },
  classBonus: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700'
  },
  selectBtn: {
    width: '100%',
    marginTop: 'auto',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    fontWeight: '700',
    borderRadius: '6px'
  },
  rpgWorkspace: {
    display: 'flex',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '1280px',
    height: '100%',
    alignItems: 'stretch'
  },
  leftPane: {
    flex: '0.85',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  characterCard: {
    backgroundColor: 'rgba(8, 12, 30, 0.9)',
    borderColor: 'rgba(59, 130, 246, 0.15)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  classBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid var(--accent-color)',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)'
  },
  audioToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  characterDetails: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  avatarGlow: {
    fontSize: '2.5rem',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    boxShadow: 'var(--glow-accent)'
  },
  charName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '1px'
  },
  rankLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  xpTracker: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  xpTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  xpFill: {
    height: '100%',
    backgroundColor: 'var(--success-color)',
    boxShadow: 'var(--glow-success)',
    transition: 'width 0.4s ease'
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '0.8rem'
  },
  statsTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    color: 'var(--accent-color)'
  },
  fpGlow: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '800',
    color: 'var(--accent-secondary)'
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.02)'
  },
  statLabelWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)'
  },
  statPlus: {
    backgroundColor: 'var(--accent-color)',
    border: 'none',
    color: '#fff',
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapCard: {
    backgroundColor: 'rgba(8, 12, 30, 0.9)',
    borderColor: 'rgba(59, 130, 246, 0.15)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  mapTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    color: 'var(--accent-secondary)'
  },
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px'
  },
  mapSector: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid',
    borderRadius: '6px',
    padding: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease'
  },
  sectorIcon: {
    fontSize: '1.25rem'
  },
  sectorName: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-title)',
    fontWeight: '600'
  },
  rightPane: {
    flex: '2.1',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  tabsHeader: {
    display: 'flex',
    gap: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    transition: 'all 0.2s ease'
  },
  workspaceBody: {
    flex: '1',
    backgroundColor: 'rgba(8, 12, 30, 0.7)',
    borderColor: 'rgba(59, 130, 246, 0.15)',
    padding: '0',
    overflow: 'hidden'
  },
  svgOverlayControls: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '4px 8px',
    borderRadius: '6px'
  },
  zoomBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedNodePanel: {
    position: 'absolute',
    bottom: '15px',
    left: '15px',
    width: '260px',
    backgroundColor: 'rgba(6, 10, 24, 0.95)',
    border: '2px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--glow-accent)',
    zIndex: 10
  },
  nodePanelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    fontWeight: '800'
  },
  nodePanelDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  nodeStatsPanel: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.03)'
  },
  nodeUnlockFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px'
  },
  nodeCostBadge: {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-secondary)',
    fontWeight: '700'
  },
  nodeUnlockBtn: {
    width: '100%',
    padding: '6px',
    fontSize: '0.75rem'
  },
  unlockedTag: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: 'var(--success-color)',
    fontFamily: 'var(--font-mono)',
    textAlign: 'center',
    border: '1px solid var(--success-color)',
    padding: '4px',
    borderRadius: '4px',
    backgroundColor: 'rgba(16, 185, 129, 0.05)'
  },
  questsContainer: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
    overflowY: 'auto'
  },
  questsHeader: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.6rem'
  },
  boardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.95rem',
    letterSpacing: '1px'
  },
  questsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  questCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  questTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  questTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    fontWeight: '700'
  },
  compBadge: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontFamily: 'var(--font-mono)'
  },
  chanceBadge: {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    padding: '3px 8px',
    borderRadius: '4px',
    fontWeight: '700'
  },
  questDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  questSkillsReq: {
    fontSize: '0.75rem',
    color: 'var(--accent-secondary)'
  },
  questFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px'
  },
  rewardsRow: {
    display: 'flex',
    gap: '12px'
  },
  miniReward: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)'
  },
  simulatorOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(3, 5, 12, 0.95)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  simCard: {
    maxWidth: '520px',
    width: '90%',
    backgroundColor: 'rgba(10, 14, 30, 0.95)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: 'var(--glow-accent)'
  },
  simHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-title)'
  },
  simPercentage: {
    color: 'var(--accent-secondary)',
    fontFamily: 'var(--font-mono)',
    fontWeight: '800'
  },
  simLogs: {
    backgroundColor: '#02040a',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '6px',
    padding: '0.8rem',
    height: '160px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  simLogLine: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4'
  },
  simProgressTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  simProgressFill: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    transition: 'width 0.25s linear'
  },
  simOutcomeFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px'
  },
  marketContainer: {
    padding: '1.5rem',
    height: '100%',
    overflowY: 'auto'
  },
  marketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    alignItems: 'stretch'
  },
  marketIndexPanel: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  indexHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.5rem'
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.85rem',
    letterSpacing: '1px'
  },
  indexStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  indexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)'
  },
  chartWrapper: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  marketChartCanvas: {
    backgroundColor: '#020409',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    width: '100%',
    height: '180px'
  },
  chartLegend: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  marketEventPanel: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  marketEventCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderLeft: '4px solid',
    padding: '1rem',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  eventTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.95rem',
    color: '#FFF'
  },
  eventDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  economicAlert: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.03)'
  }
};
