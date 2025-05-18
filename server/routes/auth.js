const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Input validation middleware for registration
const validateRegistrationInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check for required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Please provide all required fields (name, email, and password)' 
    });
  }

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  // Validate name length
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      message: 'Name must be between 2 and 50 characters' 
    });
  }

  next();
};

// Input validation middleware for login
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check for required fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Please provide both email and password' 
    });
  }

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  next();
};

// Register
router.post('/register', validateRegistrationInput, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password
    } = req.body;

    console.log('Registration attempt:', { name, email }); // Log registration attempt

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with default values for required fields
    const user = new User({
      name,
      email,
      password,
      investmentLevel: 'beginner',
      riskTolerance: 1,
      characterSelected: 1,
      goals: [],
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

    console.log('Attempting to save user...'); // Log before save
    await user.save();
    console.log('User saved successfully'); // Log after save

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
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Error creating user',
      details: error.message 
    });
  }
});

// Login
router.post('/login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // Log login attempt

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
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

    console.log('Login successful for user:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats,
        investmentLevel: user.investmentLevel,
        characterSelected: user.characterSelected,
        goals: user.goals
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;