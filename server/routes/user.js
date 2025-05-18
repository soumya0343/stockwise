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
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update completed lessons
    user.stats.completedLessons = completedChapters.map(chapterId => ({
      lessonId: chapterId,
      completedAt: new Date(),
      xpEarned: chapterProgress[chapterId] || 0
    }));

    // Update tokens
    user.stats.tokens = totalTokens;

    await user.save();
    res.json(user.stats);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Error updating progress' });
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

module.exports = router; 