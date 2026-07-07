// Web Audio API Synthesizer for game sound effects and background music
let audioCtx = null;
let bgmInterval = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Add global gesture listener to unlock audio context on first user interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      initAudio();
      if (audioCtx) {
        // Play an ultra-short silence to kickstart the AudioContext (crucial for iOS and Chrome)
        const buffer = audioCtx.createBuffer(1, 1, 22050);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
      }
    } catch (e) {
      console.warn('Audio Context unlock failed:', e);
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.removeEventListener('click', unlockAudio);
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
}

// 1. Sword slash sound effect
export function playSlashSound() {
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.45, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.16);
}

// 2. Spell / Laser beam sound effect
export function playSpellSound() {
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.32, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.31);
}

// 3. Heavy strike / Critical explosion sound
export function playExplosionSound() {
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.4);

  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(80, audioCtx.currentTime);
  osc2.frequency.linearRampToValueAtTime(20, audioCtx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.55, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc2.start();
  osc.stop(audioCtx.currentTime + 0.46);
  osc2.stop(audioCtx.currentTime + 0.46);
}

// 4. Loot Coin Sound
export function playCoinSound() {
  initAudio();
  if (!audioCtx) return;

  const playCoinTone = (freq, delay, dur) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + delay + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + dur + 0.05);
  };

  playCoinTone(987.77, 0, 0.08); // B5 note
  playCoinTone(1318.51, 0.08, 0.25); // E6 note
}

// 5. Triumphant Victory Fanfare
export function playVictorySound() {
  initAudio();
  if (!audioCtx) return;

  const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C arpeggio
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + idx * 0.12 + 0.3);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + idx * 0.12);
    osc.stop(audioCtx.currentTime + idx * 0.12 + 0.35);
  });
}

// 6. Defeat Sound
export function playDefeatSound() {
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.6);

  gain.gain.setValueAtTime(0.38, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.65);
}

// 7. Loop BGM retro tune (space-like floating chords)
export function playBgm() {
  initAudio();
  if (!audioCtx || bgmInterval) return;

  let step = 0;
  // Spacey retro melody (using minor 9th and suspended 4th chords for a floating sci-fi atmosphere)
  const melody = [
    293.66, 349.23, 440.00, 523.25, // Dm7 (D4, F4, A4, C5)
    293.66, 392.00, 440.00, 587.33, // Dsus4 (D4, G4, A4, D5)
    329.63, 392.00, 493.88, 587.33, // Em7 (E4, G4, B4, D5)
    261.63, 329.63, 392.00, 523.25  // Cmaj7 (C4, E4, G4, C5)
  ];

  bgmInterval = setInterval(() => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      return;
    }
    
    // Primary clean space tone (sine wave)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(melody[step % melody.length], audioCtx.currentTime);

    gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);

    // Delayed Space Echo Note (softer, one octave higher, delayed by 150ms)
    const echoOsc = audioCtx.createOscillator();
    const echoGain = audioCtx.createGain();

    echoOsc.type = 'sine';
    echoOsc.frequency.setValueAtTime(melody[step % melody.length] * 2, audioCtx.currentTime + 0.15);

    echoGain.gain.setValueAtTime(0.04, audioCtx.currentTime + 0.15);
    echoGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    echoOsc.connect(echoGain);
    echoGain.connect(audioCtx.destination);

    echoOsc.start(audioCtx.currentTime + 0.15);
    echoOsc.stop(audioCtx.currentTime + 0.36);

    step++;
  }, 350);
}

export function stopBgm() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

// 8. Cyberpunk Hacking Key Click
export function playKeyClick() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // Randomize click pitch slightly for realistic feedback
  const freq = 1200 + Math.random() * 400;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

// 9. Cyberpunk Alarm Warning Sweep
export function playAlarmSound() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.45);
  
  gain.gain.setValueAtTime(0.26, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.48);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.49);
}

// 10. Cyberpunk Hacking Loop BGM (Heavy bass heartbeat)
let cyberBgmInterval = null;

export function playCyberBgm() {
  initAudio();
  if (!audioCtx || cyberBgmInterval) return;

  let step = 0;
  // A minor progression
  const melody = [
    55.00, 55.00, 110.00, 55.00,  // A1, A2
    43.65, 43.65, 87.31, 43.65,   // F1, F2
    49.00, 49.00, 98.00, 49.00,   // G1, G2
    41.20, 41.20, 82.41, 41.20    // E1, E2
  ];

  cyberBgmInterval = setInterval(() => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      return;
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(melody[step % melody.length], audioCtx.currentTime);

    // Apply lowpass filter to make it a muffled, dark ambient pulse
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.34, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.58);
    step++;
  }, 600);
}

export function stopCyberBgm() {
  if (cyberBgmInterval) {
    clearInterval(cyberBgmInterval);
    cyberBgmInterval = null;
  }
}

// 11. Soft Cyberpunk City Ambient BGM for Metropolis Hub
let hubBgmInterval = null;
export function playHubBgm() {
  initAudio();
  if (!audioCtx || hubBgmInterval) return;

  let step = 0;
  // Dreamy, futuristic space ambient chords (Cmaj7 -> Em7 -> Fmaj7 -> G6)
  const progression = [
    [130.81, 196.00, 261.63, 329.63], // Cmaj7 (C3, G3, C4, E4)
    [164.81, 246.94, 329.63, 392.00], // Em7 (E3, B3, E4, G4)
    [174.61, 261.63, 349.23, 440.00], // Fmaj7 (F3, C4, F4, A4)
    [196.00, 293.66, 392.00, 493.88]  // G6 (G3, D4, G4, B4)
  ];

  hubBgmInterval = setInterval(() => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      return;
    }
    
    const time = audioCtx.currentTime;
    const currentChord = progression[step % progression.length];

    // Slow, soft, ambient pad swells (lowpass filtered triangle/sine waves)
    currentChord.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, time); // warm, dark filter cutoff

      // Very soft volume, slow attack & decay envelope
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.8); // soft swell
      gain.gain.exponentialRampToValueAtTime(0.001, time + 2.8); // long tail decay

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + 2.9);
    });

    step++;
  }, 3000); // Trigger every 3 seconds for a slow ambient swell
}

export function stopHubBgm() {
  if (hubBgmInterval) {
    clearInterval(hubBgmInterval);
    hubBgmInterval = null;
  }
}

// 12. Hover card alert beep
export function playCardHover() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800 + Math.random() * 200, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.022, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}
