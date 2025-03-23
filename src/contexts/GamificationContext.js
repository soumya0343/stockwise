import React, { createContext, useContext, useState, useEffect } from 'react';

export const LEVELS = {
  1: { name: 'Novice Investor', xpRequired: 0 },
  2: { name: 'Growing Investor', xpRequired: 500 },
  3: { name: 'Skilled Investor', xpRequired: 1200 },
  4: { name: 'Expert Investor', xpRequired: 2000 },
  5: { name: 'Master Investor', xpRequired: 3000 }
};

export const ACHIEVEMENTS = {
  FIRST_LESSON: {
    id: 'first_lesson',
    name: 'First Step',
    description: 'Complete your first lesson',
    icon: '🎯'
  },
  WEEK_STREAK: {
    id: 'week_streak',
    name: 'Consistency Champion',
    description: 'Maintain a 7-day streak',
    icon: '🔥'
  },
  PERFECT_QUIZ: {
    id: 'perfect_quiz',
    name: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '⭐'
  },
  INVESTMENT_START: {
    id: 'investment_start',
    name: 'Real Investor',
    description: 'Make your first investment',
    icon: '💰'
  },
  TOKEN_MASTER: {
    id: 'token_master',
    name: 'Token Master',
    description: 'Earn 1000 tokens',
    icon: '🏆'
  }
};

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [lastCompletionDate, setLastCompletionDate] = useState(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('gamificationState');
    if (savedState) {
      const { 
        xp, 
        level, 
        dailyGoalProgress, 
        streak, 
        achievements, 
        completedChapters,
        lastCompletionDate 
      } = JSON.parse(savedState);
      setXp(xp || 0);
      setLevel(level || 1);
      setDailyGoalProgress(dailyGoalProgress || 0);
      setStreak(streak || 0);
      setAchievements(achievements || []);
      setCompletedChapters(new Set(completedChapters || []));
      setLastCompletionDate(lastCompletionDate);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state = {
      xp,
      level,
      dailyGoalProgress,
      streak,
      achievements,
      completedChapters: Array.from(completedChapters),
      lastCompletionDate
    };
    localStorage.setItem('gamificationState', JSON.stringify(state));
  }, [xp, level, dailyGoalProgress, streak, achievements, completedChapters, lastCompletionDate]);

  // Check and reset daily progress at midnight
  useEffect(() => {
    const checkDate = () => {
      const today = new Date().toDateString();
      if (lastCompletionDate && lastCompletionDate !== today) {
        setDailyGoalProgress(0);
      }
      setLastCompletionDate(today);
    };

    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastCompletionDate]);

  const calculateLevel = (newXP) => {
    let newLevel = 1;
    for (let lvl = 5; lvl >= 1; lvl--) {
      if (newXP >= LEVELS[lvl].xpRequired) {
        newLevel = lvl;
        break;
      }
    }
    return newLevel;
  };

  const addXP = (amount) => {
    setXp(prev => {
      const newXP = prev + amount;
      const newLevel = calculateLevel(newXP);
      
      if (newLevel !== level) {
        setLevel(newLevel);
        // Add bonus XP for leveling up
        return newXP + 100;
      }
      return newXP;
    });
  };

  const completeChapter = (chapterId) => {
    const today = new Date().toDateString();
    
    // Update completed chapters
    setCompletedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapterId);
      return newSet;
    });

    // Add XP for chapter completion (base XP + streak bonus)
    const baseXP = 100;
    const streakBonus = Math.min(streak * 10, 50); // Max 50 XP bonus for streak
    addXP(baseXP + streakBonus);

    // Update daily goal progress (25% per chapter)
    setDailyGoalProgress(prev => {
      const newProgress = Math.min(prev + 25, 100);
      if (newProgress === 100) {
        addXP(200); // Bonus XP for completing daily goal
      }
      return newProgress;
    });

    // Update streak if it's a new day
    if (today !== lastCompletionDate) {
      setStreak(prev => prev + 1);
      if (streak > 0 && streak % 7 === 0) {
        addXP(500); // Bonus XP for weekly streak
        unlockAchievement('WEEK_STREAK');
      }
    }

    setLastCompletionDate(today);
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      setAchievements(prev => [...prev, achievementId]);
      addXP(200); // Award XP for unlocking an achievement
    }
  };

  const value = {
    xp,
    level,
    dailyGoalProgress,
    streak,
    achievements,
    completedChapters,
    addXP,
    completeChapter,
    unlockAchievement,
    isChapterCompleted: (chapterId) => completedChapters.has(chapterId)
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}; 