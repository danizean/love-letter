"use client";

/**
 * ScrollProgress
 * 
 * A thin, elegant progress bar at the very top of the viewport.
 * Uses Framer Motion's useScroll + useSpring for smooth scroll tracking.
 * Amber/gold accent color matching the design palette.
 */

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 h-[2px] bg-amber-200/80 origin-left progress-glow"
      style={{ scaleX, zIndex: 9998, top: "env(safe-area-inset-top)" }}
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
