const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { investmentLevel, riskTolerance, characterSelected, goals } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (investmentLevel) user.investmentLevel = investmentLevel;
    if (riskTolerance) user.riskTolerance = riskTolerance;
    if (characterSelected) user.characterSelected = characterSelected;
    if (goals) user.goals = goals;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user's progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      completedChapters: user.stats.completedLessons.map(lesson => lesson.lessonId),
      chapterProgress: user.stats.completedLessons.reduce((acc, lesson) => {
        acc[lesson.lessonId] = lesson.xpEarned;
        return acc;
      }, {}),
      totalTokens: user.stats.tokens || 0
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Update user's progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { completedChapters, chapterProgress, totalTokens } = req.body;
    console.log('Received progress update:', { completedChapters, chapterProgress, totalTokens });

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      console.log('Initializing user stats');
      user.stats = {
        xp: 0,
        level: 1,
        streak: 0,
        tokens: 0,
        completedLessons: []
      };
    }

    // Update completed lessons
    if (completedChapters && Array.isArray(completedChapters)) {
      console.log('Updating completed lessons:', completedChapters);
      // Create a map of existing lessons for quick lookup
      const existingLessonsMap = new Map(
        user.stats.completedLessons.map(lesson => [lesson.lessonId, lesson])
      );

      // Update or add new lessons
      completedChapters.forEach(chapterId => {
        if (!existingLessonsMap.has(chapterId)) {
          user.stats.completedLessons.push({
            lessonId: chapterId,
            completedAt: new Date(),
            xpEarned: chapterProgress[chapterId] || 0
          });
        }
      });
    }

    // Update tokens if provided
    if (typeof totalTokens === 'number') {
      console.log('Updating tokens:', totalTokens);
      user.stats.tokens = totalTokens;
    }

    // Save the updated user document
    console.log('Saving user document');
    const savedUser = await user.save();
    console.log('User document saved successfully');

    // Send back the updated stats
    const response = {
      completedChapters: savedUser.stats.completedLessons.map(lesson => lesson.lessonId),
      chapterProgress: savedUser.stats.completedLessons.reduce((acc, lesson) => {
        acc[lesson.lessonId] = lesson.xpEarned;
        return acc;
      }, {}),
      totalTokens: savedUser.stats.tokens
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ 
      message: 'Error updating progress',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's rewards
router.get('/rewards', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      tokens: user.stats.tokens || 0,
      redeemedRewards: user.stats.redeemedRewards || []
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Error fetching rewards' });
  }
});

