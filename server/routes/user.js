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

module.exports = router; 