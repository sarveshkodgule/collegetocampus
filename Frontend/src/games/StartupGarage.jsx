import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { jsPDF } from 'jspdf';
import { 
  Rocket, TrendingUp, AlertCircle, Cpu, Award, Zap, Coins, Users,
  Plus, Play, Hammer, X, Volume2, VolumeX, ShieldAlert, Sparkles,
  Server, Coffee, HelpCircle, ChevronRight, CheckCircle2, ChevronUp, Database
} from 'lucide-react';

// SDE Retro Synth Audio Engine
const startupAudio = {
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
      this.masterGain.gain.setValueAtTime(0.04, this.ctx.currentTime); // Moderate volume
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Chiptune audio initialization failed:", e);
    }
  },

  playBgm() {
    this.init();
    if (!this.ctx || this.bgmInterval || !this.isEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Bouncy SDE tech rhythm (C minor progression for hacking feel)
    const chordProgression = [
      [130.81, 155.56, 196.00], // Cm (C3, Eb3, G3)
      [116.54, 146.83, 174.61], // Bb (Bb2, D3, F3)
      [130.81, 164.81, 196.00], // C major arpeggio
      [196.00, 233.08, 293.66]  // Gm (G3, Bb3, D4)
    ];

    this.bgmStep = 0;
    this.bgmInterval = setInterval(() => {
      const time = this.ctx.currentTime;
      const currentChord = chordProgression[Math.floor(this.bgmStep / 4) % chordProgression.length];

      // Bass beat
      if (this.bgmStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(currentChord[0] * 0.5, time);
        
        bassGain.gain.setValueAtTime(0.12, time);
        bassGain.gain.linearRampToValueAtTime(0.001, time + 0.45);
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);
        bassOsc.start(time);
        bassOsc.stop(time + 0.47);
      }

      // Tech Arpeggio lead
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'triangle';
      
      const arpNote = currentChord[this.bgmStep % currentChord.length] * 1.5;
      arpOsc.frequency.setValueAtTime(arpNote, time);

      arpGain.gain.setValueAtTime(0.05, time);
      arpGain.gain.linearRampToValueAtTime(0.001, time + 0.22);

      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);
      arpOsc.start(time);
      arpOsc.stop(time + 0.24);

      this.bgmStep++;
    }, 280);
  },

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  },

  playTyping() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400 + Math.random() * 800, time);
    
    gain.gain.setValueAtTime(0.07, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.05);
  },

  playZap() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, time);
    osc.frequency.exponentialRampToValueAtTime(200, time + 0.12);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.13);
  },

  playCashRegister() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const chimeNotes = [880, 1174.66, 1396.91]; // A5, D6, F6
    chimeNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.07);
      
      gain.gain.setValueAtTime(0.18, time + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.001, time + idx * 0.07 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time + idx * 0.07);
      osc.stop(time + idx * 0.07 + 0.27);
    });
  },

  playUpgrade() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 -> G5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.05);

      gain.gain.setValueAtTime(0.12, time + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.001, time + idx * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time + idx * 0.05);
      osc.stop(time + idx * 0.05 + 0.22);
    });
  },

  playAlert() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.linearRampToValueAtTime(360, time + 0.35);

    gain.gain.setValueAtTime(0.14, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.37);
  }
};

// SDE Architecture Niches
const NICHES = [
  { id: 'ecommerce', name: 'High-Traffic Retail Gateway', desc: 'SaaS portal matching millions of checkouts. Highly sensitive to query latency and stress spikes.', cash: 1200, latency: 150, stress: 10, icon: Server, color: '#3B82F6' },
  { id: 'fintech', name: 'Secure Blockchain Vault', desc: 'Secure payment gateway processing ledgers. Zero tolerance for database bugs or security glitches.', cash: 1500, latency: 200, stress: 5, icon: Coins, color: '#10B981' },
  { id: 'ai', name: 'Deep Recommendation Grid', desc: 'AI matrices processing vector database queries. Demands fast CPU scaling and high relational memory.', cash: 1000, latency: 450, stress: 20, icon: Cpu, color: '#A855F7' }
];

// Tech Talent Recruitment Pool
const TALENT_POOL = [
  { id: 'jr_dev', name: 'Alex (Junior Coder)', role: 'Developer', desc: 'Speeds up feature coding, but introduces query bugs.', salary: 90, speed: 2.0, bugRate: 0.15, icon: '👨‍💻' },
  { id: 'sr_dev', name: 'Sarah (System Architect)', role: 'Developer', desc: 'High coding speed, writes optimized O(1) syntax with minimal bugs.', salary: 250, speed: 4.5, bugRate: 0.02, icon: '👩‍💻' },
  { id: 'qa_tester', name: 'Marcus (QA Engineer)', role: 'QA', desc: 'Refactors test suites, squashing active query bugs automatically.', salary: 110, speed: 0, bugRate: 0, debugSpeed: 3.5, icon: '🕵️‍♂️' },
  { id: 'sre_eng', name: 'Elena (SRE Engineer)', role: 'SRE', desc: 'Optimizes server resources, reducing server stress & crash rates.', salary: 150, speed: 0, bugRate: 0, stressReduction: 1.5, icon: '🛡️' }
];

