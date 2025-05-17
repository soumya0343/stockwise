const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  next();
};

// Register
router.post('/register', validateInput, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password,
      investmentLevel,
      riskTolerance,
      characterSelected,
      goals 
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with all onboarding data
    const user = new User({
      name,
      email,
      password,
      investmentLevel,
      riskTolerance,
      characterSelected,
      goals,
      stats: {
        xp: 50, // Initial XP for completing onboarding
        streak: 1,
        level: 1,
        achievements: [{
          id: 'first_login',
          name: 'First Steps',
          earnedAt: new Date()
        }]
      }
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats,
        investmentLevel: user.investmentLevel,
        goals: user.goals
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update streak if logging in on a new day
    const lastLogin = user.lastLogin || new Date(0);
    const today = new Date();
    if (today.getDate() !== lastLogin.getDate()) {
      user.stats.streak += 1;
      user.lastLogin = today;
      await user.save();
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;