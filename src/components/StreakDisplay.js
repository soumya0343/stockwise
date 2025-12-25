import { useGamification } from "../context/GamificationContext";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

const StreakDisplay = () => {
  const weekProgress = (2 / 7) * 100;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border-4 border-gray-800 shadow-[4px_4px_0px_rgba(31,41,55,0.8)] relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-orange-100/50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
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
                repeatType: "reverse",
              }}
              className="relative"
            >
              <Flame className="w-7 h-7 text-orange-500 mr-2" />
              <motion.div
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="absolute -inset-1 bg-orange-200 rounded-full blur-sm"
              />
            </motion.div>
            <div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-400 text-transparent bg-clip-text">
                Learning Streak
              </h3>
              <p className="text-xs text-orange-600/80">
                Keep the momentum going!
              </p>
            </div>
          </div>
          <div className="text-right">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            >
              <p className="font-bold text-3xl bg-gradient-to-br from-orange-600 to-orange-400 text-transparent bg-clip-text">
                2
              </p>
            </motion.div>
            <p className="text-sm text-orange-600/80">Days</p>
          </div>
        </div>
        <div className="w-full h-4 bg-orange-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative"
            initial={{ width: 0 }}
            animate={{ width: `${weekProgress}%` }}
            transition={{ duration: 0.8 }}
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
        <div className="flex justify-between mt-2 items-center">
          <div className="flex items-center space-x-1 text-xs text-orange-600/80">
            <span>Week Goal:</span>
            <div className="flex items-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < 2 ? "bg-orange-500" : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-medium text-orange-600">
            {Math.floor(weekProgress)}%
          </span>
        </div>
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-orange-600/80">
            5 more days to unlock the weekly achievement! 🏆
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StreakDisplay;
