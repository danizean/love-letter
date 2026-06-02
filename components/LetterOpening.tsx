"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { OpeningPhase } from "./ClientLetterOrchestrator";
import LoveParticles from "./LoveParticles";
import OpeningNote from "./OpeningNote";

interface LetterOpeningProps {
  phase: OpeningPhase;
  setPhase: (phase: OpeningPhase) => void;
}

export default function LetterOpening({ phase, setPhase }: LetterOpeningProps) {
  const { wantsMusic, togglePlay, isPlaying } = useAudio();

  // Lock page scrolling during opening phases
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSealClick = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("seal-glow");
    
    setTimeout(() => {
      setPhase("flap-opening");
    }, 500);

    setTimeout(() => {
      setPhase("note-rising");
    }, 1600); // 500 + 1100

    setTimeout(() => {
      setPhase("note-ready");
    }, 2900); // 1600 + 1300
  }, [phase, setPhase]);

  const handleNoteTap = useCallback(() => {
    if (phase === "note-ready") {
      setPhase("note-opening");
      
      // If user wants music and it hasn't started, try playing it now
      if (wantsMusic && !isPlaying) {
        togglePlay();
      }

      setTimeout(() => {
        setPhase("note-opened");
      }, 900);
    }
  }, [phase, setPhase, wantsMusic, isPlaying, togglePlay]);

  const handleContinue = useCallback(() => {
    setPhase("complete");
  }, [setPhase]);

  if (wantsMusic === null) return null;

  const isSealVisible = phase === "sealed" || phase === "seal-glow";
  const isFlapOpen = phase === "flap-opening" || phase === "note-rising" || phase === "note-ready" || phase === "note-opening" || phase === "note-opened";
  const isNoteRisingOrLater = phase === "note-rising" || phase === "note-ready" || phase === "note-opening" || phase === "note-opened";

  return (
    <AnimatePresence mode="wait">
      {phase !== "complete" && (
        <motion.div
          key="letter-opening-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Background Dimmer */}
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" />

          {/* Love Particles around envelope */}
          {phase === "flap-opening" && (
            <LoveParticles trigger={true} variant="float" className="z-10" />
          )}

          {/* Dissolve burst particles on complete / note-open */}
          {phase === "note-opened" && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
               <div className="w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_center,rgba(253,230,138,0.08)_0%,transparent_60%)]" />
            </motion.div>
          )}

          {/* Main Assembly */}
          <div className="relative flex items-center justify-center w-full h-full">
            
            {/* ENVELOPE ASSEMBLY */}
            <motion.div
              className="relative w-[88vw] max-w-[360px] md:w-[480px] h-[260px] md:h-[320px] select-none"
              style={{ perspective: 1200 }}
              animate={phase === "note-opening" || phase === "note-opened" ? { y: 100 } : { y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Back Panel */}
              <motion.div 
                className="absolute inset-0 bg-zinc-900/80 border border-white/10 rounded-md shadow-[0_20px_50px_rgba(253,230,138,0.05)]" 
                animate={phase === "note-opening" || phase === "note-opened" ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Inner Folded Note wrapper - lives between back panel and front pockets */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ y: 70, opacity: 0, scale: 0.92, rotate: -1 }}
                animate={{
                  y: isNoteRisingOrLater ? -120 : 70,
                  opacity: isNoteRisingOrLater ? 1 : 0,
                  scale: isNoteRisingOrLater ? 1 : 0.92,
                  rotate: isNoteRisingOrLater ? 0 : -1,
                }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* The actual note component */}
                <OpeningNote 
                  phase={phase}
                  onTapToUnfold={handleNoteTap}
                  onContinue={handleContinue}
                />
              </motion.div>

              {/* Front Pocket / Bottom Fold */}
              <motion.div 
                className="absolute inset-0 z-20 bg-zinc-800/70 border-t border-white/[0.04] rounded-b-md backdrop-blur-md pointer-events-none"
                style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 50% 65%, 0 40%)" }}
                animate={phase === "note-opening" || phase === "note-opened" ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              
              {/* Left Fold */}
              <motion.div 
                className="absolute inset-0 z-20 bg-zinc-800/80 border-r border-white/[0.02] rounded-l-md backdrop-blur-md pointer-events-none"
                style={{ clipPath: "polygon(0 0, 0 100%, 50% 50%)" }}
                animate={phase === "note-opening" || phase === "note-opened" ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Right Fold */}
              <motion.div 
                className="absolute inset-0 z-20 bg-zinc-800/80 border-l border-white/[0.02] rounded-r-md backdrop-blur-md pointer-events-none"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }}
                animate={phase === "note-opening" || phase === "note-opened" ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Top Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
                style={{
                  height: "60%",
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                }}
                initial={{ rotateX: 0, opacity: 1 }}
                animate={{ 
                  rotateX: isFlapOpen ? -145 : 0,
                  opacity: phase === "note-opening" || phase === "note-opened" ? 0 : 1 
                }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Flap Front (Visible when closed) */}
                <div
                  className="absolute inset-0 bg-zinc-800/90 backdrop-blur-md rounded-t-md shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    backfaceVisibility: "hidden",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                {/* Flap Back (Visible when open) */}
                <div
                  className="absolute inset-0 bg-zinc-900/90 backdrop-blur-md rounded-b-md"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transform: "rotateX(180deg)",
                    backfaceVisibility: "hidden",
                    borderTop: "1px solid rgba(255,255,255,0.04)"
                  }}
                />

                {/* Wax Seal */}
                <AnimatePresence>
                  {isSealVisible && (
                    <motion.button
                      className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full cursor-pointer group flex items-center justify-center outline-none z-40 pointer-events-auto"
                      style={{ backfaceVisibility: "hidden" }}
                      onClick={(e) => {
                         e.stopPropagation();
                         handleSealClick();
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.94 }}
                      animate={
                        phase === "seal-glow" 
                          ? { scale: [1, 1.15, 0.85], opacity: [1, 1, 0], filter: ["blur(0px)", "blur(0px)", "blur(8px)"] }
                          : { scale: 1, opacity: 1, filter: "blur(0px)" }
                      }
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      aria-label="Break the seal"
                    >
                      {/* Seal Glow */}
                      <span className="absolute inset-0 rounded-full bg-amber-700/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Seal Base */}
                      <span className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 border border-amber-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center overflow-hidden">
                        {/* Thin ring around it */}
                        <span className="w-[85%] h-[85%] rounded-full border border-amber-900/30 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] flex items-center justify-center">
                           <span className="w-[75%] h-[75%] rounded-full border border-amber-600/30 flex items-center justify-center">
                              {/* Abstract minimal heart mark */}
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(69,26,3,0.7)" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                           </span>
                        </span>
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            
            {/* Text Prompts */}
            <AnimatePresence>
              {phase === "sealed" && (
                <motion.div 
                  className="absolute bottom-1/4 left-0 right-0 text-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-zinc-400 italic">
                    tap the seal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {phase === "note-ready" && (
                <motion.div 
                  className="absolute bottom-1/4 left-0 right-0 text-center pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-amber-200/60 animate-pulse">
                    tap to open the note
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
