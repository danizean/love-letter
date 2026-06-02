"use client";

/**
 * MemoryGallery — Letter-Themed Memory Wall (Music-Reactive)
 *
 * Memories placed inside a private letter with:
 * - Attached photo prints with paper frames
 * - Tape/pin CSS pseudo-element effects
 * - Dark desk/gallery surface
 * - Hidden messages revealed as notes under photos
 * - Warm glow on hover/tap
 * - Centralized sync to the active music playing time:
 *   * Photos float slowly when music plays
 *   * Active photo glows softly and scales up
 *   * Hidden note appears automatically when the song reaches that memory's timestamp
 *
 * ⚠️ CUSTOMIZATION: Update the `memories` array below to add your own
 *    personal photos, dates, captions, and hidden messages.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import SectionLabel from "./SectionLabel";

/* ============================================
   MEMORY DATA — Sync to song playback
   ============================================ */
const memories = [
  {
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500&q=80",
    caption: "Late night walks",
    date: "Dec 2024",
    message: "I still remember this feeling.",
    rotate: -2.5,
    startTime: 0,   // Syncs with 0-20 seconds in the track
    endTime: 20,
  },
  {
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&q=80",
    caption: "Morning light",
    date: "Jan 2025",
    message: "A quiet moment that stayed.",
    rotate: 1.5,
    startTime: 20,  // Syncs with 20-40 seconds in the track
    endTime: 40,
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    caption: "The long drive",
    date: "Feb 2025",
    message: "You made ordinary days feel cinematic.",
    rotate: -1,
    startTime: 40,  // Syncs with 40-55 seconds in the track
    endTime: 55,
  },
  {
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80",
    caption: "Somewhere quiet",
    date: "Mar 2025",
    message: "Some memories never ask to be forgotten.",
    rotate: 2,
    startTime: 55,  // Syncs with 55-70 seconds in the track
    endTime: 70,
  },
  {
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80",
    caption: "Eyes closed",
    date: "Apr 2025",
    message: "In the silence, I hear you most clearly.",
    rotate: -1.5,
    startTime: 70,  // Syncs with 70-85 seconds in the track
    endTime: 85,
  },
  {
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&q=80",
    caption: "Last summer",
    date: "Jun 2025",
    message: "Every ending with you felt like a beginning.",
    rotate: 2.5,
    startTime: 85,  // Syncs with 85-105 seconds in the track
    endTime: 105,
  },
];

function MemoryCard({
  memory,
  index,
}: {
  memory: (typeof memories)[0];
  index: number;
}) {
  const { isPlaying, currentTime } = useAudio();
  const [isHoveredOrClicked, setIsHoveredOrClicked] = useState(false);

  // Check if this memory is active based on the song's current playback time
  const isActive = isPlaying && currentTime >= memory.startTime && currentTime < memory.endTime;

  // The note is revealed if either the song is at this time OR the user manual hovers/clicks it
  const isRevealed = isActive || isHoveredOrClicked;

  return (
    <motion.div
      className="relative cursor-pointer group select-none"
      initial={{ opacity: 0, y: 50, rotate: memory.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: isActive ? 0 : memory.rotate }}
      viewport={{ once: true, margin: "-50px" }}
      animate={{
        // Gentle float when music plays. The active card floats slightly higher with more presence.
        y: isPlaying ? (isActive ? [0, -18, 0] : [0, -8, 0]) : 0,
        scale: isActive ? 1.06 : isHoveredOrClicked ? 1.04 : 1,
        rotate: isActive ? 0 : isHoveredOrClicked ? 0 : memory.rotate,
        zIndex: isActive || isHoveredOrClicked ? 30 : 10,
      }}
      transition={{
        // Entrance transition defaults
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
        // Floating loop or hover transitions
        ...(isPlaying
          ? {
              y: {
                duration: isActive ? 4.5 : 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.6, // offset phase of each card so they float asynchronously
              },
              scale: { duration: 0.5, ease: "easeOut" },
              rotate: { duration: 0.5, ease: "easeOut" },
              zIndex: { duration: 0.2 },
            }
          : {
              scale: { duration: 0.3 },
              y: { duration: 0.3 },
              rotate: { duration: 0.3 },
              zIndex: { duration: 0.2 },
            }),
      }}
      onClick={() => setIsHoveredOrClicked((prev) => !prev)}
      onMouseEnter={() => setIsHoveredOrClicked(true)}
      onMouseLeave={() => setIsHoveredOrClicked(false)}
      role="button"
      tabIndex={0}
      aria-label={`Memory: ${memory.caption}. ${isRevealed ? memory.message : "Reveal message"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsHoveredOrClicked((prev) => !prev);
        }
      }}
    >
      {/* Tape effect — small strip at the top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-amber-200/[0.06] border border-amber-200/[0.08] rounded-sm z-20 backdrop-blur-sm" />

      {/* Card frame — paper photo print */}
      <div
        className="relative bg-zinc-900/70 border border-white/[0.08] rounded-sm overflow-hidden transition-all duration-700"
        style={{
          boxShadow: isRevealed
            ? "0 25px 60px rgba(0,0,0,0.55), 0 0 35px rgba(253,230,138,0.06)"
            : "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* Image area with paper border */}
        <div className="p-2.5 sm:p-3">
          <div className="relative overflow-hidden bg-zinc-800 aspect-[4/5]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memory.image}
              alt={memory.caption}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isRevealed ? "scale-105 grayscale-0" : "grayscale-[40%]"
              }`}
              loading="lazy"
            />

            {/* Dark overlay */}
            <div className={`absolute inset-0 bg-zinc-950/20 transition-opacity duration-500 ${isRevealed ? "opacity-30" : "opacity-100"}`} />

            {/* Hidden message — revealed like a note under the photo */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  className="absolute inset-0 flex items-end justify-center p-4 bg-gradient-to-t from-zinc-950/95 via-zinc-950/50 to-transparent"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <p className="text-amber-200/85 font-serif text-sm sm:text-base text-center italic leading-relaxed">
                    &ldquo;{memory.message}&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption area — handwritten-style */}
        <div className="px-3 pb-3 flex items-center justify-between">
          <span className="text-zinc-300 font-serif text-xs sm:text-sm italic">
            {memory.caption}
          </span>
          <span className="text-zinc-600 font-sans text-[9px] tracking-[0.2em] uppercase">
            {memory.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MemoryGallery() {
  const { isPlaying } = useAudio();

  return (
    <section
      id="memories"
      className="relative py-24 md:py-36 px-6 overflow-hidden"
      aria-label="Memory gallery"
    >
      {/* Background soft ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isPlaying ? [0.6, 1, 0.6] : 0.4
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background:
            "radial-gradient(circle 50vw at 50% 50%, rgba(253,230,138,0.018) 0%, transparent 80%)",
        }}
      />

      {/* Section header */}
      <motion.div
        className="text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <SectionLabel label="Memories" className="mb-6 block font-sans" />
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-zinc-100 mb-4 leading-tight">
          Little memories I kept
          <br />
          between the lines
        </h2>
        <p className="text-zinc-500 font-sans text-sm max-w-md mx-auto">
          Not everything needs to be loud to be unforgettable.
        </p>
        <div className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent mx-auto mt-8" />
      </motion.div>

      {/* Gallery grid */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {memories.map((memory, index) => (
            <MemoryCard key={index} memory={memory} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="mt-20 md:mt-28 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-amber-200/15 to-transparent mx-auto mb-4" />
        <p className="text-zinc-600 font-serif text-xs italic tracking-wide">
          for your eyes only
        </p>
      </motion.div>
    </section>
  );
}
