"use client";

import { motion, AnimatePresence, Transition } from "framer-motion";
import { useState, useEffect } from "react";
import { OpeningPhase } from "@/app/page";

interface OpeningNoteProps {
  phase: OpeningPhase;
  onContinue: () => void;
  onTapToUnfold: () => void;
}

const PaperTexture = () => (
  <div 
    className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none rounded-inherit"
    style={{
      backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
    }}
  />
);

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Timings for the cinematic sequence
const T_FLAP_OPEN: Transition = { duration: 0.6, delay: 0, ease: EASE_PREMIUM };
const T_LETTER_RISE: Transition = { duration: 0.8, delay: 0.4, ease: EASE_PREMIUM };
const T_ENV_DROP: Transition = { duration: 0.8, delay: 0.4, ease: EASE_PREMIUM };
const T_LETTER_UNFOLD_TOP: Transition = { duration: 0.8, delay: 0.9, ease: EASE_PREMIUM };
const T_LETTER_UNFOLD_BOT: Transition = { duration: 0.8, delay: 1.05, ease: EASE_PREMIUM };

export default function OpeningNote({ phase, onContinue, onTapToUnfold }: OpeningNoteProps) {
  const [showButton, setShowButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isUnfolded = phase === "note-opening" || phase === "note-opened";

  useEffect(() => {
    if (isUnfolded) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 3200); // Waits for the full sequence + text to appear
      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [isUnfolded]);

  const handleTap = () => {
    if (isAnimating || isUnfolded) return;
    setIsAnimating(true);
    onTapToUnfold();
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const lines = [
    "I made this for you,",
    "not because words are enough,",
    "",
    "but because some feelings",
    "deserve to be opened slowly."
  ];

  return (
    <motion.div
      className="relative z-30 w-[90vw] max-w-[500px] cursor-pointer outline-none mx-auto"
      style={{ perspective: 1400 }}
      onClick={handleTap}
      whileHover={!isUnfolded ? { y: -2, rotate: 0.5 } : {}}
      whileTap={!isUnfolded ? { scale: 0.98 } : {}}
      animate={!isUnfolded ? { y: [0, -4, 0] } : { y: 0 }}
      transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      role="button"
      tabIndex={0}
      aria-expanded={isUnfolded}
      aria-label="Folded envelope"
    >
      {/* Wrapper maintains layout space to prevent page jumping */}
      <motion.div
        className="relative w-full mx-auto h-[420px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={isUnfolded ? "opened" : "closed"}
        initial={false}
      >

        {/* =========================================
            STAGE 1: ENVELOPE LAYER
            Drops away and fades out when letter is pulled.
        ========================================= */}
        <motion.div
          className="absolute left-0 right-0 h-[140px]"
          variants={{
            closed: { y: 160, opacity: 1, scale: 1, transition: { duration: 0.6 } },
            opened: { y: 300, opacity: 0, scale: 0.9, transition: T_ENV_DROP }
          }}
          style={{ transformStyle: "preserve-3d", zIndex: 10 }}
        >
          {/* Back Pocket */}
          <div className="absolute inset-0 bg-zinc-800 rounded-lg shadow-xl border border-white/[0.08]">
            <PaperTexture />
            <div className="absolute inset-0 bg-black/20 rounded-lg" /> {/* Inner darkness */}
          </div>

          {/* Front Pocket */}
          <div 
            className="absolute inset-0 bg-zinc-800 rounded-b-lg border-b border-x border-white/[0.1] shadow-2xl z-30"
            style={{ clipPath: "polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%)" }}
          >
            <PaperTexture />
            {/* Subtle V-crease lines */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Envelope Flap (Top) */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[85px] origin-top z-40"
          variants={{
              closed: { rotateX: 0, transition: { duration: 0.6 } },
              opened: { rotateX: 180, transition: T_FLAP_OPEN }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Flap Outside (Visible when closed) */}
            <div 
              className="absolute inset-0 bg-zinc-800 border-x border-b border-white/[0.1] shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "hidden" }} 
            >
               <PaperTexture />
               {/* Moonlight glint */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />
               {/* Wax Seal */}
               <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-red-950/90 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-red-900 flex items-center justify-center">
                 <div className="w-6 h-6 border border-white/20 rounded-full opacity-50" />
               </div>
            </div>

            {/* Flap Inside (Visible when opened) */}
            <div 
              className="absolute inset-0 bg-zinc-900 border border-white/[0.05]" 
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} 
            >
               <PaperTexture />
            </div>
          </motion.div>
        </motion.div>

        {/* =========================================
            STAGE 2 & 3: LETTER LAYER
            Slides out, then unfolds top and bottom flaps.
        ========================================= */}
        <motion.div
          className="absolute inset-0"
          variants={{
            closed: { scale: 1 },
            opened: { scale: [1, 1.015, 1], transition: { duration: 0.6, delay: 1.7, ease: EASE_PREMIUM } }
          }}
          style={{ transformStyle: "preserve-3d", zIndex: 20 }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[140px]"
            variants={{
              closed: { y: 160, scale: 0.95, transition: { duration: 0.6 } },
              opened: { y: 140, scale: 1, transition: T_LETTER_RISE }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
          {/* CENTER PANEL */}
          <div className="absolute inset-0 bg-zinc-900 border-x border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <PaperTexture />
            {/* Ambient center glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none" />
            
            {/* Inner shadows cast by flaps */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent"
              variants={{ closed: { opacity: 1 }, opened: { opacity: 0, transition: T_LETTER_UNFOLD_TOP } }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
              variants={{ closed: { opacity: 1 }, opened: { opacity: 0, transition: T_LETTER_UNFOLD_BOT } }}
            />
          </div>

          {/* TOP FLAP */}
          <motion.div
            className="absolute bottom-full left-0 right-0 h-[140px] origin-bottom"
            variants={{
              closed: { rotateX: -179.9, z: 2, transition: { duration: 0.6 } },
              opened: { rotateX: 0, z: 0, transition: T_LETTER_UNFOLD_TOP }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inside Face (Reads text) */}
            <div className="absolute inset-0 bg-zinc-900 rounded-t-xl border-t border-x border-white/[0.08]" style={{ backfaceVisibility: "hidden" }}>
              <PaperTexture />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20 blur-[1px]" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
            </div>
            {/* Outside Face (Back of paper) */}
            <div className="absolute inset-0 bg-zinc-900 rounded-t-xl border-t border-x border-white/[0.05]" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
              <PaperTexture />
            </div>
          </motion.div>

          {/* BOTTOM FLAP */}
          <motion.div
            className="absolute top-full left-0 right-0 h-[140px] origin-top"
            variants={{
              closed: { rotateX: 179.9, z: 1, transition: { duration: 0.6 } },
              opened: { rotateX: 0, z: 0, transition: T_LETTER_UNFOLD_BOT }
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inside Face (Reads text) */}
            <div className="absolute inset-0 bg-zinc-900 rounded-b-xl border-b border-x border-white/[0.08]" style={{ backfaceVisibility: "hidden" }}>
              <PaperTexture />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/20 blur-[1px]" />
              <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />
              {/* Drop shadow on table */}
              <motion.div 
                className="absolute top-full left-4 right-4 h-10 bg-black/40 blur-xl"
                variants={{ closed: { opacity: 0 }, opened: { opacity: 1, transition: { duration: 1, delay: 1 } } }}
              />
            </div>
            {/* Outside Face (Back of paper) */}
            <div className="absolute inset-0 bg-zinc-900 rounded-b-xl border-b border-x border-white/[0.05]" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
              <PaperTexture />
            </div>
          </motion.div>
        </motion.div>
        </motion.div>

        {/* =========================================
            STAGE 4: TEXT REVEAL
            Fades in after letter is unfolded.
        ========================================= */}
        <AnimatePresence>
          {isUnfolded && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 text-center z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }} // Waits for unfolds to finish
            >
              <div className="space-y-2 mb-10 text-amber-100/90 w-full">
                {lines.map((line, idx) => (
                  <motion.p
                    key={idx}
                    className="font-serif text-lg sm:text-xl italic leading-relaxed tracking-wide drop-shadow-sm"
                    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 1.7 + idx * 0.15, ease: "easeOut" }}
                  >
                    {line === "" ? <span className="block h-4" /> : line}
                  </motion.p>
                ))}
              </div>

              {/* Continue Reading Button */}
              <AnimatePresence>
                {showButton && (
                  <motion.button
                    className="group relative inline-flex items-center justify-center cursor-pointer mt-2 pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContinue();
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <span className="absolute inset-0 rounded-full border border-zinc-500/40 group-hover:border-amber-200/50 transition-colors duration-500" />
                    <span
                      className="relative px-7 py-3 rounded-full text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-sans font-medium text-zinc-300 group-hover:text-amber-100 transition-colors duration-500"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)" }}
                    >
                      Continue reading
                    </span>
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[0_0_20px_rgba(253,230,138,0.15)]" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}
