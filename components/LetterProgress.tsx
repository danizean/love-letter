"use client";

/**
 * LetterProgress — Chapter Progress Indicator
 *
 * A small fixed indicator in the top-right corner showing the
 * current lyric section while scrolling through lyrics.
 * Glassmorphism style, minimal, updates based on scroll position.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_SECTIONS = 7;

export default function LetterProgress() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const lyricsSection = document.getElementById("lyrics");
      if (!lyricsSection) return;

      const rect = lyricsSection.getBoundingClientRect();
      const sectionHeight = lyricsSection.scrollHeight;
      const viewportHeight = window.innerHeight;

      // Show indicator only when in the lyrics section
      const inLyrics = rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.5;
      setIsVisible(inLyrics);

      if (inLyrics) {
        // Calculate which section we're in
        const scrolledIntoSection = -rect.top + viewportHeight * 0.4;
        const progress = Math.max(0, Math.min(1, scrolledIntoSection / sectionHeight));
        const section = Math.min(
          TOTAL_SECTIONS,
          Math.max(1, Math.ceil(progress * TOTAL_SECTIONS))
        );
        setCurrentSection(section);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-6 right-6 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-md px-4 py-2.5">
            <p className="text-zinc-600 text-[9px] tracking-[0.3em] uppercase font-sans mb-1">
              Reading the letter
            </p>
            <p className="text-zinc-300 text-xs font-sans tabular-nums">
              <span className="text-amber-200/70">
                {String(currentSection).padStart(2, "0")}
              </span>
              <span className="text-zinc-600 mx-1">/</span>
              <span className="text-zinc-500">
                {String(TOTAL_SECTIONS).padStart(2, "0")}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
