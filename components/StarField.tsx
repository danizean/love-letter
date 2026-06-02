"use client";

import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { useMemo } from "react";

// Generate a deterministic list of stars outside the component
// to prevent hydration mismatch and ensure stable renders.
const generateStars = (count: number) => {
  const stars = [];
  // Use a pseudo-random seed to make it look random but deterministic
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      top: `${random() * 100}%`,
      left: `${random() * 100}%`,
      size: random() > 0.8 ? (random() > 0.95 ? 3 : 2) : 1, // 1px, 2px, or 3px
      delay: random() * 4,
      duration: 3 + random() * 4,
      isMobileHidden: i > 40, // Hide stars after index 40 on mobile for performance
    });
  }
  return stars;
};

const STAR_DATA = generateStars(100);

export default function StarField() {
  const { isPlaying } = useAudio();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {STAR_DATA.map((star) => (
        <motion.span
          key={star.id}
          className={`absolute rounded-full bg-zinc-100 ${
            star.isMobileHidden ? "hidden md:block" : "block"
          }`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: star.size > 2 ? "0 0 6px 1px rgba(255,255,255,0.4)" : "none",
          }}
          animate={{
            opacity: [0.15, isPlaying ? 0.95 : 0.7, 0.15],
            scale: isPlaying ? [1, 1.25, 1] : 1,
          }}
          transition={{
            duration: isPlaying ? star.duration * 0.8 : star.duration, // Twinkle faster when playing
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
