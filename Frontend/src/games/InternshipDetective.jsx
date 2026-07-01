import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { jsPDF } from 'jspdf';
import { 
  Briefcase, Heart, Award, ShieldAlert, Star, Users, MessageSquare,
  Search, Eye, HelpCircle, Volume2, VolumeX, ChevronRight, CheckCircle2,
  RefreshCw, FileText, Layout, X, Play
} from 'lucide-react';

// Chiptune Retro Audio Engine for Internship Detective
const detectiveAudio = {
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

    // Chill lo-fi detective loop (A Minor jazz progression)
    const chordProgression = [
      [110.00, 130.81, 164.81, 196.00], // Am7 (A2, C3, E3, G3)
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [123.47, 146.83, 174.61, 220.00]  // Bm7b5 (B2, D3, F3, A3)
    ];

    this.bgmStep = 0;
    this.bgmInterval = setInterval(() => {
      const time = this.ctx.currentTime;
      const currentChord = chordProgression[Math.floor(this.bgmStep / 4) % chordProgression.length];

      // Bass notes
      if (this.bgmStep % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord[0] * 0.5, time);
        
        bassGain.gain.setValueAtTime(0.15, time);
        bassGain.gain.linearRampToValueAtTime(0.001, time + 0.55);
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.masterGain);
        bassOsc.start(time);
        bassOsc.stop(time + 0.57);
      }

      // Chill Arpeggiator arps
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'triangle';
      
      const arpNote = currentChord[this.bgmStep % currentChord.length] * 1.5;
      arpOsc.frequency.setValueAtTime(arpNote, time);

      arpGain.gain.setValueAtTime(0.04, time);
      arpGain.gain.linearRampToValueAtTime(0.001, time + 0.25);

      arpOsc.connect(arpGain);
      arpGain.connect(this.masterGain);
      arpOsc.start(time);
      arpOsc.stop(time + 0.27);

      this.bgmStep++;
    }, 320);
  },

  stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  },

  playTypewriter() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 400, time);
    
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.03);
  },

  playClick() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.08);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.09);
  },

  playAlert() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, time);
    osc.frequency.linearRampToValueAtTime(520, time + 0.3);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.linearRampToValueAtTime(0.001, time + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.32);
  },

  playSuccess() {
    this.init();
    if (!this.ctx || !this.isEnabled) return;
    const time = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.08);

      gain.gain.setValueAtTime(0.15, time + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.001, time + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time + idx * 0.08);
      osc.stop(time + idx * 0.08 + 0.27);
    });
  }
};

