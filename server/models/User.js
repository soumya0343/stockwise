const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  investmentLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  riskTolerance: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  characterSelected: {
    type: Number,
    min: 1,
    max: 3,
    default: 1
  },
  goals: {
    type: [Number],
    default: []
  },
  stats: {
    xp: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    tokens: {
      type: Number,
      default: 0
    },
    achievements: [{
      id: String,
      name: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    lastLoginDate: {
      type: Date,
      default: Date.now
    },
    completedLessons: [{
      lessonId: String,
      completedAt: {
        type: Date,
        default: Date.now
      },
      xpEarned: Number
    }],
    redeemedRewards: [{
      rewardId: String,
      redeemedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    dailyReminders: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update streak and last login
userSchema.methods.updateLoginStreak = async function() {
  const now = new Date();
  const lastLogin = this.stats.lastLoginDate;
  const daysSinceLastLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

  if (daysSinceLastLogin === 1) {
    // Consecutive day login
    this.stats.streak += 1;
  } else if (daysSinceLastLogin > 1) {
    // Streak broken
    this.stats.streak = 1;
  }
  
  this.stats.lastLoginDate = now;
  await this.save();
};

// Calculate level based on XP
userSchema.methods.calculateLevel = function() {
  const xpPerLevel = 100;
  return Math.floor(this.stats.xp / xpPerLevel) + 1;
};

module.exports = mongoose.model('User', userSchema);