// SDE Architecture Roadmap
const ROADMAP = [
  { id: 'postgres_db', title: 'PostgreSQL Relational Replica', desc: 'Deploy database clustering and replica indices.', difficulty: 40, mrr: 180, bugs: 6, icon: Database },
  { id: 'redis_cache', title: 'Redis Memory Cache Cluster', desc: 'Integrate in-memory cache to resolve duplicate read queries.', difficulty: 60, mrr: 280, bugs: 10, icon: Server },
  { id: 'load_balancer', title: 'Nginx Traffic Load Balancer', desc: 'Configure reverse-proxy load distribution to prevent server stress.', difficulty: 90, mrr: 450, bugs: 16, icon: Server },
  { id: 'kafka_queue', title: 'Kafka Decoupled Message broker', desc: 'Decouple checkout events from main database transactions.', difficulty: 130, mrr: 650, bugs: 24, icon: Cpu }
];

// Newsfeed & Event Alerts
const NEWS_EVENTS = [
  { week: 3, title: 'Server Melt Down!', desc: 'Relational queries locked up under load. Lost 100 users, bugs +15.', type: 'danger' },
  { week: 6, title: 'Reddit Upvote Surge!', desc: 'Growth hacker post went viral. Hype +45%, users +150!', type: 'success' },
  { week: 9, title: 'Security Audit Alert', desc: 'Critical query security breach. Lost $300 to penalty patches.', type: 'danger' },
  { week: 12, title: 'VC Venture Bubble', desc: 'Market interest spikes. Tech hype +30%.', type: 'warning' }
];

// CTO Technical Boardroom Interview questions
const VC_ROUNDS = [
  { 
    id: 'seed', 
    title: 'Seed Round: CTO System Review', 
    maxCash: 800, 
    reqUsers: 60, 
    q: 'Our relational database is choking on duplicate read queries. How do we fix it?',
    options: [
      { text: 'A) Spin up a Redis cache in front of PostgreSQL to intercept duplicate reads.', key: 'redis', correct: true },
      { text: 'B) Add database replication clusters to duplicate write loads.', key: 'replica', correct: false },
      { text: 'C) Write database check loops to query the db repeatedly.', key: 'loop', correct: false }
    ]
  },
  { 
    id: 'series_a', 
    title: 'Series A: Scale System Review', 
    maxCash: 3000, 
    reqUsers: 300, 
    q: 'A malicious botnet is flooding our checkout gateway with duplicate transactions. What do we do?',
    options: [
      { text: 'A) Implement a Token Bucket Rate Limiter inside the API Gateway.', key: 'limiter', correct: true },
      { text: 'B) Run select filters directly inside PostgreSQL for every query request.', key: 'dbfilter', correct: false },
      { text: 'C) Shut down the entire server node.', key: 'shutdown', correct: false }
    ]
  }
];

