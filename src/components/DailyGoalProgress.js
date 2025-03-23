import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Target } from 'lucide-react';

const DailyGoalProgress = () => {
  const { dailyGoal } = useGamification();
  const totalGoal = 5; // Daily goal is to complete 5 chapters
  const progress = (dailyGoal / totalGoal) * 100;

  return (
    <div className="bg-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Target className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="font-bold text-lg">Daily Goal</h3>
        </div>
        <div className="text-right">
          <p className="font-bold">{dailyGoal} / {totalGoal}</p>
          <p className="text-sm text-gray-600">Chapters</p>
        </div>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {dailyGoal >= totalGoal && (
        <p className="text-green-600 text-sm mt-2 font-medium">
          🎉 Daily goal completed!
        </p>
      )}
    </div>
  );
};

export default DailyGoalProgress; 