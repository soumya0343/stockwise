import React from 'react';

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Welcome to InvestEdu
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Your journey to financial literacy starts here
        </p>
        <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
          Start Learning
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage; 