// 3 Case Levels
const CASES = [
  {
    id: 'case_1',
    title: 'Level 1: The Haunted Database Outage',
    desc: 'Production servers are throwing 500 connection limit leaks. Find the query bug and re-route traffic.',
    difficulty: 'Easy / Database',
    clues: [
      { id: 'c1_log', name: 'Server Log #1', desc: 'ERROR: connection limit exceeded for database postgres.' },
      { id: 'c1_replica', name: 'Replica Lag Report', desc: 'Read replica lag is 12GB. primary node is overloaded with analytical reporting reads.' }
    ],
    diagnosis: {
      correctClues: ['c1_log', 'c1_replica'],
      correctAnswer: 'redirect',
      question: 'With the connection pool exhausted, what is the best SDE scaling route?',
      options: [
        { text: 'A) Redirect all reporting/analytical read queries to the secondary read replica.', key: 'redirect', correct: true },
        { text: 'B) Hard reboot the PostgreSQL server to drop connections.', key: 'reboot', correct: false },
        { text: 'C) Increase postgres connection pool size config indefinitely.', key: 'increase', correct: false }
      ]
    },
    transcripts: [
      { speaker: 'Rohan (Senior Backend)', avatar: '👨‍💻', text: 'Welcome intern. We have a database connection crash. Read queries are blocking checkout pipelines.' },
      { speaker: 'Neha (Tech Lead)', avatar: '👩‍💼', text: 'Investigate the log notes on the pinboard. Connect the logs with the replica lag metrics to diagnose the root cause.' }
    ],
    rewards: { coins: 150, xp: 60, rep: 25 }
  },
  {
    id: 'case_2',
    title: 'Level 2: The Rogue Git Merge Conflict',
    desc: 'A late-night merge broke the production build pipeline. Reconcile branch logs and solve developer friction.',
    difficulty: 'Medium / Git',
    clues: [
      { id: 'c2_gitlog', name: 'Git Commit History', desc: 'Commit #f39b1a: "force push main branch by Junior Dev".' },
      { id: 'c2_diff', name: 'Code Diff Report', desc: 'Duplicate index variables found in App.jsx. Merge conflicts was resolved with auto-accept-ours.' }
    ],
    diagnosis: {
      correctClues: ['c2_gitlog', 'c2_diff'],
      correctAnswer: 'rollback',
      question: 'How do you clean the master branch conflicts safely?',
      options: [
        { text: 'A) Revert commit #f39b1a, resolve conflicts locally, and force push test suites.', key: 'rollback', correct: true },
        { text: 'B) Delete the main branch and rebuild App.jsx from scratch.', key: 'rebuild', correct: false },
        { text: 'C) Run auto merge loops on master.', key: 'autoloop', correct: false }
      ]
    },
    transcripts: [
      { speaker: 'Rohan (Senior Backend)', avatar: '👨‍💻', text: 'Main build pipeline is red! Someone bypassed pull-request reviews and pushed broken files.' },
      { speaker: 'Neha (Tech Lead)', avatar: '👩‍💼', text: 'Rohan is furious. Check the git commit history logs to find who pushed the conflict and solve this diplomatically.' }
    ],
    rewards: { coins: 250, xp: 100, rep: 40 }
  },
  {
    id: 'case_3',
    title: 'Level 3: The API Gateway Outage',
    desc: 'API latency is spiking to 5000ms. Analyze transaction logs and block DDoS spammers.',
    difficulty: 'Hard / API Scaling',
    clues: [
      { id: 'c3_traffic', name: 'IP Traffic Report', desc: 'IP 192.168.1.45 is hitting /api/checkout 300 times/second.' },
      { id: 'c3_firewall', name: 'Firewall Policy file', desc: 'Rate limiting is currently disabled. Server is running on open connection threads.' }
    ],
    diagnosis: {
      correctClues: ['c3_traffic', 'c3_firewall'],
      correctAnswer: 'limiter',
      question: 'How do you shield the server backend nodes from spam requests?',
      options: [
        { text: 'A) Spin up Nginx with a Token Bucket rate-limiter for IP 192.168.1.45.', key: 'limiter', correct: true },
        { text: 'B) Add DB filter check loops to block transactions.', key: 'dbcheck', correct: false },
        { text: 'C) Re-route traffic to local sandbox ports.', key: 'sandbox', correct: false }
      ]
    },
    transcripts: [
      { speaker: 'Rohan (Senior Backend)', avatar: '👨‍💻', text: 'Server latency is sliding up! We are getting flooded by duplicate API checkout requests.' },
      { speaker: 'Client (Director)', avatar: '🏢', text: 'Our portal is offline. Fix this API outage immediately or our placement contract drops!' }
    ],
    rewards: { coins: 350, xp: 150, rep: 60 }
  }
];

