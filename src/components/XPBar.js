import React, { useEffect, useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { LEVELS } from '../contexts/GamificationContext';
import { motion, useAnimation } from 'framer-motion';
import { Star } from 'lucide-react';

const XPBar = () => {
  const { xp, level } = useGamification();
  const [prevXp, setPrevXp] = useState(xp);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const progressControls = useAnimation();
  
  // Calculate level progress
  const currentLevelXP = LEVELS[level].xpRequired;
  const nextLevelXP = LEVELS[level + 1]?.xpRequired || currentLevelXP + 1000;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelXP);
  const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
  const progress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));
  const xpToNext = nextLevelXP - xp;

  // Format numbers for display
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  useEffect(() => {
    // Handle XP changes
    if (xp !== prevXp) {
      const gained = xp - prevXp;
      setXpGained(gained);
      setShowXPGain(true);
      
      // Hide XP gain notification after 2 seconds
      setTimeout(() => {
        setShowXPGain(false);
      }, 2000);

      if (xp >= nextLevelXP) {
        // Level up animation sequence
        setIsLevelingUp(true);
        progressControls.start({
          width: "100%",
          transition: { duration: 0.5 }
        }).then(() => {
          setTimeout(() => {
            setIsLevelingUp(false);
            progressControls.set({
              width: `${progress}%`
            });
          }, 500);
        });
      } else {
        // Smooth progress update animation
        progressControls.start({
          width: `${progress}%`,
          transition: { 
            type: "spring",
            stiffness: 60,
            damping: 12
          }
        });
      }
      setPrevXp(xp);
    }
  }, [xp, prevXp, progress, nextLevelXP, progressControls]);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] relative overflow-hidden">
      {/* XP Gain Notification */}
      {showXPGain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-2 right-2 bg-green-100 px-3 py-1 rounded-full"
        >
          <span className="text-green-600 font-medium">+{xpGained} XP</span>
        </motion.div>
      )}
      
      <motion.div
        className="absolute inset-0 bg-orange-100/50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <motion.div
              animate={isLevelingUp ? {
                scale: [1, 1.5, 1],
                rotate: [0, 360, 0],
              } : {
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: isLevelingUp ? 1 : 1.5,
                repeat: isLevelingUp ? 0 : Infinity,
                repeatType: "reverse"
              }}
              className="relative"
            >
              <Star className={`w-7 h-7 ${isLevelingUp ? 'text-yellow-500' : 'text-orange-500'} mr-2`} />
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className={`absolute -inset-1 ${isLevelingUp ? 'bg-yellow-200' : 'bg-orange-200'} rounded-full blur-sm`}
              />
            </motion.div>
            <div>
              <motion.h3 
                className="font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-400 text-transparent bg-clip-text"
                animate={isLevelingUp ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                Level {level}
              </motion.h3>
              <p className="text-xs text-orange-600/80">{LEVELS[level].name}</p>
            </div>
          </div>
          <div className="text-right">
            <motion.p 
              className="font-bold text-2xl bg-gradient-to-br from-orange-600 to-orange-400 text-transparent bg-clip-text"
              animate={isLevelingUp ? {
                scale: [1, 1.3, 1],
                y: [0, -10, 0]
              } : {
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: isLevelingUp ? 1 : 0.5,
                repeat: isLevelingUp ? 0 : Infinity,
                repeatType: "reverse",
                repeatDelay: 2
              }}
            >
              {formatNumber(xp)}
            </motion.p>
            <p className="text-sm text-orange-600/80">Total XP</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-4 bg-orange-100 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${
              isLevelingUp 
                ? 'from-yellow-400 via-yellow-500 to-yellow-600' 
                : 'from-orange-400 via-orange-500 to-orange-600'
            } relative`}
            style={{ width: `${progress}%` }}
            animate={progressControls}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* Progress Details */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-orange-600/80">Level Progress:</span>
            <span className="font-medium text-orange-600">
              {formatNumber(xpInCurrentLevel)} / {formatNumber(xpRequiredForNextLevel)} XP
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-orange-600/80">Next Level in:</span>
            <span className="font-medium text-orange-600">{formatNumber(xpToNext)} XP</span>
          </div>
          <div className="flex justify-end">
            <span className="text-xs font-medium text-orange-600">{Math.floor(progress)}% Complete</span>
          </div>
        </div>

        {/* Level Up Messages */}
        {progress >= 90 && !isLevelingUp && (
          <motion.div 
            className="mt-2 text-center bg-orange-100 p-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium text-orange-600">
              ⚡ Almost there! Only {formatNumber(xpToNext)} XP to Level {level + 1}!
            </p>
          </motion.div>
        )}
        {isLevelingUp && (
          <motion.div 
            className="mt-2 text-center bg-yellow-100 p-2 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-yellow-600">
              🌟 Level Up! Welcome to Level {level}! 🌟
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default XPBar; 