import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export const LEVELS = {
  1: { name: "Rookie Investor", xpRequired: 0 },
  2: { name: "Smart Saver", xpRequired: 1000 },
  3: { name: "Market Explorer", xpRequired: 2500 },
  4: { name: "Portfolio Pro", xpRequired: 5000 },
  5: { name: "Investment Guru", xpRequired: 10000 }
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
  const [dailyGoal, setDailyGoal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [completedChapters, setCompletedChapters] = useState(new Set());

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('gamificationState');
    if (savedState) {
      const { xp, level, dailyGoal, streak, achievements, completedChapters } = JSON.parse(savedState);
      setXp(xp || 0);
      setLevel(level || 1);
      setDailyGoal(dailyGoal || 0);
      setStreak(streak || 0);
      setAchievements(achievements || []);
      setCompletedChapters(new Set(completedChapters || []));
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state = {
      xp,
      level,
      dailyGoal,
      streak,
      achievements,
      completedChapters: Array.from(completedChapters)
    };
    localStorage.setItem('gamificationState', JSON.stringify(state));
  }, [xp, level, dailyGoal, streak, achievements, completedChapters]);

  const addXP = (amount) => {
    setXp(prev => {
      const newXP = prev + amount;
      // Level up logic (every 1000 XP)
      const newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }
      return newXP;
    });
  };

  const completeChapter = (chapterId) => {
    setCompletedChapters(prev => {
      const newSet = new Set(prev);
      newSet.add(chapterId);
      return newSet;
    });
    addXP(100); // Award XP for completing a chapter
    setDailyGoal(prev => Math.min(prev + 1, 5)); // Increment daily goal progress
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      setAchievements(prev => [...prev, achievementId]);
      addXP(200); // Award XP for unlocking an achievement
    }
  };

  const incrementStreak = () => {
    setStreak(prev => prev + 1);
    // Award bonus XP for maintaining streak
    if (streak > 0 && streak % 7 === 0) {
      addXP(500); // Bonus XP for weekly streak
    }
  };

  const resetDailyGoal = () => {
    setDailyGoal(0);
  };

  const value = {
    xp,
    level,
    dailyGoal,
    streak,
    achievements,
    completedChapters,
    addXP,
    completeChapter,
    unlockAchievement,
    incrementStreak,
    resetDailyGoal,
    isChapterCompleted: (chapterId) => completedChapters.has(chapterId)
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}; 