// Redeem a reward
router.post('/redeem-reward', auth, async (req, res) => {
  try {
    const { rewardId, cost } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.stats.tokens < cost) {
      return res.status(400).json({ message: 'Not enough tokens' });
    }

    // Update tokens and add to redeemed rewards
    user.stats.tokens -= cost;
    user.stats.redeemedRewards = user.stats.redeemedRewards || [];
    user.stats.redeemedRewards.push({
      rewardId,
      redeemedAt: new Date()
    });

    await user.save();
    res.json({
      tokens: user.stats.tokens,
      redeemedRewards: user.stats.redeemedRewards
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(500).json({ message: 'Error redeeming reward' });
  }
});

// Update user stats
router.put('/stats', auth, async (req, res) => {
  try {
    const { xp, streak } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update stats
    if (xp) user.stats.xp += xp;
    if (streak) user.stats.streak = streak;

    // Calculate level based on XP (every 1000 XP = 1 level)
    user.stats.level = Math.floor(user.stats.xp / 1000) + 1;

    await user.save();
    res.json(user.stats);
  } catch (error) {
    console.error('Stats update error:', error);
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// Update streak
router.post('/update-streak', auth, async (req, res) => {
  try {
    const { streak } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.stats.streak = streak;
    await user.save();
    res.json(user.stats);
  } catch (error) {
    console.error('Streak update error:', error);
    res.status(500).json({ message: 'Error updating streak' });
  }
});

// Add XP
router.post('/add-xp', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        xp: 0,
        level: 1,
        streak: 0,
        tokens: 0,
        completedLessons: []
      };
    }

    // Add XP
    user.stats.xp += amount;
    
    // Calculate new level based on XP thresholds
    let newLevel = 1;
    const xpThresholds = [0, 500, 1200, 2000, 3000];
    for (let i = xpThresholds.length - 1; i >= 0; i--) {
      if (user.stats.xp >= xpThresholds[i]) {
        newLevel = i + 1;
        break;
      }
    }
    user.stats.level = newLevel;

    await user.save();
    res.json({
      xp: user.stats.xp,
      level: user.stats.level
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    res.status(500).json({ message: 'Error adding XP' });
  }
});

// Complete chapter
router.post('/complete-chapter', auth, async (req, res) => {
  try {
    const { chapterId } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        xp: 0,
        level: 1,
        streak: 0,
        tokens: 0,
        completedLessons: []
      };
    }

    // Add chapter to completed lessons if not already completed
    const existingLesson = user.stats.completedLessons.find(
      lesson => lesson.lessonId === chapterId
    );

    if (!existingLesson) {
      // Add XP for completing the chapter
      const chapterXp = 100; // Default XP for completing a chapter
      user.stats.xp += chapterXp;
      
      // Calculate new level based on XP thresholds
      let newLevel = 1;
      const xpThresholds = [0, 500, 1200, 2000, 3000];
      for (let i = xpThresholds.length - 1; i >= 0; i--) {
        if (user.stats.xp >= xpThresholds[i]) {
          newLevel = i + 1;
          break;
        }
      }
      user.stats.level = newLevel;

      // Add to completed lessons
      user.stats.completedLessons.push({
        lessonId: chapterId,
        completedAt: new Date(),
        xpEarned: chapterXp
      });

      // Save the user document
      await user.save();

      // Return updated data
      res.json({
        completedChapters: user.stats.completedLessons.map(lesson => lesson.lessonId),
        xp: user.stats.xp,
        level: user.stats.level,
        message: 'Chapter completed successfully'
      });
    } else {
      // Chapter already completed
      res.json({
        message: 'Chapter already completed',
        completedChapters: user.stats.completedLessons.map(lesson => lesson.lessonId),
        xp: user.stats.xp,
        level: user.stats.level
      });
    }
  } catch (error) {
    console.error('Error completing chapter:', error);
    res.status(500).json({ 
      message: 'Error completing chapter',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      xp: user.stats.xp || 0,
      level: user.stats.level || 1,
      streak: user.stats.streak || 0,
      tokens: user.stats.tokens || 0,
      completedLessons: user.stats.completedLessons || []
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Update daily progress
router.post('/update-daily-progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        xp: 0,
        level: 1,
        streak: 0,
        tokens: 0,
        completedLessons: []
      };
    }

    // Update daily progress
    user.stats.dailyProgress = progress;

    await user.save();
    res.json({ dailyProgress: user.stats.dailyProgress });
  } catch (error) {
    console.error('Error updating daily progress:', error);
    res.status(500).json({ message: 'Error updating daily progress' });
  }
});

// Unlock achievement
router.post('/unlock-achievement', auth, async (req, res) => {
  try {
    const { achievementId, name, description, xpReward } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize stats if they don't exist
    if (!user.stats) {
      user.stats = {
        xp: 0,
        level: 1,
        streak: 0,
        tokens: 0,
        completedLessons: [],
        achievements: []
      };
    }

    // Initialize achievements array if it doesn't exist
    if (!user.stats.achievements) {
      user.stats.achievements = [];
    }

    // Check if achievement is already unlocked
    const existingAchievement = user.stats.achievements.find(
      achievement => achievement.achievementId === achievementId
    );

    if (!existingAchievement) {
      // Add new achievement
      user.stats.achievements.push({
        achievementId,
        name,
        description,
        unlockedAt: new Date(),
        xpReward
      });

      // Add XP reward if provided
      if (xpReward) {
        user.stats.xp += xpReward;
        // Calculate new level based on XP thresholds
        let newLevel = 1;
        const xpThresholds = [0, 500, 1200, 2000, 3000];
        for (let i = xpThresholds.length - 1; i >= 0; i--) {
          if (user.stats.xp >= xpThresholds[i]) {
            newLevel = i + 1;
            break;
          }
        }
        user.stats.level = newLevel;
      }

      await user.save();
      res.json({
        achievements: user.stats.achievements,
        xp: user.stats.xp,
        level: user.stats.level
      });
    } else {
      // Achievement already unlocked
      res.json({
        message: 'Achievement already unlocked',
        achievements: user.stats.achievements
      });
    }
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    res.status(500).json({ message: 'Error unlocking achievement' });
  }
});

module.exports = router; 