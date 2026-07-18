import { create } from 'zustand';

const RANKS = [
  { name: 'Fresher', xpNeeded: 0 },
  { name: 'Intern', xpNeeded: 100 },
  { name: 'Associate', xpNeeded: 300 },
  { name: 'Engineer', xpNeeded: 700 },
  { name: 'Senior Engineer', xpNeeded: 1500 },
  { name: 'Tech Lead', xpNeeded: 3000 },
  { name: 'Architect', xpNeeded: 6000 },
  { name: 'CTO Legend', xpNeeded: 12000 }
];

const syncProgressWithBackend = async (state) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await fetch('http://localhost:5000/api/auth/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        xp: state.xp,
        coins: state.coins,
        streak: state.streak,
        classType: state.classType,
        unlockedSkills: state.unlockedSkills,
        heistLevelsCompleted: state.heistLevelsCompleted,
        aptiHighScore: state.aptiHighScore,
        clan: state.clan
      })
    });
  } catch (error) {
    console.warn("Backend sync failed:", error);
  }
};

export const usePlayerStore = create((set, get) => ({
  // Player profile state
  name: 'Player 1',
  avatar: '🚀',
  rank: 'Fresher',
  xp: 0,
  coins: 200,
  reputation: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 3, // Mocking a 3-day streak to start with a nice visual
  activeGame: 'landing', // 'landing', 'hub', 'career-tower', 'sql-heist', 'algo-arena', 'startup-garage', 'internship-detective', 'apti-rush', 'profile'
  email: '',
  collegeName: '',
  department: '',
  gradYear: null,
  rollNumber: '',
  clan: '',

  // Skill Tree state
  classType: null, // 'Frontend Mage', 'Backend Guardian', 'AI Alchemist', 'UI/UX Rogue'
  unlockedSkills: [], // List of node IDs

  // Individual game stats/highscores
  heistLevelsCompleted: 0,
  arenaLevel: 1,
  aptiHighScore: 0,
  startupMaxRevenue: 0,
  detectiveEndingsUnlocked: [],
  notification: null,

  // Action methods
  setGame: (game) => set({ activeGame: game }),

  triggerNotification: (title, message, icon = '🔔') => {
    set({ notification: { title, message, icon } });
    setTimeout(() => {
      const current = get().notification;
      if (current && current.title === title && current.message === message) {
        set({ notification: null });
      }
    }, 4000);
  },
  
  setClass: (classType) => {
    const current = get();
    set({ classType });
    syncProgressWithBackend({
      ...current,
      classType
    });
  },
  
  addXP: (amount) => {
    const current = get();
    const newXP = current.xp + amount;
    
    let currentRank = 'Fresher';
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (newXP >= RANKS[i].xpNeeded) {
        currentRank = RANKS[i].name;
        break;
      }
    }
    
    set({ xp: newXP, rank: currentRank });
    
    syncProgressWithBackend({
      ...current,
      xp: newXP,
      rank: currentRank
    });
  },

  addCoins: (amount) => {
    const current = get();
    const newCoins = current.coins + amount;
    set({ coins: newCoins });
    syncProgressWithBackend({
      ...current,
      coins: newCoins
    });
  },
  
  loseHeart: () => set((state) => {
    const newHearts = Math.max(0, state.hearts - 1);
    return { hearts: newHearts };
  }),
  
  gainHeart: () => set((state) => ({ 
    hearts: Math.min(state.maxHearts, state.hearts + 1) 
  })),

  restoreHearts: () => set((state) => ({ hearts: state.maxHearts })),

  unlockSkill: (skillId) => {
    const current = get();
    if (current.unlockedSkills.includes(skillId)) return;
    const newSkills = [...current.unlockedSkills, skillId];
    set({ unlockedSkills: newSkills });
    syncProgressWithBackend({
      ...current,
      unlockedSkills: newSkills
    });
  },

  incrementStreak: () => {
    const current = get();
    const newStreak = current.streak + 1;
    set({ streak: newStreak });
    syncProgressWithBackend({
      ...current,
      streak: newStreak
    });
  },
  
  completeHeistLevel: () => {
    const current = get();
    const newHeist = current.heistLevelsCompleted + 1;
    set({ heistLevelsCompleted: newHeist });
    syncProgressWithBackend({
      ...current,
      heistLevelsCompleted: newHeist
    });
  },
  
  setArenaLevel: (level) => set({ arenaLevel: level }),
  
  setAptiHighScore: (score) => {
    const current = get();
    const newApti = Math.max(current.aptiHighScore, score);
    set({ aptiHighScore: newApti });
    syncProgressWithBackend({
      ...current,
      aptiHighScore: newApti
    });
  },

  setClan: (clanId) => {
    const current = get();
    set({ clan: clanId });
    syncProgressWithBackend({
      ...current,
      clan: clanId
    });
  },

  completeDailyChallenge: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/daily-challenge/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        set({
          coins: data.coins,
          xp: data.xp,
          rank: data.rank
        });
        localStorage.removeItem('active_daily_challenge_game');
        get().triggerNotification('🎁 Daily Challenge Completed!', 'Claimed +50 SDE Coins and +30 XP!', '📅');
      }
    } catch (err) {
      console.error(err);
    }
  },

  resetGame: () => {
    localStorage.removeItem('token');
    set({
      rank: 'Fresher',
      xp: 0,
      coins: 200,
      reputation: 0,
      hearts: 5,
      streak: 3,
      activeGame: 'landing',
      classType: null,
      unlockedSkills: [],
      heistLevelsCompleted: 0,
      arenaLevel: 1,
      aptiHighScore: 0,
      startupMaxRevenue: 0,
      detectiveEndingsUnlocked: [],
      email: '',
      collegeName: '',
      department: '',
      gradYear: null,
      rollNumber: '',
      clan: ''
    });
  }
}));
