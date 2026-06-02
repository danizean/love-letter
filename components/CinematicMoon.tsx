"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useAudio } from "./AudioProvider";

export default function CinematicMoon() {
  const { isPlaying } = useAudio();
  const { scrollYProgress } = useScroll();

  // Smoothing for scroll values
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 10,
    damping: 40,
    mass: 1.5,
  });

  // Parallax transforms - moon rises up from the bottom as you scroll down
  const y = useTransform(smoothProgress, [0, 1], ["0vh", "-120vh"]);
  const x = useTransform(smoothProgress, [0, 1], ["0vw", "-15vw"]);
  const scale = useTransform(smoothProgress, [0, 0.6, 1], [1, 0.95, 0.9]);
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.8, 1], [0.8, 0.7, 0.5, 0.3]);

  return (
    <motion.div
      className="fixed bottom-[-8%] right-[-6%] md:bottom-[-2%] md:right-[3%] z-[2] pointer-events-none"
      style={{ y, x, scale, opacity }}
    >
      {/* 
        The Moon Base 
        We use layered CSS radial gradients to avoid using heavy images and create an HD feel.
      */}
      <div 
        className="relative w-[220px] h-[220px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] rounded-full transition-all duration-[3000ms] ease-in-out"
        style={{
          background: isPlaying 
            ? "radial-gradient(circle at 35% 35%, #fffbf0 0%, #e8dec7 40%, #877f6b 85%, #2a2825 100%)"
            : "radial-gradient(circle at 35% 35%, #f4f4f5 0%, #d4d4d8 40%, #71717a 85%, #27272a 100%)",
          boxShadow: isPlaying 
            ? "0 0 160px 40px rgba(251,191,36,0.18), inset 0 0 80px rgba(0,0,0,0.5)"
            : "0 0 120px 20px rgba(255,255,255,0.08), inset 0 0 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Subtle Crater Textures */}
        <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay"
          style={{
            background: "radial-gradient(circle at 70% 60%, rgba(0,0,0,0.4) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(0,0,0,0.3) 0%, transparent 30%), radial-gradient(circle at 60% 20%, rgba(0,0,0,0.2) 0%, transparent 35%)"
          }}
        />

        {/* Outer Blurred Halo */}
        <div className={`absolute inset-[-10%] rounded-full blur-2xl -z-10 transition-opacity duration-[3000ms] ${isPlaying ? "bg-amber-100/10" : "bg-zinc-100/5"}`} />
        
        {/* Extreme Outer Glow */}
        <div className={`absolute inset-[-40%] rounded-full blur-[80px] -z-20 transition-opacity duration-[3000ms] ${isPlaying ? "bg-amber-500/5" : "bg-white/5"}`} />
      </div>
    </motion.div>
  );
}
