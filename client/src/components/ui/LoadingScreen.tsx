import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { usePortfolio } from '@/lib/stores/usePortfolio';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const { progress } = useProgress();
  const setPhase = usePortfolio((state) => state.setPhase);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (progress === 100 && !isComplete) {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          setPhase('playing');
        }, 500);
      }, 1000);
    }
  }, [progress, isComplete, setPhase]);
  
  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]"
        >
          {/* BragaWork Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <img
              src="/attached_assets/Logo_braga_work_resized_1759263859355.jpg"
              alt="BragaWork"
              className="w-48 h-48 object-contain rounded-lg shadow-2xl shadow-cyan-500/50"
            />
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            BRAGAWORK CITY
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-cyan-300 mb-12"
          >
            Interactive Portfolio Experience
          </motion.p>
          
          {/* Progress Bar */}
          <div className="w-96 max-w-md px-4">
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-4 text-cyan-400 font-mono"
            >
              {Math.round(progress)}% LOADING...
            </motion.div>
          </div>
          
          {/* Animated dots */}
          <motion.div
            className="mt-8 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-cyan-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
          
          {/* Instructions */}
          {progress === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 text-center text-gray-400 space-y-2"
            >
              <p className="text-sm">Click to start exploring</p>
              <p className="text-xs">Use WASD to move • Mouse to look • SHIFT to run • SPACE to jump</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
