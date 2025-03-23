import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Flame } from 'lucide-react';

const StreakDisplay = () => {
  const { streak } = useGamification();

  return (
    <div className="bg-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Flame className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="font-bold text-lg">Learning Streak</h3>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl">{streak}</p>
          <p className="text-sm text-gray-600">Days</p>
        </div>
      </div>
      {streak >= 7 && (
        <div className="mt-2 bg-orange-100 p-2 rounded-lg">
          <p className="text-orange-800 text-sm font-medium">
            🔥 Week streak achieved!
          </p>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay; 