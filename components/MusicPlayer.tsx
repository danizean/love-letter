"use client";

import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";

export default function MusicPlayer() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <motion.div
      className="fixed z-[90] pointer-events-none"
      style={{
        right: "max(16px, env(safe-area-inset-right))",
        bottom: "max(16px, env(safe-area-inset-bottom))",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative">
        {/* Subtle breathing ring when paused to encourage interaction */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border border-amber-200/40 pointer-events-none"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ 
                scale: [1, 1.4, 1], 
                opacity: [0.2, 0, 0.2] 
              }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={togglePlay}
          whileTap={{ scale: 0.9 }}
          className={`relative z-10 pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)] border ${
            isPlaying
              ? "border-amber-200/30 bg-zinc-950/60 text-amber-100"
              : "border-white/20 bg-zinc-950/60 text-zinc-300"
          }`}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Pause className="h-5 w-5" fill="currentColor" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center ml-1"
              >
                <Play className="h-5 w-5" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
