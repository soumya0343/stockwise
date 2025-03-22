import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Trophy, Settings, LogOut, ShoppingBag } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
                InvestEdu
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-indigo-600"
              >
                <Home className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/learn"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-indigo-600"
              >
                <BookOpen className="h-5 w-5 mr-1" />
                Learn
              </Link>
              <Link
                to="/dashboard/achievements"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-indigo-600"
              >
                <Trophy className="h-5 w-5 mr-1" />
                Achievements
              </Link>
              <Link
                to="/store"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-indigo-600"
              >
                <ShoppingBag className="h-5 w-5 mr-1" />
                Store
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.name}
              </span>
              <span className="text-sm text-indigo-600">
                {user.xp} XP
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-700 hover:text-indigo-600"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 