# Stockwise

A comprehensive investment learning platform with gamification features. Learn about stock markets, mutual funds, technical analysis, and more while earning rewards and tracking your progress.

## Features

- **Interactive Learning Modules** - Comprehensive content on stock markets, mutual funds, technical analysis, and more
- **Gamification System** - Earn XP, unlock achievements, and maintain daily streaks
- **Progress Tracking** - Track your learning journey with detailed progress metrics
- **Quiz-Based Validation** - Test your knowledge with interactive quizzes
- **Real-time Rewards** - Get instant notifications for achievements and milestones
- **Modern UI** - Beautiful, responsive interface with smooth animations
- **User Authentication** - Secure registration and login system
- **Onboarding Flow** - Guided onboarding experience for new users

## Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/soumya0343/stockwise
cd stockwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/stockwise
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockwise

# Server Port (default: 5001)
PORT=5001

# JWT Secret Key (use a strong random string in production)
JWT_SECRET=your-secret-key

# React App API URL (optional, defaults to http://localhost:5001/api)
REACT_APP_API_URL=http://localhost:5001/api
```

### 4. Start MongoDB

If using local MongoDB, make sure MongoDB is running:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

### 5. Start the Development Servers

You have two options:

**Option 1: Run both frontend and backend together (Recommended)**
```bash
npm run dev
```

**Option 2: Run them separately**

Terminal 1 - Backend Server:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm start
```

### 6. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

## Project Structure

```
stockwise/
├── server/                 # Backend server
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── src/                   # Frontend React app
│   ├── components/       # Reusable components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── App.js            # Main app component
├── public/                 # Static assets
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user (protected)

### User
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `PUT /api/user/stats` - Update user stats (protected)

### Progress
- `GET /api/progress` - Get user progress (protected)
- `PUT /api/progress` - Update user progress (protected)

## Available Scripts

- `npm start` - Start the React development server (port 3000)
- `npm run server` - Start the backend server with nodemon (port 5001)
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build the React app for production
- `npm test` - Run tests

## Key Features & Recent Fixes

### Authentication Flow
- ✅ Secure password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Automatic token storage in localStorage
- ✅ Protected routes with authentication checks
- ✅ Seamless onboarding flow after registration

### Recent Improvements
- **Fixed Registration Flow**: Users now continue the onboarding process after registration instead of being redirected to login
- **Fixed Login Error**: Resolved bcrypt password comparison issue by explicitly selecting password field in queries
- **Improved Error Handling**: Better error messages for network errors and authentication failures
- **Token Management**: Automatic token storage and retrieval for authenticated requests

## Troubleshooting

### Backend Server Not Running
If you see "Network Error" when trying to register or login:
1. Make sure the backend server is running on port 5001
2. Check that MongoDB is running and accessible
3. Verify your `.env` file has the correct MongoDB connection string

### MongoDB Connection Issues
- Ensure MongoDB is installed and running
- Check the connection string in your `.env` file
- For MongoDB Atlas, verify your IP is whitelisted and credentials are correct

### Port Already in Use
If port 3000 or 5001 is already in use:
- Change the port in `package.json` (frontend) or `.env` (backend)
- Or stop the process using the port

## Learning Modules

- Introduction to Stock Markets
- Mutual Funds & SIP
- Technical Analysis
- Fundamental Analysis
- Options Trading
- Futures Trading

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Express
- Icons by Lucide
- Animations powered by Framer Motion
