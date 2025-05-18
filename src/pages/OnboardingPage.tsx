import React from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-beige-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-black mb-4 text-center">
          Welcome to InvestEdu
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Your journey to financial literacy starts here
        </p>
        <button 
          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors"
          onClick={() => navigate('/login')}
        >
          Login to Continue
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage; 