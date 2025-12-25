import React from "react";
import { useGamification } from "../context/GamificationContext";
import { motion } from "framer-motion";
import { Star, Target, Trophy } from "lucide-react";

const GamificationCard = ({ children, gradient }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`${gradient} p-6 rounded-xl shadow-lg flex items-center gap-3 h-full min-h-[5.5rem] relative overflow-hidden`}
  >
    <motion.div
      className="absolute inset-0 bg-white/10"
      animate={{
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    {children}
  </motion.div>
);

export const XPBar = () => {
  const { xp, level, progressToNextLevel, currentLevelName, nextLevelXP } =
    useGamification();

  return (
    <GamificationCard gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="relative"
      >
        <Trophy size={32} className="text-white" />
        <motion.div
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute -inset-1 bg-white/20 rounded-full blur-sm"
        />
      </motion.div>
      <div className="flex flex-col flex-grow">
        <motion.span
          className="text-2xl font-bold text-white"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 2,
          }}
        >
          Level {level}
        </motion.span>
        <span className="text-white/80 text-sm mb-2">{xp} XP</span>
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-white/60 rounded-full"
          />
        </div>
        <span className="text-white/60 text-xs mt-1">
          {nextLevelXP - xp} XP to next level
        </span>
      </div>
    </GamificationCard>
  );
};

export const AchievementBadge = ({ achievement, unlocked }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative group cursor-pointer`}
    >
      <div
        className={`
        bg-white p-6 rounded-xl border-4 
        ${
          unlocked
            ? "border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            : "border-gray-300 hover:border-gray-400"
        } 
        transition-all duration-300
      `}
      >
        <motion.div
          initial={unlocked ? { scale: 1.2, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            text-5xl mb-3 transform transition-transform duration-200 
            ${
              unlocked
                ? "group-hover:scale-110"
                : "group-hover:rotate-12 opacity-50"
            }
          `}
        >
          {achievement.icon}
        </motion.div>
        <h3
          className={`font-bold text-lg mb-2 ${
            unlocked ? "text-yellow-600" : "text-gray-400"
          }`}
        >
          {achievement.name}
        </h3>
        <p
          className={`text-sm ${unlocked ? "text-gray-600" : "text-gray-400"}`}
        >
          {achievement.description}
        </p>

        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}

        {!unlocked && (
          <div className="absolute inset-0 rounded-xl transition-all duration-300 group-hover:backdrop-blur-[2px]">
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/30 rounded-xl transition-all duration-300" />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl filter drop-shadow-lg mb-2"
              >
                🔒
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="text-white text-sm font-medium text-center px-4"
              >
                Keep going to unlock!
              </motion.p>
            </motion.div>
          </div>
        )}
      </div>

      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full shadow-lg"
        >
          Unlocked!
        </motion.div>
      )}
    </motion.div>
  );
};

export const LevelUpNotification = ({ level, onClose }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] z-50"
    >
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
        <p className="text-gray-600">You've reached level {level}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};
