"use client";

import { motion } from "framer-motion";

interface LoveParticlesProps {
  /** If true, the particles are rendered */
  trigger?: boolean;
  /** Center origin for burst, or spread out */
  variant?: "float" | "burst" | "moonlit";
  className?: string;
}

// Deterministic array to prevent hydration mismatch
const PARTICLE_DATA = [
  { id: 1, x: -20, y: -40, scale: 0.8, delay: 0.1, color: "text-amber-200/25" },
  { id: 2, x: 30, y: -60, scale: 1.2, delay: 0.3, color: "text-rose-200/15" },
  { id: 3, x: -40, y: -80, scale: 0.5, delay: 0.5, color: "text-stone-100/20" },
  { id: 4, x: 10, y: -50, scale: 0.9, delay: 0.2, color: "text-white/15" },
  { id: 5, x: -10, y: -70, scale: 1.1, delay: 0.4, color: "text-amber-200/25" },
  { id: 6, x: 40, y: -30, scale: 0.6, delay: 0.6, color: "text-rose-200/15" },
  { id: 7, x: -30, y: -90, scale: 1.0, delay: 0.7, color: "text-stone-100/20" },
  { id: 8, x: 20, y: -100, scale: 0.7, delay: 0.15, color: "text-white/15" },
  { id: 9, x: -5, y: -120, scale: 1.3, delay: 0.8, color: "text-amber-200/25" },
  { id: 10, x: 35, y: -110, scale: 0.8, delay: 0.45, color: "text-rose-200/15" },
  { id: 11, x: -25, y: -55, scale: 0.9, delay: 0.9, color: "text-stone-100/20" },
  { id: 12, x: 15, y: -75, scale: 1.1, delay: 0.25, color: "text-white/15" },
];

export default function LoveParticles({
  trigger = true,
  variant = "float",
  className = "",
}: LoveParticlesProps) {
  if (!trigger) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-50 flex items-center justify-center ${className}`}>
      {PARTICLE_DATA.map((p) => {
        // Adjust animation based on variant
        const isBurst = variant === "burst";
        const targetY = isBurst ? p.y * 1.5 : p.y;
        const targetX = isBurst ? p.x * 2 : p.x + (p.id % 2 === 0 ? 15 : -15);

        return (
          <motion.div
            key={p.id}
            className={`absolute flex items-center justify-center ${p.color}`}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: targetY,
              x: targetX,
              scale: [0.4, p.scale, p.scale * 0.7],
              rotate: p.id % 2 === 0 ? 45 : -45,
            }}
            transition={{
              duration: isBurst ? 2.5 : 3.2,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Subtle heart silhouette using SVG path to keep it elegant and abstract */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
