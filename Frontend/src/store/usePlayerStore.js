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
        aptiHighScore: state.aptiHighScore
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

  // Skill Tree state
  classType: null, // 'Frontend Mage', 'Backend Guardian', 'AI Alchemist', 'UI/UX Rogue'
  unlockedSkills: [], // List of node IDs

  // Individual game stats/highscores
  heistLevelsCompleted: 0,
  arenaLevel: 1,
  aptiHighScore: 0,
  startupMaxRevenue: 0,
  detectiveEndingsUnlocked: [],

  // Action methods
  setGame: (game) => set({ activeGame: game }),
  
  setClass: (classType) => {
    set({ classType });
    syncProgressWithBackend(get());
  },
  
  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      // Calculate new rank
      let currentRank = 'Fresher';
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (newXP >= RANKS[i].xpNeeded) {
          currentRank = RANKS[i].name;
          break;
        }
      }
      
      return { 
        xp: newXP, 
        rank: currentRank 
      };
    });
    syncProgressWithBackend(get());
  },

  addCoins: (amount) => {
    set((state) => ({ coins: state.coins + amount }));
    syncProgressWithBackend(get());
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
    set((state) => {
      if (state.unlockedSkills.includes(skillId)) return {};
      return { unlockedSkills: [...state.unlockedSkills, skillId] };
    });
    syncProgressWithBackend(get());
  },

  incrementStreak: () => {
    set((state) => ({ streak: state.streak + 1 }));
    syncProgressWithBackend(get());
  },
  
  completeHeistLevel: () => {
    set((state) => ({ 
      heistLevelsCompleted: state.heistLevelsCompleted + 1 
    }));
    syncProgressWithBackend(get());
  },
  
  setArenaLevel: (level) => set({ arenaLevel: level }),
  
  setAptiHighScore: (score) => {
    set((state) => ({ 
      aptiHighScore: Math.max(state.aptiHighScore, score) 
    }));
    syncProgressWithBackend(get());
  },

  resetGame: () => {
    set({
      rank: 'Fresher',
      xp: 0,
      coins: 200,
      reputation: 0,
      hearts: 5,
      streak: 3,
      activeGame: null,
      classType: null,
      unlockedSkills: [],
      heistLevelsCompleted: 0,
      arenaLevel: 1,
      aptiHighScore: 0,
      startupMaxRevenue: 0,
      detectiveEndingsUnlocked: []
    });
    syncProgressWithBackend(get());
  }
}));
