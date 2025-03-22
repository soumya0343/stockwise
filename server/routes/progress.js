const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

// Get user's progress
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's progress
router.put('/', auth, async (req, res) => {
  try {
    const { xp, streak, level, completedLessons } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { xp, streak, level, completedLessons },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add completed lesson
router.post('/lessons', auth, async (req, res) => {
  try {
    const { lessonId } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { completedLessons: lessonId } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 