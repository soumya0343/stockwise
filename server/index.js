require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const progressRoutes = require('./routes/progress');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json()); // Parse JSON request bodies

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockwise')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progressRoutes);

// Serve static files from the React build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
} else {
  // In development, redirect root to API documentation
  app.get('/', (req, res) => {
    res.json({
      message: 'InvestEdu API Server',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login'
        },
        user: {
          profile: 'GET /api/user/profile',
          updateProfile: 'PUT /api/user/profile',
          updateStats: 'PUT /api/user/stats'
        },
        progress: {
          get: 'GET /api/progress',
          update: 'PUT /api/progress'
        }
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 