export default function InternshipDetective() {
  const { addCoins, addXP, setGame } = usePlayerStore();

  // Screen/State routing
  const [gameState, setGameState] = useState('lobby'); // 'lobby', 'dialogue', 'pinboard', 'diagnosis', 'ending'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Case Level
  const [activeCase, setActiveCase] = useState(null);
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  
  // Relationship / Trust stats
  const [rohanTrust, setRohanTrust] = useState(50);
  const [nehaAlignment, setNehaAlignment] = useState(50);

  // Pinboard state
  const [collectedClues, setCollectedClues] = useState([]);
  const [selectedPinboardClues, setSelectedPinboardClues] = useState([]);
  const [diagnosedCorrectly, setDiagnosedCorrectly] = useState(null);
  const [inspectedClue, setInspectedClue] = useState(null);

  // Sound triggers
  useEffect(() => {
    if (soundEnabled && gameState !== 'lobby') {
      detectiveAudio.isEnabled = true;
      detectiveAudio.playBgm();
    } else {
      detectiveAudio.stopBgm();
    }
    return () => detectiveAudio.stopBgm();
  }, [soundEnabled, gameState]);

  // Dialogue Typewriter effect
  useEffect(() => {
    if (gameState !== 'dialogue' || !activeCase) return;
    const currentScript = activeCase.transcripts[transcriptIndex];
    if (!currentScript) return;

    let charIdx = 0;
    setTypewriterText('');
    
    const interval = setInterval(() => {
      setTypewriterText(prev => prev + currentScript.text.charAt(charIdx));
      charIdx++;

      if (soundEnabled && charIdx % 2 === 0) {
        detectiveAudio.playTypewriter();
      }

      if (charIdx >= currentScript.text.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [gameState, activeCase, transcriptIndex]);

  // Select a Case Level to begin
  const handleSelectCase = (caseFile) => {
    setActiveCase(caseFile);
    setTranscriptIndex(0);
    setCollectedClues([]);
    setSelectedPinboardClues([]);
    setDiagnosedCorrectly(null);
    setRohanTrust(50);
    setNehaAlignment(50);
    setGameState('dialogue');
    startupAudioCheck();
  };

  const handleDevCheatSolve = () => {
    detectiveAudio.playSuccess();
    setDiagnosedCorrectly(true);
    setRohanTrust(100);
    setNehaAlignment(100);
    setGameState('ending');
  };

  const startupAudioCheck = () => {
    if (soundEnabled) {
      detectiveAudio.init();
      detectiveAudio.playClick();
    }
  };

  // Skip or advance dialogue transcripts
  const handleAdvanceDialogue = () => {
    detectiveAudio.playClick();
    if (transcriptIndex + 1 < activeCase.transcripts.length) {
      setTranscriptIndex(prev => prev + 1);
    } else {
      // Transition to Pinboard investigation board
      // Collect all clues automatically for the player
      setCollectedClues(activeCase.clues);
      setGameState('pinboard');
    }
  };

  // Toggle clue note selection on Corkboard
  const handleToggleClue = (clueId) => {
    detectiveAudio.playClick();
    setSelectedPinboardClues(prev => {
      if (prev.includes(clueId)) {
        return prev.filter(id => id !== clueId);
      } else {
        return [...prev, clueId];
      }
    });
  };

  // Check linked clues matching diagnosis
  const handleTriggerDiagnosis = () => {
    const isClueMatch = activeCase.diagnosis.correctClues.every(id => selectedPinboardClues.includes(id)) && selectedPinboardClues.length === activeCase.diagnosis.correctClues.length;
    
    if (!isClueMatch) {
      detectiveAudio.playAlert();
      alert("⚠️ Clue connection match failed! Inspect the logs carefully to thread the correct pieces.");
      setRohanTrust(prev => Math.max(10, prev - 15));
      return;
    }

    detectiveAudio.playClick();
    setGameState('diagnosis');
  };

  // Boardroom diagnosis answers
  const handleSelectDiagnosisAnswer = (option) => {
    if (option.correct) {
      detectiveAudio.playSuccess();
      setDiagnosedCorrectly(true);
      setRohanTrust(prev => Math.min(100, prev + 25));
      setNehaAlignment(prev => Math.min(100, prev + 30));
    } else {
      detectiveAudio.playAlert();
      setDiagnosedCorrectly(false);
      setRohanTrust(prev => Math.max(10, prev - 25));
      setNehaAlignment(prev => Math.max(10, prev - 20));
    }
    setGameState('ending');
  };

  // Complete Case Level
  const handleClaimCaseEnding = () => {
    detectiveAudio.playClick();
    if (diagnosedCorrectly) {
      addCoins(activeCase.rewards.coins);
      addXP(activeCase.rewards.xp);
    } else {
      addCoins(20);
      addXP(10);
    }
    setGameState('lobby');
  };

  // Direct PDF Guide download using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241); // Indigo theme
    
    doc.text("Internship Detective Guide", 20, 20);
    doc.setDrawColor(99, 102, 241);
    doc.line(20, 25, 190, 25);
    
    const lines = [
      "GAME CONCEPT & MECHANICS",
      "Survive corporate SDE incidents by linking server log clues on the",
      "corkboard pinboard, maintaining trust metrics, and solving failures.",
      "",
      "LEVEL CASE RESOLUTION SCHEMES",
      "* Case 1: Relational DB Lag. Connect Server logs with Replica metrics.",
      "  Solution: Re-route analytical queries to read-replica.",
      "* Case 2: Broken Git master. Connect Git commits and code diff files.",
      "  Solution: Revert buggy commit locally and push clean tests.",
      "* Case 3: API Gateway Outage. Connect Traffic volume & Firewall policy.",
      "  Solution: Deploy token-bucket IP Rate limiter reverse proxies.",
      "",
      "OFFICE DIPLOMACY METERS",
      "* Rohan Trust Score: Raised by checking runbooks and selecting correct code fixes.",
      "* Neha Alignment Score: Raised by keeping client happy and resolving conflicts.",
      "",
      "GAMEPLAY STRATEGY LOOP",
      "1. Choose case file from the main lobby menu board.",
      "2. Read dialog scenes with typewriter animations.",
      "3. Go to the Corkboard Pinboard. Select 2 related clues and click Diagnose.",
      "4. Solve the final tech board diagnosis to complete cases and earn gold."
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
        doc.setTextColor(99, 102, 241);
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
    
    doc.save("internship_detective_placement_guide.pdf");
  };

  const toggleSound = () => {
    if (soundEnabled) {
      detectiveAudio.stopBgm();
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
      detectiveAudio.isEnabled = true;
      detectiveAudio.playBgm();
    }
  };

  return (
    <div style={styles.container}>
      {/* Sound Toggle */}
      <button style={styles.soundButton} onClick={toggleSound}>
        {soundEnabled ? <Volume2 size={16} color="var(--accent-color)" /> : <VolumeX size={16} color="var(--danger-color)" />}
      </button>

      {/* 1. LOBBY LEVEL SELECT SCREEN */}
      {gameState === 'lobby' && (
        <div style={styles.lobbyCard} className="game-card">
          <Briefcase size={64} color="var(--accent-color)" className="float-animation" />
          <h2 style={styles.title}>INTERNSHIP DETECTIVE</h2>
          <p style={styles.desc}>
            Welcome Detective! Dive into backend databases, review code changes, and handle stakeholder communication in these 3 incidents to build your corporate engineering metrics.
          </p>

          <div style={styles.casesList}>
            {CASES.map(c => (
              <div key={c.id} style={styles.caseCard} className="game-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontWeight: '800', color: 'var(--accent-secondary)' }}>{c.title}</h4>
                  <span style={styles.levelDifficulty}>{c.difficulty}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '8px 0' }}>{c.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#EAB308', fontWeight: 'bold' }}>💎 Reward: +{c.rewards.coins} Coins</span>
                  <button className="game-btn game-btn-primary" style={{ padding: '0.3rem 1rem', fontSize: '0.7rem' }} onClick={() => handleSelectCase(c)}>
                    LAUNCH CASE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
            <button className="game-btn" onClick={() => setGame(null)}>
              Return to Metropolis
            </button>
            <button className="game-btn game-btn-primary" style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }} onClick={handleDownloadPDF}>
              📄 Download PDF Guide
            </button>
          </div>
        </div>
      )}

      {/* 2. VISUAL DIALOGUE PANEL */}
      {gameState === 'dialogue' && activeCase && (
        <div style={styles.vnPanel} className="game-card">
          {/* Header */}
          <div style={styles.vnHeader}>
            <span style={styles.badgeLabel}>CASE INCIDENT: DIALOGUE DIARY</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button 
                style={{ backgroundColor: '#EF4444', border: 'none', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={handleDevCheatSolve}
              >
                ⚡ Dev Cheat: Solve Case
              </button>
              <div style={styles.metricsBar}>
                <span>💻 Rohan Trust: {rohanTrust}%</span>
                <span>🤝 Neha Alignment: {nehaAlignment}%</span>
              </div>
            </div>
          </div>

          {/* Dialogue transcript scene */}
          <div style={styles.dialogueScene}>
            <div style={styles.speakerBlock}>
              <span style={styles.avatarLabel} className="float-animation">
                {activeCase.transcripts[transcriptIndex]?.avatar}
              </span>
              <h4 style={{ color: 'var(--accent-color)', fontWeight: '800' }}>
                {activeCase.transcripts[transcriptIndex]?.speaker}
              </h4>
            </div>

            <div style={styles.speechBox}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#FFF', lineHeight: '1.6', wordBreak: 'break-word' }}>
                "{typewriterText}"
              </p>
            </div>

            <button className="game-btn game-btn-primary" style={styles.nextBtn} onClick={handleAdvanceDialogue}>
              Next Dialogue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 3. CORKBOARD PINBOARD INVESTIGATION SCREEN */}
      {gameState === 'pinboard' && activeCase && (
        <div style={styles.pinboardPanel} className="game-card">
          <div style={styles.vnHeader}>
            <span>📌 DEVOPS INVESTIGATION BOARD</span>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button 
                style={{ backgroundColor: '#EF4444', border: 'none', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={handleDevCheatSolve}
              >
                ⚡ Dev Cheat: Solve Case
              </button>
              <div style={styles.metricsBar}>
                <span>Trust: {rohanTrust}%</span>
                <span>Alignment: {nehaAlignment}%</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Inspect log cards pinned below. Link exactly <strong>two related SDE clues</strong> together to unlock the incident diagnosis.
          </p>

          {/* Inspected Clue Detail Window Overlay */}
          {inspectedClue && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.45)',
              border: '1px solid var(--accent-color)',
              padding: '1rem',
              borderRadius: '8px',
              color: '#FFF'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <strong style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>🔍 INSPECTING CLUE: {inspectedClue.name}</strong>
                <button 
                  style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                  onClick={() => setInspectedClue(null)}
                >
                  [CLOSE X]
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#FFF', marginTop: '8px', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
                {inspectedClue.desc}
              </p>
            </div>
          )}

          {/* Corkboard Grid layout */}
          <div style={styles.corkBoardGrid}>
            {collectedClues.map(clue => {
              const isSelected = selectedPinboardClues.includes(clue.id);
              return (
                <div 
                  key={clue.id} 
                  style={{ 
                    ...styles.cluePinCard, 
                    borderColor: isSelected ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)',
                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'rgba(0,0,0,0.25)'
                  }} 
                  onClick={() => handleToggleClue(clue.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#FFF' }}>{clue.name}</strong>
                    <button 
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.06)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: 'var(--accent-color)', 
                        fontSize: '0.65rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedClue(clue);
                      }}
                    >
                      🔍 Inspect Log
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {clue.desc.length > 50 ? `${clue.desc.substring(0, 48)}...` : clue.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button className="game-btn" onClick={() => setGameState('dialogue')}>
              Back to Dialogue
            </button>
            <button 
              className="game-btn game-btn-primary" 
              style={{ flex: '1' }}
              disabled={selectedPinboardClues.length !== 2}
              onClick={handleTriggerDiagnosis}
            >
              🛠️ Connecting Clues & Diagnose
            </button>
          </div>
        </div>
      )}

      {/* 4. BOARDROOM FINAL INCIDENT DIAGNOSIS */}
      {gameState === 'diagnosis' && activeCase && (
        <div style={styles.boardroomCard} className="game-card">
          <div style={styles.boardroomHeader}>
            <ShieldAlert size={24} color="var(--accent-color)" />
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>
              INCIDENT DIAGNOSIS PITCH
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Rohan and Neha are waiting. Choose your final system architecture fix recommendation:
          </p>

          <div style={styles.optionsList}>
            <div style={styles.questionBox}>
              <strong>Q: {activeCase.diagnosis.question}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1rem' }}>
              {activeCase.diagnosis.options.map((opt, idx) => (
                <button 
                  key={idx} 
                  className="game-btn" 
                  style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem' }}
                  onClick={() => handleSelectDiagnosisAnswer(opt)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ENDING RESOLUTION VIEW */}
      {gameState === 'ending' && activeCase && (
        <div style={styles.lobbyPanel} className="game-card">
          <div style={styles.speakerAvatar} className="float-animation">
            {diagnosedCorrectly ? '🏆' : '🚨'}
          </div>
          
          <h2 style={{ ...styles.title, color: diagnosedCorrectly ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {diagnosedCorrectly ? 'CASE FILE SOLVED!' : 'CRITICAL OUTAGE OVERLOAD'}
          </h2>

          <p style={styles.desc}>
            {diagnosedCorrectly 
              ? `Outstanding architecture resolution! You linked the database connections and re-routed the metrics config perfectly. Neha approved the rollout.`
              : `System deadlock! The proposed solution failed, causing further connection pool timeouts. Rohan spent the night patching tables.`
            }
          </p>

          <div style={styles.rewardsPanel}>
            <h4 style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>INCIDENT REWARDS PAYOUT:</h4>
            <div>💎 +{diagnosedCorrectly ? activeCase.rewards.coins : 20} Coins added</div>
            <div>⚡ +{diagnosedCorrectly ? activeCase.rewards.xp : 10} XP credited</div>
            <div style={{ color: diagnosedCorrectly ? 'var(--success-color)' : 'var(--danger-color)' }}>
              ⭐ Office Reputation: {diagnosedCorrectly ? `+${activeCase.rewards.rep}` : '-25'}
            </div>
          </div>

          <button className="game-btn game-btn-primary" style={{ marginTop: '1rem' }} onClick={handleClaimCaseEnding}>
            CLAIM INCIDENT REWARDS
          </button>
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
    backgroundColor: '#020204',
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
  lobbyCard: {
    maxWidth: '820px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    padding: '2.5rem',
    borderRadius: '16px',
    borderWidth: '2px',
    maxHeight: '90%',
    overflowY: 'auto'
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    letterSpacing: '2px',
    background: 'linear-gradient(90deg, #6366F1, #818CF8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    maxWidth: '650px'
  },
  casesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    marginTop: '1rem'
  },
  caseCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '1.25rem',
    textAlign: 'left',
    borderRadius: '10px'
  },
  levelDifficulty: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-mono)',
    backgroundColor: 'rgba(99,102,241,0.15)',
    color: 'var(--accent-color)',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  vnPanel: {
    maxWidth: '700px',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    padding: '1.5rem',
    borderRadius: '12px',
    borderWidth: '2px'
  },
  vnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '0.6rem',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)'
  },
  badgeLabel: {
    color: 'var(--accent-color)',
    fontWeight: '700'
  },
  metricsBar: {
    display: 'flex',
    gap: '15px'
  },
  dialogueScene: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    marginTop: '1.25rem'
  },
  speakerBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatarLabel: {
    fontSize: '2.5rem'
  },
  speechBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderLeft: '4px solid var(--accent-color)',
    padding: '1.5rem',
    borderRadius: '8px',
    minHeight: '100px'
  },
  nextBtn: {
    width: '100%',
    justifyContent: 'center',
    gap: '6px'
  },
  pinboardPanel: {
    maxWidth: '750px',
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.2)',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    height: '90%'
  },
  corkBoardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
    overflowY: 'auto',
    flex: '1'
  },
  cluePinCard: {
    border: '1px solid',
    borderRadius: '10px',
    padding: '1rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '120px',
    transition: 'all 0.2s ease'
  },
  boardroomCard: {
    maxWidth: '560px',
    width: '90%',
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: 'var(--glow-accent)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  boardroomHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '0.8rem'
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  questionBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.02)'
  },
  lobbyPanel: {
    maxWidth: '520px',
    width: '90%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    padding: '2.5rem',
    borderRadius: '16px',
    borderWidth: '2px'
  },
  speakerAvatar: {
    fontSize: '3rem'
  },
  rewardsPanel: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    padding: '1rem 2rem',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
    fontSize: '0.85rem',
    color: 'var(--accent-secondary)'
  }
};
