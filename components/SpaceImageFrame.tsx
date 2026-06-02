"use client";

/**
 * SpaceImageFrame — Cosmic-themed single image frame
 *
 * Replaces the horizontal slider with a premium space-themed display:
 * - Thin orbital ring animation around the frame
 * - Corner star/constellation markers
 * - Soft nebula glow when active
 * - Mouse-parallax on desktop
 * - Graceful 404 fallback
 */

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

interface SpaceImageFrameProps {
  image: string;
  isActive: boolean;
  isPlaying: boolean;
  index: number;
}

export default function SpaceImageFrame({
  image,
  isActive,
  isPlaying,
  index,
}: SpaceImageFrameProps) {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse-parallax (desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 });
  const imgX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const imgY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || e.pointerType !== "mouse") return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
      mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
    },
    [mouseX, mouseY, shouldReduceMotion]
  );

  const resetPointer = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Alternate orbital ring rotation direction per index
  const orbitDirection = index % 2 === 0 ? 1 : -1;

  return (
    <div className="relative w-full flex justify-center">
      {/* Outer cosmic glow — visible when active */}
      <motion.div
        className="absolute pointer-events-none gpu"
        style={{
          inset: "-60px",
          background: isActive
            ? "radial-gradient(ellipse at center, rgba(253,230,138,0.06) 0%, transparent 60%)"
            : "none",
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      />

      {/* Main frame container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ width: "min(88vw, 420px)" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
      >
        {/* ── Orbital Ring ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: "-14px",
            borderRadius: "2rem",
          }}
          animate={{
            rotate: [0, 360 * orbitDirection],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* The ring itself — dashed border */}
          <div
            className="absolute inset-0 rounded-[2rem]"
            style={{
              border: `1px dashed ${isActive ? "rgba(253,230,138,0.12)" : "rgba(255,255,255,0.04)"}`,
              transition: "border-color 1s ease-in-out",
            }}
          />
          {/* Orbiting dot */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              top: -2,
              left: "50%",
              transform: "translateX(-50%)",
              background: isActive ? "rgba(253,230,138,0.5)" : "rgba(255,255,255,0.15)",
              boxShadow: isActive ? "0 0 8px rgba(253,230,138,0.3)" : "none",
              transition: "background 1s, box-shadow 1s",
            }}
          />
        </motion.div>

        {/* ── Corner Constellation Markers ── */}
        {/* Top-left */}
        <div className="absolute -top-3 -left-3 z-10 pointer-events-none">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: isActive ? "rgba(253,230,138,0.4)" : "rgba(255,255,255,0.1)",
              boxShadow: isActive ? "0 0 6px rgba(253,230,138,0.2)" : "none",
              transition: "all 1s ease-in-out",
            }}
            animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute top-1/2 left-full w-4 h-px ml-0.5"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.08), transparent)" }}
          />
          <div
            className="absolute top-full left-1/2 w-px h-4 mt-0.5"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }}
          />
        </div>

        {/* Top-right */}
        <div className="absolute -top-3 -right-3 z-10 pointer-events-none">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isActive ? "rgba(253,230,138,0.3)" : "rgba(255,255,255,0.08)",
              transition: "all 1s ease-in-out",
            }}
            animate={isPlaying ? { scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <div
            className="absolute top-1/2 right-full w-4 h-px mr-0.5"
            style={{ background: "linear-gradient(to left, rgba(255,255,255,0.08), transparent)" }}
          />
        </div>

        {/* Bottom-left */}
        <div className="absolute -bottom-3 -left-3 z-10 pointer-events-none">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isActive ? "rgba(253,230,138,0.3)" : "rgba(255,255,255,0.08)",
              transition: "all 1s ease-in-out",
            }}
            animate={isPlaying ? { scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Bottom-right */}
        <div className="absolute -bottom-3 -right-3 z-10 pointer-events-none">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: isActive ? "rgba(253,230,138,0.35)" : "rgba(255,255,255,0.1)",
              boxShadow: isActive ? "0 0 6px rgba(253,230,138,0.15)" : "none",
              transition: "all 1s ease-in-out",
            }}
            animate={isPlaying ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <div
            className="absolute bottom-1/2 right-full w-4 h-px mr-0.5"
            style={{ background: "linear-gradient(to left, rgba(255,255,255,0.06), transparent)" }}
          />
          <div
            className="absolute bottom-full left-1/2 w-px h-4 mb-0.5"
            style={{ background: "linear-gradient(to top, rgba(255,255,255,0.06), transparent)" }}
          />
        </div>

        {/* ── Image Frame ── */}
        <motion.div
          className={`relative aspect-square overflow-hidden rounded-2xl border transition-all duration-700 ${
            isActive
              ? "border-white/15 shadow-[0_20px_80px_rgba(253,230,138,0.08),_0_0_1px_rgba(253,230,138,0.15)]"
              : "border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          }`}
          animate={{
            scale: isActive ? 1.02 : 1,
          }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.8, ease: SMOOTH_EASE }}
        >
          {!hasError ? (
            <motion.img
              src={image}
              alt="Lyric memory"
              draggable={false}
              onError={() => setHasError(true)}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              style={{
                x: imgX,
                y: imgY,
                scale: isActive ? 1.06 : 1.02,
              }}
              transition={{ scale: { duration: 0.8, ease: SMOOTH_EASE } }}
            />
          ) : (
            /* Graceful cosmic fallback */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 40%, #1c1917 0%, #0c0a09 60%, #09090b 100%)",
              }}
            >
              {/* Tiny decorative stars in fallback */}
              <div className="absolute top-[20%] left-[15%] w-0.5 h-0.5 rounded-full bg-white/20" />
              <div className="absolute top-[35%] right-[25%] w-1 h-1 rounded-full bg-amber-200/15" />
              <div className="absolute bottom-[30%] left-[40%] w-0.5 h-0.5 rounded-full bg-white/15" />
              <div className="absolute bottom-[20%] right-[20%] w-1 h-1 rounded-full bg-white/10" />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-white/[0.06]" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/[0.06]" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-white/[0.06]" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-white/[0.06]" />

              <span className="font-serif text-zinc-600 text-xs italic tracking-wide">
                a memory, drifting
              </span>
            </div>
          )}

          {/* Dark cinematic overlay */}
          <div
            className={`absolute inset-0 rounded-2xl transition-opacity duration-1000 ${
              isActive ? "opacity-20" : "opacity-50"
            }`}
            style={{
              background:
                "linear-gradient(180deg, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.1) 40%, rgba(9,9,11,0.4) 100%)",
            }}
          />

          {/* Active moonlight inner glow */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                boxShadow:
                  "inset 0 0 60px rgba(253,230,138,0.04), inset 0 -20px 40px rgba(0,0,0,0.3)",
              }}
            />
          )}

          {/* Top-edge subtle light streak */}
          <div
            className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
            style={{
              background: `linear-gradient(to right, transparent, ${
                isActive ? "rgba(253,230,138,0.15)" : "rgba(255,255,255,0.06)"
              }, transparent)`,
              transition: "background 1s",
            }}
          />
        </motion.div>

        {/* ── Reflection under frame ── */}
        <div
          className="pointer-events-none mx-auto mt-1 rounded-b-2xl gpu"
          style={{
            width: "80%",
            height: "20px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)",
          }}
        />

        {/* ── Coordinate label (subtle space-themed touch) ── */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="w-3 h-px bg-zinc-700" />
          <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-600 font-mono tabular-nums">
            {`memory ${String(index + 1).padStart(2, "0")}`}
          </span>
          <div className="w-3 h-px bg-zinc-700" />
        </motion.div>
      </div>
    </div>
  );
}
