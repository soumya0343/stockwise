import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  const [chapterProgress, setChapterProgress] = useState({});
  const [totalTokens, setTotalTokens] = useState(0);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);

  // Load user's gamification data from server
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        // Fetch progress data
        const progressResponse = await api.get('/user/progress');
        const { completedChapters: chapters, chapterProgress: progress, totalTokens: tokens } = progressResponse.data;
        
        setCompletedChapters(new Set(chapters || []));
        setChapterProgress(progress || {});
        setTotalTokens(tokens || 0);

        // Fetch stats data
        const statsResponse = await api.get('/user/stats');
        const { xp: currentXp, level: currentLevel, streak: currentStreak } = statsResponse.data;
        
        setXp(currentXp || 0);
        setLevel(currentLevel || 1);
        setStreak(currentStreak || 0);
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
        await api.post('/user/progress', {
          completedChapters: Array.from(completedChapters),
          chapterProgress,
          totalTokens
        });
      } catch (error) {
        console.error('Error saving gamification data:', error);
      }
    };

    if (user && completedChapters.size > 0) {
      saveGamificationData();
    }
  }, [user, completedChapters, chapterProgress, totalTokens]);

  // Check and reset daily progress at midnight
  useEffect(() => {
    const checkDate = async () => {
      const today = new Date().toDateString();
      if (lastCompletionDate && lastCompletionDate !== today) {
        setDailyGoalProgress(0);
        try {
          await api.post('/user/update-daily-progress', { progress: 0 });
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

  const addXP = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/user/add-xp', { amount });
      setXp(response.data.xp);
      setLevel(response.data.level);
    } catch (error) {
      console.error('Error adding XP:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  };

  const completeChapter = async (chapterId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/user/complete-chapter', { chapterId });
      const updatedCompletedChapters = new Set(response.data.completedChapters);
      setCompletedChapters(updatedCompletedChapters);
      
      // Update chapter progress to 100%
      setChapterProgress(prev => ({
        ...prev,
        [chapterId]: 100
      }));
      
      // Update XP and level if provided in response
      if (response.data.xp !== undefined) {
        setXp(response.data.xp);
      }
      if (response.data.level !== undefined) {
        setLevel(response.data.level);
      }
      
      // Update daily progress
      const newProgress = Math.min(dailyGoalProgress + 25, 100);
      setDailyGoalProgress(newProgress);
      await api.post('/user/update-daily-progress', { progress: newProgress });
      
      return response.data;
    } catch (error) {
      console.error('Error completing chapter:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  };

  const unlockAchievement = async (achievementId) => {
    try {
      const achievement = ACHIEVEMENTS[achievementId];
      if (!achievement) {
        throw new Error('Invalid achievement ID');
      }

      // Check if achievement is already unlocked
      if (achievements.includes(achievementId)) {
        console.log(`Achievement ${achievementId} already unlocked`);
        return;
      }

      console.log(`Attempting to unlock achievement: ${achievementId}`);
      const response = await api.post('/user/unlock-achievement', {
        achievementId,
        name: achievement.name,
        description: achievement.description,
        xpReward: 100 // Default XP reward for achievements
      });
      
      console.log(`Successfully unlocked achievement: ${achievementId}`);
      setAchievements(response.data.achievements);
      if (response.data.xp) {
        setXp(response.data.xp);
        setLevel(response.data.level);
      }
    } catch (error) {
      console.error(`Error unlocking achievement ${achievementId}:`, error);
      // Don't throw the error, just log it and continue
      // This prevents the achievement error from blocking chapter completion
    }
  };

  // Add a new function to handle multiple achievements sequentially
  const unlockAchievementsSequentially = async (achievementIds) => {
    for (const achievementId of achievementIds) {
      try {
        await unlockAchievement(achievementId);
        // Add a small delay between achievements to prevent resource exhaustion
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to unlock achievement ${achievementId}:`, error);
        // Continue with next achievement even if one fails
      }
    }
  };

  const value = {
    xp,
    level,
    dailyGoalProgress,
    streak,
    achievements,
    completedChapters,
    chapterProgress,
    totalTokens,
    setTotalTokens,
    addXP,
    completeChapter,
    unlockAchievement,
    unlockAchievementsSequentially,
    isChapterCompleted: (chapterId) => completedChapters.has(chapterId)
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}; 