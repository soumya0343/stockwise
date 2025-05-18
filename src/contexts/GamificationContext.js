import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [lastCompletionDate, setLastCompletionDate] = useState(null);

  // Load user's gamification data from server
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const response = await axios.get('/api/user/progress');
        const { xp, level, streak, achievements, completedChapters } = response.data;
        
        setXp(xp || 0);
        setLevel(level || 1);
        setStreak(streak || 0);
        setAchievements(achievements || []);
        setCompletedChapters(new Set(completedChapters || []));
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      }
    };

    if (user) {
      fetchGamificationData();
    }
  }, [user]);

  // Save gamification data to server when it changes
  useEffect(() => {
    const saveGamificationData = async () => {
      try {
        await axios.post('/api/user/progress', {
          xp,
          level,
          streak,
          achievements,
          completedChapters: Array.from(completedChapters)
        });
      } catch (error) {
        console.error('Error saving gamification data:', error);
      }
    };

    if (user && xp > 0) {
      saveGamificationData();
    }
  }, [user, xp, level, streak, achievements, completedChapters]);

  // Check and reset daily progress at midnight
  useEffect(() => {
    const checkDate = async () => {
      const today = new Date().toDateString();
      if (lastCompletionDate && lastCompletionDate !== today) {
        setDailyGoalProgress(0);
        try {
          await axios.post('/api/user/update-daily-progress', { progress: 0 });
        } catch (error) {
          console.error('Error updating daily progress:', error);
        }
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

  const addXP = async (amount) => {
    try {
      const response = await axios.post('/api/user/add-xp', { amount });
      setXp(response.data.xp);
      setLevel(response.data.level);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  const completeChapter = async (chapterId) => {
    try {
      const response = await axios.post('/api/user/complete-chapter', { chapterId });
      setCompletedChapters(new Set(response.data.completedChapters));
    } catch (error) {
      console.error('Error completing chapter:', error);
    }
  };

  const unlockAchievement = async (achievementId) => {
    try {
      const response = await axios.post('/api/user/unlock-achievement', { achievementId });
      setAchievements(response.data.achievements);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
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