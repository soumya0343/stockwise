import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { LEVELS } from '../contexts/GamificationContext';

const XPBar = () => {
  const { xp, level } = useGamification();
  
  const currentLevelXP = LEVELS[level].xpRequired;
  const nextLevelXP = LEVELS[level + 1]?.xpRequired || currentLevelXP + 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="bg-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg">Level {level}</h3>
          <p className="text-sm text-gray-600">{LEVELS[level].name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{xp} XP</p>
          <p className="text-sm text-gray-600">Next: {nextLevelXP} XP</p>
        </div>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar; 