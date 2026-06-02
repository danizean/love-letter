"use client";

/**
 * LyricsSection — "Risk It All" Cinematic Lyrical Compositions
 *
 * Renders each timed lyric scene as a gorgeous 1:1 image and text composition.
 * Sourced directly from AudioProvider.
 *
 * Features:
 * - Alternating desktop layout modes
 * - Inserts a cinematic scrolling pause scene (Surprise 1) right before the chorus starts
 */

import { motion } from "framer-motion";
import { timedLyrics } from "./AudioProvider";
import LyricScene from "./LyricScene";
import SectionLabel from "./SectionLabel";

export default function LyricsSection() {
  return (
    <section
      id="lyrics"
      className="relative py-20 md:py-32"
      aria-label="Lyrics"
    >
      {/* Section intro header */}
      <motion.div
        className="text-center mb-16 md:mb-28 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <SectionLabel label="The confessional" className="mb-4 block font-sans" />
        <p className="text-zinc-500 font-sans text-sm max-w-md mx-auto italic">
          Sometimes a simple song says what the heart is waiting to hear.
        </p>
        <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent mx-auto mt-8" />
      </motion.div>

      {/* Timed Lyrical Compositions */}
      <div className="space-y-16 md:space-y-0">
        {timedLyrics.map((lyric, index) => {
          const isSayYouWantTheMoon = index === 3; // "Say you want the moon"

          return (
            <div key={index}>
              {/* Surprise 1: Before Reff Cinematic Scroll Pause Scene */}
              {isSayYouWantTheMoon && (
                <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
                  {/* Subtle warm glow burst behind transition */}
                  <div
                    className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(253,230,138,0.04) 0%, transparent 70%)",
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4 relative z-10"
                  >
                    <span className="text-[10px] tracking-[0.35em] uppercase text-zinc-600 font-sans">
                      transition
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-amber-200/50 italic leading-relaxed max-w-sm mx-auto">
                      and then,
                      <br />
                      the song finally says it...
                    </h3>
                    <div className="w-px h-16 bg-gradient-to-b from-amber-200/10 to-transparent mx-auto mt-8" />
                  </motion.div>
                </div>
              )}

              {/* Main Lyric Scene */}
              <LyricScene
                lyric={lyric.lyric}
                annotation={lyric.annotation}
                hiddenNote={lyric.hiddenNote}
                images={lyric.images}
                layout={lyric.layout}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