export default function StartupGarage() {
  const { addCoins, addXP, setGame } = usePlayerStore();

  // Navigation / Tab state
  const [gameState, setGameState] = useState('lobby'); // 'lobby', 'office', 'pitch', 'victory', 'bankruptcy'
  const [activeTab, setActiveTab] = useState('office'); // 'office', 'talent', 'roadmap', 'financials'
  const [selectedNiche, setSelectedNiche] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tycoon State
  const [week, setWeek] = useState(1);
  const [money, setMoney] = useState(1000);
  const [mrr, setMrr] = useState(0);
  const [users, setUsers] = useState(0);
  const [bugs, setBugs] = useState(0);
  const [serverStress, setServerStress] = useState(10);
  const [latency, setLatency] = useState(120); // in ms
  
  // Upgrades
  const [serverLevel, setServerLevel] = useState(1);
  const [coffeeLevel, setCoffeeLevel] = useState(1);

  // Office employees
  const [employees, setEmployees] = useState([]);
  
  // Active feature progress
  const [activeFeature, setActiveFeature] = useState(null);
  const [featureProgress, setFeatureProgress] = useState(0);
  
  // Boardroom CTO Pitch state
  const [activeVC, setActiveVC] = useState(null);
  const [pitchStep, setPitchStep] = useState(0); // 0: Question, 1: Slider Negotiation
  const [pitchInterest, setPitchInterest] = useState(50);
  const [pitchValuation, setPitchValuation] = useState(2500);
  const [pitchEquity, setPitchEquity] = useState(20);

  // News alert popups
  const [activeAlert, setActiveAlert] = useState(null);

  // Graph Canvas ref
  const chartCanvasRef = useRef(null);
  const [financialHistory, setFinancialHistory] = useState([]);

  // Floating code fragments particles
  const [codeParticles, setCodeParticles] = useState([]);

  // Audio trigger effect
  useEffect(() => {
    if (soundEnabled && gameState !== 'lobby') {
      startupAudio.isEnabled = true;
      startupAudio.playBgm();
    } else {
      startupAudio.stopBgm();
    }
    return () => startupAudio.stopBgm();
  }, [soundEnabled, gameState]);

  // Real-time ticking (employee tasks, coding progress, particle drifts)
  useEffect(() => {
    if (gameState !== 'office' && gameState !== 'pitch') return;

    const timer = setInterval(() => {
      let devProgress = 0;
      let newBugs = 0;
      let debugFulfill = 0;
      let sreReduction = 0;
      let marketerHype = 0;

      employees.forEach(emp => {
        if (emp.role === 'Developer') {
          // Dev speed
          devProgress += emp.speed;
          const coffeeFactor = 1 + (coffeeLevel - 1) * 0.15;
          devProgress = devProgress * coffeeFactor;

          // Bug generation
          if (Math.random() < emp.bugRate) {
            const serverFactor = Math.max(0.2, 1 - (serverLevel - 1) * 0.2);
            newBugs += 1 * serverFactor;
          }
        } else if (emp.role === 'QA') {
          debugFulfill += emp.debugSpeed;
        } else if (emp.role === 'SRE') {
          sreReduction += emp.stressReduction;
        } else if (emp.role === 'Marketer') {
          marketerHype += 5;
        }
      });

      // 1. Resolve Active Roadmap Component Coding
      if (activeFeature && featureProgress < activeFeature.difficulty) {
        setFeatureProgress(prev => {
          const next = prev + devProgress;
          if (next >= activeFeature.difficulty) {
            // Deploy success!
            setMrr(prevMrr => prevMrr + activeFeature.mrr);
            setServerStress(prevStress => Math.max(5, prevStress - 10)); // deploying reduces stress organic
            startupAudio.playUpgrade();
            
            // Popup success
            setActiveAlert({
              title: '🚀 ARCHITECTURE DEPLOYED!',
              desc: `Successfully scaled infrastructure: "${activeFeature.title}". System MRR boosted by +$${activeFeature.mrr}!`,
              type: 'success'
            });
            
            setActiveFeature(null);
            return 0;
          }

          if (devProgress > 0 && Math.random() > 0.6) {
            startupAudio.playTyping();
            spawnCodeParticles();
          }

          return next;
        });

        if (newBugs > 0) {
          setBugs(prev => Math.floor(prev + newBugs));
        }
      }

      // 2. Resolve Bug Squashing (QA tester)
      if (bugs > 0 && debugFulfill > 0) {
        setBugs(prev => {
          const next = Math.max(0, prev - Math.floor(debugFulfill));
          if (next < prev && Math.random() > 0.7) {
            startupAudio.playZap();
          }
          return next;
        });
      }

      // 3. Server stress adjustments
      setServerStress(prev => {
        // bugs increase stress, SREs decrease stress
        const deltaStress = (bugs * 0.8) - sreReduction - (serverLevel * 0.5);
        const nextStress = Math.min(100, Math.max(5, prev + deltaStress));

        // Trigger warning beep if stress is high
        if (nextStress >= 75 && Math.random() > 0.7) {
          startupAudio.playAlert();
        }

        // Defeat condition: Server Overload / Melt Down
        if (nextStress >= 100) {
          setGameState('bankruptcy');
          startupAudio.playAlert();
        }

        return nextStress;
      });

      // Latency scale in ms
      setLatency(prev => {
        const baseLatency = 80;
        const bugMultiplier = bugs * 12;
        const serverReduction = (serverLevel - 1) * 20;
        return Math.max(30, baseLatency + bugMultiplier - serverReduction);
      });

      // Drift code particles
      setCodeParticles(prev => prev.map(p => ({
        ...p,
        y: p.y - 2,
        alpha: p.alpha - 0.05
      })).filter(p => p.alpha > 0));

    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, employees, activeFeature, featureProgress, bugs, serverLevel, coffeeLevel]);

  // Weekly user growth, expenses, and victory evaluation ticks
  useEffect(() => {
    if (gameState !== 'office' && gameState !== 'pitch') return;

    const timer = setInterval(() => {
      setWeek(w => {
        const nextWeek = w + 1;

        // Calculate expenses
        const weeklyExpenses = 200 + employees.reduce((acc, curr) => acc + curr.salary, 0); // base server cost + salaries
        const weeklyIncome = Math.floor(mrr / 4);

        // User acquisition based on latency (low latency = fast user onboarding)
        const qualityFactor = Math.max(10, 100 - (latency / 8));
        const userAcq = Math.floor(qualityFactor * 0.5);
        setUsers(prev => prev + userAcq);

        // Adjust money
        setMoney(prevMoney => {
          const nextMoney = prevMoney + weeklyIncome - weeklyExpenses;

          if (nextMoney <= 0) {
            setGameState('bankruptcy');
            clearInterval(timer);
            startupAudio.playAlert();
          }

          // Victory condition: Reach week 12 with 500+ users and $3,000+ cash
          if (nextMoney >= 4000 && users >= 500) {
            setGameState('victory');
            addCoins(300);
            addXP(120);
            startupAudio.playUpgrade();
          }

          return nextMoney;
        });

        // Record history for financial graph
        setFinancialHistory(prev => {
          const copy = [...prev];
          copy.push({ week: nextWeek, cash: money, mrr });
          if (copy.length > 12) copy.shift();
          return copy;
        });

        // News alerts
        const newsAlert = NEWS_EVENTS.find(e => e.week === nextWeek);
        if (newsAlert) {
          startupAudio.playAlert();
          setActiveAlert(newsAlert);
          if (newsAlert.type === 'danger') {
            setBugs(b => b + 12);
            setMoney(m => Math.max(0, m - 150));
          } else if (newsAlert.type === 'success') {
            setUsers(u => u + 120);
            setMrr(m => m + 100);
          }
        }

        return nextWeek;
      });
    }, 8000); // 1 simulator week = 8 seconds real time

    return () => clearInterval(timer);
  }, [gameState, employees, mrr, money, users, latency]);

  // Spawn coding floats
  const spawnCodeParticles = () => {
    const codePhrases = ['SQL INDEX', 'Redis GET', 'Nginx 200', 'Kafka SEND', 'Docker RUN', 'npm test'];
    const p = {
      id: Date.now() + Math.random(),
      text: codePhrases[Math.floor(Math.random() * codePhrases.length)],
      x: 120 + Math.random() * 80,
      y: 90,
      alpha: 1
    };
    setCodeParticles(prev => [...prev, p]);
  };

  // Niche start
  const handleSelectNiche = (niche) => {
    setSelectedNiche(niche);
    setMoney(niche.cash);
    setServerStress(niche.stress);
    setLatency(niche.latency);
    setEmployees([]);
    setMrr(0);
    setUsers(0);
    setBugs(0);
    setWeek(1);
    setServerLevel(1);
    setCoffeeLevel(1);
    setFinancialHistory([{ week: 1, cash: niche.cash, mrr: 0 }]);
    setGameState('office');
    startupAudio.playUpgrade();
  };

  // Recruit candidate SDE
  const handleRecruitTalent = (candidate) => {
    if (money < candidate.salary * 1.5) {
      alert("⚠️ Insufficient cash reserves to onboard this engineer!");
      return;
    }
    setMoney(prev => prev - Math.floor(candidate.salary * 0.8)); // recruitment fee
    setEmployees(prev => [...prev, { ...candidate, id: Date.now() }]);
    startupAudio.playCashRegister();
  };

  const handleFireEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    startupAudio.playAlert();
  };

  // Click on developer desks to manually help squash bugs
  const handleManualSquashBug = () => {
    if (bugs > 0) {
      setBugs(prev => Math.max(0, prev - 1));
      addXP(1); // reward player with 1 XP for manual bug squashing!
      startupAudio.playZap();
    }
  };

  const handleLaunchFeature = (feature) => {
    if (activeFeature) {
      alert("⚠️ Wait for active compiler deployment!");
      return;
    }
    startupAudio.playClick();
    setActiveFeature(feature);
    setFeatureProgress(0);
  };

  // Upgrades
  const handleUpgradeServer = () => {
    const cost = serverLevel * 250;
    if (money < cost) {
      alert("⚠️ Insufficient cash to upgrade servers!");
      return;
    }
    setMoney(m => m - cost);
    setServerLevel(lvl => lvl + 1);
    startupAudio.playUpgrade();
  };

  const handleUpgradeCoffee = () => {
    const cost = coffeeLevel * 150;
    if (money < cost) {
      alert("⚠️ Insufficient cash to upgrade coffee maker!");
      return;
    }
    setMoney(m => m - cost);
    setCoffeeLevel(lvl => lvl + 1);
    startupAudio.playUpgrade();
  };

  // Boardroom CTO Interview Mini-Game
  const handleStartPitch = (vc) => {
    if (users < vc.reqUsers) {
      alert(`⚠️ Infrastructure test failed! Requires at least ${vc.reqUsers} Active Users to schedule a review.`);
      return;
    }
    startupAudio.playClick();
    setActiveVC(vc);
    setPitchStep(0);
    setPitchInterest(50);
    setPitchValuation(Math.floor((vc.valRange[0] + vc.valRange[1]) / 2));
    setPitchEquity(15);
    setGameState('pitch');
  };

  const handleVCAnswer = (choice) => {
    if (choice.correct) {
      setPitchInterest(prev => Math.min(100, prev + 35));
      startupAudio.playUpgrade();
    } else {
      setPitchInterest(prev => Math.max(10, prev - 25));
      startupAudio.playAlert();
    }
    setPitchStep(1); // valuation negotiation
  };

  const handleFinalizeFunding = () => {
    const interestMult = pitchInterest / 100;
    const finalVal = pitchValuation * interestMult;
    const cashInjected = Math.floor(finalVal * (pitchEquity / 100));

    if (cashInjected > activeVC.maxCash) {
      alert(`⚠️ CTO rejects deal. Request exceeds the maximum round credit ceiling of $${activeVC.maxCash}`);
      return;
    }

    setMoney(prev => prev + cashInjected);
    setMrr(prev => prev + 100);
    startupAudio.playCashRegister();

    setActiveVC(null);
    setGameState('office');

    setActiveAlert({
      title: '💰 ROUND CLOSED!',
      desc: `Architecture review approved! Secured $${cashInjected} cloud infrastructure credits in exchange for ${pitchEquity}% company equity.`,
      type: 'success'
    });
  };

  // Draw Financial Cash reserves chart
  useEffect(() => {
    if (activeTab === 'financials') {
      const canvas = chartCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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

      if (financialHistory.length < 2) return;

      // Draw Cash reserves line
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#3B82F6';
      ctx.beginPath();
      
      const stepX = canvas.width / (financialHistory.length - 1);
      financialHistory.forEach((pt, idx) => {
        const scaledY = canvas.height - Math.min(canvas.height - 10, (pt.cash / 10000) * canvas.height);
        if (idx === 0) {
          ctx.moveTo(0, scaledY);
        } else {
          ctx.lineTo(idx * stepX, scaledY);
        }
      });
      ctx.stroke();

      // Draw MRR line
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10B981';
      ctx.beginPath();
      financialHistory.forEach((pt, idx) => {
        const scaledY = canvas.height - Math.min(canvas.height - 10, (pt.mrr / 3000) * canvas.height);
        if (idx === 0) {
          ctx.moveTo(0, scaledY);
        } else {
          ctx.lineTo(idx * stepX, scaledY);
        }
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }, [activeTab, financialHistory]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(249, 115, 22);
    
    doc.text("SDE System Design Tycoon Guide", 20, 20);
    doc.setDrawColor(249, 115, 22);
    doc.line(20, 25, 190, 25);
    
    const lines = [
      "GAME CONCEPT & MECHANICS",
      "Manage resources, recruit SDEs, deploy roadmaps, and solve SDE outages",
      "to scale your tech stack to Series A and secure placements.",
      "",
      "SYSTEM DEPLOYMENT MECHANICS",
      "* Postgres DB: Relational index replicas. Adds MRR, generates code bugs.",
      "* Redis Cache: In-memory queries. Minimizes query latency and database load.",
      "* Nginx Load Balancers: Balances checkout traffic, reducing server stress.",
      "* Kafka Queues: Asynchronous decoupled transaction pipelines.",
      "",
      "BOARDROOM CTO INTERVIEW ROUNDS",
      "1. Technical Directors test your caching and rate limiting choices.",
      "2. Select the correct SDE choice to raise CTO interest and valuation credits.",
      "3. Slide Valuation & Equity: Negotiate cash funding checks.",
      "",
      "GAMEPLAY STRATEGY LOOP",
      "1. Hire developer from the recruitment panel. Deploy Postgres from Roadmap.",
      "2. Developer types code while generating bugs. Desk shows code floats.",
      "3. Hire QA tester to automate bug squashes. Click the desk manually for +1 XP.",
      "4. Upgrades: Upgrade Server racks to damp bugs, upgrade Coffee to speed coders."
    ];
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    
    let y = 35;
    lines.forEach((line) => {
      if (line === "") {
        y += 6;
        return;
      }
      if (line === line.toUpperCase() && !line.startsWith("*") && !line.startsWith("1")) {
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(249, 115, 22);
        y += 4;
        doc.text(line, 20, y);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        y += 6;
      } else {
        doc.text(line, 20, y);
        y += 6;
      }
    });
    
    doc.save("sde_system_design_tycoon_guide.pdf");
  };

  const toggleSound = () => {
    if (soundEnabled) {
      startupAudio.stopBgm();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      startupAudio.isEnabled = true;
      startupAudio.playBgm();
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.soundButton} onClick={toggleSound}>
        {soundEnabled ? <Volume2 size={16} color="var(--accent-color)" /> : <VolumeX size={16} color="var(--danger-color)" />}
      </button>

      {/* News warning popup */}
      {activeAlert && (
        <div style={styles.alertOverlay}>
          <div style={styles.alertCard} className="game-card">
            <h4 style={{ color: activeAlert.type === 'danger' ? 'var(--danger-color)' : 'var(--success-color)' }}>
              {activeAlert.title}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '10px 0' }}>{activeAlert.desc}</p>
            <button className="game-btn game-btn-primary" onClick={() => { startupAudio.playTyping(); setActiveAlert(null); }}>
              DISMISS ALERTS
            </button>
          </div>
        </div>
      )}

      {/* 1. LOBBY STATE */}
      {gameState === 'lobby' && (
        <div style={styles.lobbyPanel} className="game-card">
          <Rocket size={64} color="var(--accent-color)" className="float-animation" />
          <h2 style={styles.title}>SDE SYSTEM DESIGN TYCOON</h2>
          <p style={styles.desc}>
            Welcome Candidate! Secure placement readiness by managing server infrastructures. Pick your target retail portal, hire tech specialists, deploy scalable caches/queues, and pitch technical boards to scale your server MRR!
          </p>

          <div style={styles.nicheGrid}>
            {NICHES.map(niche => {
              const NicheIcon = niche.icon;
              return (
                <div key={niche.id} style={styles.nicheCard} className="game-card" onClick={() => handleSelectNiche(niche)}>
                  <div style={{ ...styles.iconWrapper, borderColor: niche.color, backgroundColor: `${niche.color}15` }}>
                    <NicheIcon size={24} color={niche.color} />
                  </div>
                  <h4 style={{ color: niche.color, fontWeight: '800', marginTop: '0.5rem' }}>{niche.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minHeight: '40px' }}>{niche.desc}</p>
                  <div style={styles.nicheStats}>
                    <span>💰 Cash: ${niche.cash}</span>
                    <span>⚡ Latency: {niche.latency}ms</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
            <button className="game-btn" onClick={() => setGame('hub')}>
              Return to Metropolis
            </button>
            <button className="game-btn game-btn-primary" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }} onClick={handleDownloadPDF}>
              📄 Download PDF Guide
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE WORKSPACE VIEW */}
      {gameState === 'office' && (
        <div style={styles.coreGrid}>
          {/* SDE Dashboard HUD */}
          <div style={styles.headerBar} className="game-card">
            <div>
              <h3 style={styles.panelTitle}>WEEK {week}: {selectedNiche?.name}</h3>
              <div style={styles.statsRow}>
                <span style={{ color: 'var(--success-color)' }}>💰 Cash: ${money}</span>
                <span style={{ color: 'var(--accent-secondary)' }}>👥 Users: {users}</span>
                <span style={{ color: serverStress >= 70 ? 'var(--danger-color)' : 'var(--warning-color)' }}>🔥 CPU Load: {Math.floor(serverStress)}%</span>
                <span style={{ color: 'var(--accent-color)' }}>⚡ Query Latency: {latency}ms</span>
                <span style={{ color: bugs > 5 ? 'var(--danger-color)' : 'var(--text-primary)' }}>🐛 Memory Leaks: {bugs}</span>
              </div>
            </div>
            
            <div style={styles.headerControls}>
              <button 
                className="game-btn game-btn-primary" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', backgroundColor: 'var(--accent-color)', color: '#000' }}
                onClick={() => handleStartPitch(VC_ROUNDS[0])}
              >
                CTO Architecture Review
              </button>
              <button className="game-btn" onClick={() => setGameState('lobby')}>
                Restart
              </button>
            </div>
          </div>

          <div style={styles.workspaceBody}>
            {/* Left Tabs bar */}
            <div style={styles.sidebarTabs}>
              <button 
                style={{ ...styles.tabButton, color: activeTab === 'office' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                onClick={() => { startupAudio.playTyping(); setActiveTab('office'); }}
              >
                🏢 DEVOPS ROOM
              </button>
              <button 
                style={{ ...styles.tabButton, color: activeTab === 'talent' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                onClick={() => { startupAudio.playTyping(); setActiveTab('talent'); }}
              >
                🤝 HIRE ENGINEERS ({employees.length})
              </button>
              <button 
                style={{ ...styles.tabButton, color: activeTab === 'roadmap' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                onClick={() => { startupAudio.playTyping(); setActiveTab('roadmap'); }}
              >
                📜 ARCHITECTURE SPRINT ({ROADMAP.length})
              </button>
              <button 
                style={{ ...styles.tabButton, color: activeTab === 'financials' ? 'var(--accent-color)' : 'var(--text-secondary)' }}
                onClick={() => { startupAudio.playTyping(); setActiveTab('financials'); }}
              >
                📊 SCALING GRAPH
              </button>
            </div>

            {/* Right Tab content view */}
            <div style={styles.tabContent} className="game-card">
              
              {/* Tab 1: DevOps Room */}
              {activeTab === 'office' && (
                <div style={styles.officeRoom}>
                  <div style={styles.officeHeader}>
                    <h4>DEVOPS ENGINE ROOM</h4>
                    <button 
                      className="game-btn" 
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
                      disabled={bugs === 0}
                      onClick={handleManualSquashBug}
                    >
                      💥 Squash Bug Manually (+1 XP)
                    </button>
                  </div>

                  {/* Coder visual desk grids */}
                  <div style={styles.officeGrid}>
                    {employees.map(emp => (
                      <div key={emp.id} style={styles.deskCard} className="game-card">
                        <div style={styles.avatarCircle}>{emp.icon}</div>
                        <h5 style={{ fontWeight: '800', margin: '4px 0' }}>{emp.name}</h5>
                        <span style={styles.roleLabel}>{emp.role}</span>
                        
                        {activeFeature && emp.role === 'Developer' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', width: '100%' }}>
                            <span style={styles.devCodeGlow}>Deploying Component...</span>
                            <div className="march-ants" style={{ width: '100%', height: '3px', backgroundColor: 'var(--accent-color)' }}></div>
                          </div>
                        ) : bugs > 0 && emp.role === 'QA' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', width: '100%' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: '800' }}>Squashing DB leaks...</span>
                            <div className="march-ants" style={{ width: '100%', height: '3px', backgroundColor: 'var(--success-color)' }}></div>
                          </div>
                        ) : (
                          <span style={styles.idleLabel}>Idle Coffee break</span>
                        )}

                        <button style={styles.fireBtn} onClick={() => handleFireEmployee(emp.id)}>Fire</button>
                      </div>
                    ))}

                    {employees.length === 0 && (
                      <div style={styles.emptyOfficePrompt}>
                        <span>👨‍💻 Engineering desks are empty!</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          Go to the "Hire Engineers" tab to recruit Junior Devs, QA Bug squashers, or SRE resource managers.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Code float particles */}
                  {codeParticles.map(p => (
                    <div 
                      key={p.id}
                      style={{
                        position: 'absolute',
                        left: `${p.x}px`,
                        top: `${p.y}px`,
                        opacity: p.alpha,
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-color)',
                        pointerEvents: 'none',
                        transition: 'top 0.25s linear, opacity 0.25s linear'
                      }}
                    >
                      {p.text}
                    </div>
                  ))}

                  {/* Infra Upgrades */}
                  <div style={styles.upgradesPanel} className="game-card">
                    <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                      INFRASTRUCTURE SCALING
                    </h4>
                    <div style={styles.upgradesGrid}>
                      <div style={styles.upgradeItem}>
                        <Server size={20} color="var(--accent-secondary)" />
                        <div>
                          <strong>Cloud Server Spec (Lvl {serverLevel})</strong>
                          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Upgraded specs dampen bug leak rates by 20%.</p>
                        </div>
                        <button className="game-btn" style={styles.upgradeBtn} onClick={handleUpgradeServer}>
                          Upgrade (${serverLevel * 250})
                        </button>
                      </div>

                      <div style={styles.upgradeItem}>
                        <Coffee size={20} color="var(--warning-color)" />
                        <div>
                          <strong>Espresso Coffee Maker (Lvl {coffeeLevel})</strong>
                          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Increases developer deployment speed by +15%.</p>
                        </div>
                        <button className="game-btn" style={styles.upgradeBtn} onClick={handleUpgradeCoffee}>
                          Upgrade (${coffeeLevel * 150})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Hire Engineers */}
              {activeTab === 'talent' && (
                <div style={styles.talentBoard}>
                  <h4>ENGINEERING SQUAD CANDIDATES</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Onboard specialized engineers to maintain database throughput and optimize latency.</p>
                  
                  <div style={styles.talentGrid}>
                    {TALENT_POOL.map(candidate => (
                      <div key={candidate.id} style={styles.talentCard} className="game-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>{candidate.icon}</span>
                          <span style={styles.roleLabel}>{candidate.role}</span>
                        </div>
                        <h4 style={{ fontWeight: '800', margin: '6px 0' }}>{candidate.name}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', minHeight: '35px' }}>{candidate.desc}</p>
                        
                        <div style={styles.nicheStats}>
                          <span>Weekly Pay: ${candidate.salary}</span>
                        </div>

                        <button 
                          className="game-btn game-btn-primary" 
                          style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', marginTop: '6px' }}
                          onClick={() => handleRecruitTalent(candidate)}
                        >
                          Hire Candidate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Architecture sprint roadmap */}
              {activeTab === 'roadmap' && (
                <div style={styles.roadmapBoard}>
                  <div style={styles.officeHeader}>
                    <h4>SYSTEM ARCHITECTURE ROADMAP</h4>
                    <span>Select core architecture parameters to launch deployment coding cycles.</span>
                  </div>

                  {activeFeature && (
                    <div style={styles.activeFeatureBar} className="game-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <strong>Deploying: {activeFeature.title}</strong>
                        <span>{Math.floor((featureProgress / activeFeature.difficulty) * 100)}% Complete</span>
                      </div>
                      <div style={styles.progressBarTrack}>
                        <div style={{ ...styles.progressBarFill, width: `${(featureProgress / activeFeature.difficulty) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div style={styles.roadmapList}>
                    {ROADMAP.map(feat => {
                      const FeatIcon = feat.icon;
                      return (
                        <div key={feat.id} style={styles.featCard} className="game-card">
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
                              <FeatIcon size={20} color="var(--accent-color)" />
                            </div>
                            <div>
                              <h5 style={{ fontWeight: '800' }}>{feat.title}</h5>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{feat.desc}</p>
                            </div>
                          </div>

                          <div style={styles.rewardsRow}>
                            <span>💰 +${feat.mrr} MRR</span>
                            <span>🐛 +{feat.bugs} potential memory bugs</span>
                          </div>

                          <button 
                            className="game-btn game-btn-primary" 
                            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                            disabled={!!activeFeature}
                            onClick={() => handleLaunchFeature(feat)}
                          >
                            Compile Component
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Scaling Canvas Chart */}
              {activeTab === 'financials' && (
                <div style={styles.financialsBoard}>
                  <h4>INFRASTRUCTURE SCALING CHART</h4>
                  <div style={styles.legendRow}>
                    <span style={{ color: '#3B82F6' }}>● Cash Runway (Blue)</span>
                    <span style={{ color: '#10B981' }}>● Monthly Recurring Revenue (Green)</span>
                  </div>
                  
                  <div style={styles.chartContainer}>
                    <canvas ref={chartCanvasRef} width={500} height={200} style={styles.graphCanvas}></canvas>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 3. CTO INTERVIEW BOARDROOM */}
      {gameState === 'pitch' && activeVC && (
        <div style={styles.boardroomOverlay}>
          <div style={styles.boardroomCard} className="game-card">
            <div style={styles.boardroomHeader}>
              <Users size={28} color="var(--accent-color)" />
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', letterSpacing: '1px' }}>
                {activeVC.title}
              </h3>
            </div>

            <div style={styles.interestMeter}>
              <span>CTO Board Approval Rating:</span>
              <div style={styles.progressBarTrack}>
                <div style={{ ...styles.progressBarFill, backgroundColor: 'var(--accent-secondary)', width: `${pitchInterest}%` }}></div>
              </div>
            </div>

            {pitchStep === 0 && (
              <div style={styles.pitchDialogueBox}>
                <p style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 'bold' }}>{activeVC.q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
                  {activeVC.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="game-btn" 
                      style={{ textAlign: 'left', padding: '0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleVCAnswer(opt)}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pitchStep === 1 && (
              <div style={styles.negotiateBox}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  CTO Board is aligned! Slide valuation targets to settle infrastructure credit checkouts:
                </p>

                <div style={styles.sliderRow}>
                  <span>Target Valuation: ${pitchValuation}</span>
                  <input 
                    type="range" 
                    min={activeVC.valRange[0]} 
                    max={activeVC.valRange[1]} 
                    value={pitchValuation}
                    onChange={(e) => setPitchValuation(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={styles.sliderRow}>
                  <span>Equity Dilution: {pitchEquity}%</span>
                  <input 
                    type="range" 
                    min="5" 
                    max="45" 
                    value={pitchEquity}
                    onChange={(e) => setPitchEquity(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={styles.valuationPreview}>
                  <div>Adjusted Credit Value: ${Math.floor(pitchValuation * (pitchInterest / 100))}</div>
                  <strong>Infrastructure Credit Injected: ${Math.floor(pitchValuation * (pitchInterest / 100) * (pitchEquity / 100))}</strong>
                </div>

                <button 
                  className="game-btn game-btn-primary" 
                  style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
                  onClick={handleFinalizeFunding}
                >
                  Finalize Infrastructure Deal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. VICTORY SUCCESS */}
      {gameState === 'victory' && (
        <div style={styles.lobbyPanel} className="game-card">
          <Award size={64} color="var(--success-color)" className="float-animation" />
          <h2 style={{ ...styles.title, color: 'var(--success-color)' }}>SYSTEM SCALED SUCCESS!</h2>
          <p style={styles.desc}>
            Sensational engineering architecture! Your portal scaled successfully to **{users} Active Users** with a stable backend environment. You have secured premium tech placement offers!
          </p>

          <div style={styles.rewardsPanel}>
            <div>💎 +300 Placement Coins added to global balance</div>
            <div>⚡ +120 XP applied to global level</div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="game-btn game-btn-primary" onClick={() => setGame(null)}>Return to Hub</button>
            <button className="game-btn" onClick={() => setGameState('lobby')}>Replay Tycoon</button>
          </div>
        </div>
      )}

      {/* 5. DEFEAT BANKRUPTCY */}
      {gameState === 'bankruptcy' && (
        <div style={styles.lobbyPanel} className="game-card">
          <AlertCircle size={64} color="var(--danger-color)" className="float-animation" />
          <h2 style={{ ...styles.title, color: 'var(--danger-color)' }}>SERVER MELT DOWN / BANKRUPTCY</h2>
          <p style={styles.desc}>
            Your server stress levels overloaded to 100% (or runway cash depleted to $0), causing a database deadlock and critical downtime lockout.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="game-btn game-btn-primary" onClick={() => setGameState('lobby')}>Restart DevOps</button>
            <button className="game-btn" onClick={() => setGame(null)}>Metropolis Hub</button>
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
    backgroundColor: '#030100',
    position: 'relative'
  },
  soundButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10
  },
  lobbyPanel: {
    maxWidth: '820px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    backgroundColor: 'rgba(21, 12, 5, 0.95)',
    borderColor: 'rgba(249, 115, 22, 0.25)',
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
    background: 'linear-gradient(90deg, #F97316, #FB923C)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 15px rgba(249, 115, 22, 0.3)'
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    maxWidth: '650px'
  },
  nicheGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.2rem',
    width: '100%',
    marginTop: '1.5rem'
  },
  nicheCard: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.8rem',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nicheStats: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '8px'
  },
  coreGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    width: '100%',
    maxWidth: '1200px',
    height: '100%'
  },
  headerBar: {
    backgroundColor: 'rgba(21, 12, 5, 0.9)',
    borderColor: 'rgba(249, 115, 22, 0.15)',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '1px',
    color: '#FB923C'
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    marginTop: '4px',
    fontWeight: '700'
  },
  headerControls: {
    display: 'flex',
    gap: '10px'
  },
  workspaceBody: {
    display: 'flex',
    gap: '1.2rem',
    flex: '1',
    minHeight: '0'
  },
  sidebarTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: '0.5'
  },
  tabButton: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
    fontSize: '0.8rem',
    textAlign: 'left',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
  },
  tabContent: {
    flex: '2',
    backgroundColor: 'rgba(21, 12, 5, 0.75)',
    borderColor: 'rgba(249, 115, 22, 0.15)',
    padding: '1.25rem',
    overflowY: 'auto',
    position: 'relative'
  },
  officeRoom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    height: '100%'
  },
  officeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '0.6rem'
  },
  officeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
    flex: '1',
    minHeight: '200px',
    alignContent: 'start'
  },
  deskCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '10px'
  },
  avatarCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(249,115,22,0.2)',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleLabel: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--accent-secondary)'
  },
  devCodeGlow: {
    fontSize: '0.65rem',
    color: 'var(--accent-color)',
    fontWeight: '800',
    animation: 'pulse 1s infinite'
  },
  idleLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    marginTop: '6px'
  },
  fireBtn: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'none',
    border: 'none',
    color: 'var(--danger-color)',
    cursor: 'pointer',
    fontSize: '0.7rem'
  },
  emptyOfficePrompt: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '180px',
    textAlign: 'center',
    gap: '6px'
  },
  upgradesPanel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1rem',
    marginTop: 'auto'
  },
  upgradesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px'
  },
  upgradeItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.02)'
  },
  upgradeBtn: {
    padding: '4px 10px',
    fontSize: '0.7rem'
  },
  talentBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  talentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1rem'
  },
  talentCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderRadius: '10px'
  },
  roadmapBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  activeFeatureBar: {
    backgroundColor: 'rgba(249,115,22,0.03)',
    borderColor: 'rgba(249,115,22,0.15)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    transition: 'width 0.3s ease'
  },
  roadmapList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  featCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.04)',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  rewardsRow: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '700'
  },
  financialsBoard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  legendRow: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)'
  },
  chartContainer: {
    backgroundColor: '#020100',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center'
  },
  graphCanvas: {
    width: '100%',
    height: '200px'
  },
  alertOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(3, 2, 1, 0.92)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertCard: {
    maxWidth: '420px',
    width: '90%',
    backgroundColor: 'rgba(21, 12, 5, 0.95)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: 'var(--glow-accent)'
  },
  boardroomOverlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(3, 2, 1, 0.95)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boardroomCard: {
    maxWidth: '560px',
    width: '90%',
    backgroundColor: 'rgba(21, 12, 5, 0.98)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    padding: '2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    boxShadow: 'var(--glow-accent)'
  },
  boardroomHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '0.8rem'
  },
  interestMeter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)'
  },
  pitchDialogueBox: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: '1.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  negotiateBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sliderRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)'
  },
  valuationPreview: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '10px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.8rem',
    color: 'var(--success-color)'
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
    marginTop: '1rem'
  }
};
