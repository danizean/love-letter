"use client";

/**
 * SpaceParallaxLayer — Deep Space Depth System
 *
 * 5 parallax layers, back to front:
 * 1. Deep star clusters   — slowest, faintest
 * 2. Nebula dust glow     — large blurred ellipses
 * 3. Astronaut silhouette — lone figure, barely visible
 * 4. Floating particles   — mid-field glowing dots
 * 5. Foreground micro-dust — fastest, creates speed/depth illusion
 *
 * Aesthetic: moonlit, romantic, cinematic. NOT sci-fi neon.
 */

import React, { memo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────
   Deterministic data — no Math.random() at render
   ───────────────────────────────────────────── */

const STAR_CLUSTERS = [
  { id: 1, top: "8%",  left: "5%",  size: 2 },
  { id: 2, top: "18%", left: "22%", size: 3 },
  { id: 3, top: "32%", left: "78%", size: 2 },
  { id: 4, top: "45%", left: "12%", size: 4 },
  { id: 5, top: "55%", left: "55%", size: 2 },
  { id: 6, top: "70%", left: "88%", size: 3 },
  { id: 7, top: "82%", left: "35%", size: 2 },
  { id: 8, top: "25%", left: "65%", size: 3 },
  { id: 9, top: "62%", left: "42%", size: 2 },
  { id: 10, top: "88%", left: "72%", size: 4 },
  { id: 11, top: "14%", left: "48%", size: 2 },
  { id: 12, top: "76%", left: "18%", size: 3 },
];

const FLOATING_PARTICLES = [
  { id: 1, top: "12%", left: "18%", size: 2, yRange: -60,  floatDur: 6,  delay: 0,   color: "rgba(255,255,255,0.25)" },
  { id: 2, top: "28%", left: "82%", size: 1, yRange: -90,  floatDur: 9,  delay: 1.5, color: "rgba(253,230,138,0.2)" },
  { id: 3, top: "44%", left: "6%",  size: 3, yRange: -45,  floatDur: 7,  delay: 0.8, color: "rgba(255,255,255,0.18)" },
  { id: 4, top: "58%", left: "72%", size: 2, yRange: -130, floatDur: 10, delay: 2,   color: "rgba(253,230,138,0.15)" },
  { id: 5, top: "70%", left: "28%", size: 1, yRange: -75,  floatDur: 5,  delay: 0.4, color: "rgba(255,255,255,0.22)" },
  { id: 6, top: "82%", left: "58%", size: 2, yRange: -110, floatDur: 8,  delay: 3,   color: "rgba(253,230,138,0.18)" },
  { id: 7, top: "20%", left: "44%", size: 1, yRange: -50,  floatDur: 6,  delay: 1.2, color: "rgba(255,255,255,0.15)" },
  { id: 8, top: "36%", left: "92%", size: 2, yRange: -155, floatDur: 11, delay: 0.6, color: "rgba(253,230,138,0.12)" },
  { id: 9, top: "65%", left: "14%", size: 3, yRange: -80,  floatDur: 8,  delay: 2.5, color: "rgba(255,255,255,0.2)" },
  { id: 10, top: "90%", left: "38%", size: 1, yRange: -180, floatDur: 12, delay: 1, color: "rgba(253,230,138,0.1)" },
];

const MICRO_DUST = [
  { id: 1, top: "5%",  left: "8%",  size: 0.5 },
  { id: 2, top: "20%", left: "95%", size: 1 },
  { id: 3, top: "55%", left: "2%",  size: 0.5 },
  { id: 4, top: "78%", left: "96%", size: 1 },
  { id: 5, top: "40%", left: "50%", size: 0.5 },
  { id: 6, top: "15%", left: "45%", size: 1 },
  { id: 7, top: "85%", left: "25%", size: 0.5 },
  { id: 8, top: "65%", left: "80%", size: 1 },
];

/* ─────────────────────────────────────────────
   Astronaut SVG — inline, pure silhouette
   ───────────────────────────────────────────── */
const AstronautSVG = memo(function AstronautSVG() {
  return (
    <svg
      viewBox="0 0 100 160"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Helmet */}
      <ellipse cx="50" cy="32" rx="24" ry="27" fill="rgba(255,255,255,0.06)" />
      {/* Helmet visor highlight — faint moonlight reflection */}
      <ellipse cx="45" cy="26" rx="10" ry="13" fill="rgba(255,255,255,0.04)" />

      {/* Neck ring */}
      <rect x="40" y="56" width="20" height="5" rx="2" fill="rgba(255,255,255,0.05)" />

      {/* Suit torso */}
      <rect x="28" y="60" width="44" height="48" rx="12" fill="rgba(255,255,255,0.055)" />

      {/* Left arm — raised slightly */}
      <rect x="6" y="58" width="22" height="14" rx="7" fill="rgba(255,255,255,0.05)"
        transform="rotate(-18 6 58)" />
      {/* Left glove */}
      <ellipse cx="10" cy="72" rx="7" ry="5" fill="rgba(255,255,255,0.045)"
        transform="rotate(-18 10 72)" />

      {/* Right arm — down/relaxed */}
      <rect x="72" y="62" width="22" height="14" rx="7" fill="rgba(255,255,255,0.05)"
        transform="rotate(8 72 62)" />
      {/* Right glove */}
      <ellipse cx="92" cy="76" rx="7" ry="5" fill="rgba(255,255,255,0.045)"
        transform="rotate(8 92 76)" />

      {/* Left leg */}
      <rect x="32" y="104" width="18" height="36" rx="8" fill="rgba(255,255,255,0.05)" />
      {/* Left boot */}
      <ellipse cx="41" cy="140" rx="11" ry="7" fill="rgba(255,255,255,0.045)" />

      {/* Right leg */}
      <rect x="50" y="104" width="18" height="36" rx="8" fill="rgba(255,255,255,0.05)" />
      {/* Right boot */}
      <ellipse cx="59" cy="140" rx="11" ry="7" fill="rgba(255,255,255,0.045)" />

      {/* Oxygen tube — subtle line */}
      <path d="M 72 72 Q 90 50 85 30" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />

      {/* Chest life support box */}
      <rect x="38" y="70" width="24" height="16" rx="4" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
});
AstronautSVG.displayName = "AstronautSVG";

/* ─────────────────────────────────────────────
   Comet / Shooting Star Effect
   ───────────────────────────────────────────── */
function Comet({ delay = 0, top = "10%", duration = 4 }: { delay?: number, top?: string, duration?: number }) {
  return (
    <motion.div
      className="absolute z-0 pointer-events-none"
      style={{
        top,
        left: "-20%",
        width: "150px",
        height: "2px",
        background: "linear-gradient(90deg, rgba(253,230,138,0.8) 0%, rgba(255,255,255,0.2) 20%, transparent 100%)",
        transformOrigin: "left center",
        rotate: 35,
        filter: "blur(1px)",
      }}
      animate={{
        x: ["0vw", "120vw"],
        y: ["0vh", "120vh"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 15 + delay,
        delay,
      }}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Floating Particle — own component so hooks are valid
   ───────────────────────────────────────────── */
interface ParticleProps {
  top: string;
  left: string;
  size: number;
  yRange: number;
  floatDur: number;
  delay: number;
  color: string;
  depthFactor: number;
  smooth: ReturnType<typeof useSpring>;
}

function FloatingParticle({ top, left, size, yRange, floatDur, delay, color, depthFactor, smooth, isPlaying }: ParticleProps & { isPlaying: boolean }) {
  const particleY = useTransform(smooth, [0, 1], ["0px", `${yRange}px`]);
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top,
        left,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        y: particleY,
        zIndex: 4,
        willChange: "transform",
      }}
      animate={{
        y: [0, yRange * depthFactor, 0],
        opacity: isPlaying ? [0.6, 1, 0.6] : [0.3, 0.7, 0.3],
        scale: isPlaying ? [1, 1.2, 1] : 1,
      }}
      transition={{
        y: { duration: floatDur, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: floatDur * 0.8, repeat: Infinity, ease: "easeInOut", delay },
        scale: { duration: floatDur * 0.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
    />
  );
}

interface SpaceParallaxLayerProps {
  isPlaying?: boolean;
  currentTime?: number;
  isLowPerf?: boolean;
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function SpaceParallaxLayer({
  isPlaying = false,
  currentTime = 0,
  isLowPerf = false,
}: SpaceParallaxLayerProps) {
  const { scrollYProgress } = useScroll();

  const smooth = useSpring(scrollYProgress, {
    stiffness: 10,
    damping: 40,
    mass: 1.5,
  });

  // Layer 1 — Deep star clusters (slowest)
  const layer1Y = useTransform(smooth, [0, 1], ["0vh", "-12vh"]);

  // Layer 2 — Nebula glow
  const layer2Y = useTransform(smooth, [0, 1], ["0vh", "-20vh"]);
  const layer2X = useTransform(smooth, [0, 1], ["0vw", "5vw"]);

  // Layer 3 — Astronaut
  const layer3Y = useTransform(smooth, [0, 1], ["0vh", "-40vh"]);
  const layer3X = useTransform(smooth, [0, 1], ["0vw", "2vw"]);

  // Layer 5 — Micro-dust (fastest)
  const layer5Y = useTransform(smooth, [0, 1], ["0vh", "-60vh"]);
  const layer5X = useTransform(smooth, [0, 1], ["0vw", "-5vw"]);

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
    >

      {/* ── Layer 1: Deep Star Clusters ─────────────────── */}
      <motion.div className="absolute inset-0" style={{ y: layer1Y, zIndex: 1 }}>
        {STAR_CLUSTERS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              background: s.id % 3 === 0
                ? "rgba(255,255,255,0.08)"
                : s.id % 3 === 1
                ? "rgba(255,255,255,0.06)"
                : "rgba(253,230,138,0.05)",
              boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.05)`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (s.id % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.id * 0.2,
            }}
          />
        ))}
        {/* Comets floating in deep space */}
        {!isLowPerf && (
          <>
            <Comet delay={0} top="5%" duration={5} />
            <Comet delay={8} top="45%" duration={4.5} />
            <Comet delay={16} top="75%" duration={6} />
          </>
        )}
      </motion.div>

      {/* ── Layer 2: Nebula Dust Glow (Optimized with radial gradients instead of filter:blur) ────────────────────── */}
      <motion.div
        className="absolute inset-0 gpu"
        style={{ y: layer2Y, x: layer2X, zIndex: 2 }}
      >
        {/* Primary nebula — upper right, warm */}
        <div
          className="absolute rounded-full"
          style={{
            top: "10%",
            left: "55%",
            width: "50vw",
            height: "50vw", // Use square for perfect radial gradients
            transform: "translateY(-25%)",
            background: isPlaying 
              ? "radial-gradient(circle, rgba(253,230,138,0.015) 0%, transparent 60%)" 
              : "radial-gradient(circle, rgba(253,230,138,0.01) 0%, transparent 60%)",
            transition: "background 3s ease-in-out",
          }}
        />
        {/* Secondary nebula — lower left, cool blue-white */}
        <div
          className="absolute rounded-full"
          style={{
            top: "55%",
            left: "-10%",
            width: "45vw",
            height: "45vw",
            transform: "translateY(-25%)",
            background: "radial-gradient(circle, rgba(200,200,255,0.008) 0%, transparent 65%)",
          }}
        />
        {/* Tertiary nebula — mid, amber */}
        <div
          className="absolute rounded-[100%]"
          style={{
            top: "35%",
            left: "30%",
            width: "30vw",
            height: "20vh",
            background: "rgba(253,230,138,0.012)",
            filter: isLowPerf ? "blur(70px)" : "blur(100px)",
          }}
        />
        {/* Deep space purple/pink cosmic dust */}
        <div
          className="absolute rounded-[100%]"
          style={{
            top: "70%",
            left: "60%",
            width: "40vw",
            height: "30vh",
            background: isPlaying ? "rgba(216,180,254,0.012)" : "rgba(216,180,254,0.005)",
            filter: isLowPerf ? "blur(95px)" : "blur(140px)",
            transition: "background 4s ease-in-out",
          }}
        />
      </motion.div>

      {/* ── Layer 3: Astronaut Silhouette ─────────────────── */}
      <motion.div
        className="absolute"
        style={{
          y: layer3Y,
          x: layer3X,
          zIndex: 3,
          right: "6%",
          top: "35%",
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1, ease: "easeInOut" }
        }}
        whileHover={{ opacity: 0.15 }}
        initial={{ opacity: isPlaying ? 0.12 : 0.07 }}
        animate={{
          y: [0, -14, 0, 10, 0],
          rotate: [-2, 2.5, -1.5, 2, -2],
          opacity: isPlaying ? 0.12 : 0.07,
        }}
      >
        {/* Astronaut container — responsive size */}
        <div
          className="transition-opacity duration-1000"
          style={{
            width: "clamp(50px, 7vw, 110px)",
            height: "clamp(80px, 11.2vw, 176px)",
          }}
        >
          <AstronautSVG />
        </div>

        {/* Very faint tether line floating behind */}
        <div
          className="absolute top-0 right-full w-px"
          style={{
            height: "30vh",
            background: "linear-gradient(to top, transparent, rgba(255,255,255,0.015))",
            transform: "translateY(-100%)",
          }}
        />
      </motion.div>

      {/* ── Layer 4: Floating Star Particles ─────────────── */}
      {(isLowPerf ? FLOATING_PARTICLES.slice(0, 5) : FLOATING_PARTICLES).map((p) => {
        const depthFactor = (p.id % 4) * 0.1 + 0.15;
        return (
          <FloatingParticle
            key={p.id}
            top={p.top}
            left={p.left}
            size={p.size}
            yRange={p.yRange}
            floatDur={p.floatDur}
            delay={p.delay}
            color={p.color}
            depthFactor={depthFactor}
            smooth={smooth}
            isPlaying={isPlaying}
          />
        );
      })}

      {/* ── Layer 5: Foreground Micro-Dust ────────────────── */}
      <motion.div className="absolute inset-0" style={{ y: layer5Y, x: layer5X, zIndex: 5 }}>
        {MICRO_DUST.map((d) => (
          <div
            key={d.id}
            className="absolute rounded-full"
            style={{
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              background: d.id % 2 === 0
                ? "rgba(255,255,255,0.1)"
                : "rgba(253,230,138,0.08)",
              opacity: isPlaying ? 1 : 0.4,
              transition: "opacity 3s ease-in-out",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
