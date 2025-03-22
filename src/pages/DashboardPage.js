import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Star, BookOpen } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">InvestEdu</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">Welcome, {user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">XP Points</div>
                  <div className="text-2xl font-semibold text-gray-900">{user?.xp || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">Current Streak</div>
                  <div className="text-2xl font-semibold text-gray-900">{user?.streak || 0} days</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">Completed Lessons</div>
                  <div className="text-2xl font-semibold text-gray-900">{user?.completedLessons?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Learning Progress</h2>
          <div className="space-y-4">
            {user?.goals?.map((goal, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-indigo-600 mr-3">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{goal}</h3>
                      <div className="mt-1 h-2 w-48 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-indigo-600 rounded-full"
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 