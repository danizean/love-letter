"use client";

import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
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
      <motion.button
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.4)] border ${
          isPlaying
            ? "border-amber-200/30 bg-zinc-950/60 text-amber-100"
            : "border-white/20 bg-zinc-950/60 text-zinc-300"
        }`}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" fill="currentColor" />
        ) : (
          <Play className="ml-1 h-5 w-5" fill="currentColor" />
        )}
      </motion.button>
    </motion.div>
  );
}
