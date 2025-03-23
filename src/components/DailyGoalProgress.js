import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

const DailyGoalProgress = () => {
  const { dailyGoalProgress } = useGamification();
  const completedChapters = Math.floor(dailyGoalProgress / 25);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-purple-100/50"
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
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="relative"
            >
              <Target className="w-7 h-7 text-purple-500 mr-2" />
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute -inset-1 bg-purple-200 rounded-full blur-sm"
              />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-400 text-transparent bg-clip-text">Daily Goal</h3>
              <p className="text-xs text-purple-600/80">Complete 4 chapters today!</p>
            </div>
          </div>
          <div className="text-right">
            <motion.p 
              className="font-bold text-2xl bg-gradient-to-br from-purple-600 to-purple-400 text-transparent bg-clip-text"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2
              }}
            >
              {completedChapters}/4
            </motion.p>
            <p className="text-sm text-purple-600/80">Chapters Done</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className={`h-12 rounded-lg flex items-center justify-center ${
                  i < completedChapters 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg' 
                    : 'bg-purple-100 border-2 border-dashed border-purple-200'
                }`}
                animate={i < completedChapters ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {i < completedChapters ? (
                  <motion.span 
                    className="text-white text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span className="text-purple-300 text-sm">
                    {i + 1}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-purple-600/80">
            <span>Daily Progress:</span>
            <span className="font-medium">{completedChapters * 25}%</span>
          </div>
        </div>

        {dailyGoalProgress === 100 && (
          <motion.div 
            className="mt-3 text-center bg-purple-100 p-2 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium text-purple-600">
              🎉 Daily goal completed! +500 XP bonus!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DailyGoalProgress; 