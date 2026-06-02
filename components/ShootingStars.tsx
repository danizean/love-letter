"use client";

import { motion } from "framer-motion";
import { useAudio } from "./AudioProvider";

export default function ShootingStars() {
  const { isPlaying } = useAudio();

  // 3 shooting stars with different delays and positions
  const shooters = [
    { id: 1, top: "5%", left: "80%", delay: 12, duration: 1.5, angle: 45 },
    { id: 2, top: "20%", left: "95%", delay: 28, duration: 1.8, angle: 40 },
    { id: 3, top: "-5%", left: "60%", delay: 45, duration: 1.6, angle: 50 },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {shooters.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            top: star.top,
            left: star.left,
            transform: `rotate(-${star.angle}deg)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [0, -1200], // Moves left in local rotated coordinates
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: isPlaying ? 12 : 25,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Shooting Star Tail */}
            <div className="absolute top-1/2 left-0 w-[180px] h-[1.5px] bg-gradient-to-r from-amber-100/80 to-transparent -translate-y-1/2" />
            {/* Glowing Head */}
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 shadow-[0_0_15px_3px_rgba(253,230,138,0.8)] blur-[0.5px]" />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
