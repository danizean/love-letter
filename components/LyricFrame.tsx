"use client";

/**
 * LyricFrame — Reusable Editorial Framed Lyric Card (Music-Reactive)
 *
 * Each lyric appears inside an elegant editorial frame that feels like
 * a page from a private letter, gallery print, or editorial poem card.
 *
 * Features:
 * - Glass paper effect (bg-white/[0.035], backdrop-blur-xl, border-white/10)
 * - Large serif lyric text with Playfair Display (text-4xl to text-7xl, leading-[0.95], tracking-tight)
 * - Corner decorative lines that glow when active
 * - Elegant watermark quotation mark in background (no labels, no numbers)
 * - Background memory image overlay with parallax (opacity increases when active)
 * - Soft amber/sage glow when active
 * - Smooth vertical parallax scale & blur effects
 * - Auto-scrolls into view when "Follow lyrics" is active and the track reaches this timestamp
 */

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useAudio } from "./AudioProvider";

interface LyricFrameProps {
  /** Main lyric text */
  lyric: string;
  /** Small annotation below the lyric */
  annotation?: string;
  /** Alignment: left, center, or right */
  align: "left" | "center" | "right";
  /** Background image URL */
  image: string;
  /** Accent color theme */
  accent: "gold" | "sage";
  /** Index of this lyric in the timed lyrics array */
  index: number;
}

const alignmentClasses = {
  left: "mr-auto ml-6 md:ml-16 lg:ml-24",
  center: "mx-auto",
  right: "ml-auto mr-6 md:mr-16 lg:mr-24",
};

const textAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function LyricFrame({
  lyric,
  annotation,
  align,
  image,
  accent,
  index,
}: LyricFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { activeLyricIndex, isPlaying, followLyrics } = useAudio();

  // Determine if this lyric is currently active in playback
  const isActive = isPlaying && activeLyricIndex === index;

  // Auto-scroll when active and follow lyrics is enabled
  useEffect(() => {
    if (isActive && followLyrics && frameRef.current) {
      frameRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive, followLyrics]);

  /* Parallax for background image */
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });

  const imageY = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), {
    stiffness: 60,
    damping: 25,
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.02, 1.08]);

  // Active / Inactive states classes and styles
  const borderClass = isActive
    ? accent === "gold"
      ? "border-amber-200/35"
      : "border-emerald-200/30"
    : "border-white/10";

  const glowStyle = isActive
    ? accent === "gold"
      ? "rgba(253, 230, 138, 0.05)" // Amber active inner glow
      : "rgba(167, 243, 208, 0.05)" // Sage active inner glow
    : "rgba(255, 255, 255, 0.005)";

  const cornerClass = isActive
    ? accent === "gold"
      ? "bg-amber-300/40"
      : "bg-emerald-300/40"
    : "bg-white/15";

  return (
    <div
      ref={frameRef}
      className="relative min-h-[85vh] flex items-center py-16 md:py-24 px-4 sm:px-6"
    >
      {/* Optional editorial vertical line on side */}
      {align !== "center" && (
        <div
          className={`hidden lg:block absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-40"
          } ${align === "left" ? "left-8" : "right-8"}`}
        />
      )}

      {/* Frame container */}
      <motion.div
        className={`relative w-full max-w-[720px] lg:max-w-[840px] ${alignmentClasses[align]}`}
        animate={{
          scale: isActive ? 1.02 : 1,
          y: isActive ? -5 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* The editorial frame card */}
        <div
          className={`relative overflow-hidden rounded-sm transition-all duration-700 ${borderClass} border bg-white/[0.035] backdrop-blur-xl`}
          style={{
            boxShadow: isActive
              ? `0 35px 90px rgba(0,0,0,0.55), inset 0 0 60px ${glowStyle}, 0 0 20px ${
                  accent === "gold" ? "rgba(253,230,138,0.06)" : "rgba(167,243,208,0.04)"
                }`
              : `0 20px 50px rgba(0,0,0,0.4), inset 0 0 45px ${glowStyle}`,
          }}
        >
          {/* Background image with parallax */}
          {image && (
            <motion.div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ y: imageY }}
            >
              <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className={`w-full h-full object-cover grayscale transition-opacity duration-1000 ${
                    isActive ? "opacity-[0.16]" : "opacity-[0.06]"
                  }`}
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-transparent to-zinc-950/70" />
            </motion.div>
          )}

          {/* Watermark Quote in background */}
          <div
            className={`absolute ${
              align === "right" ? "left-6 sm:left-10" : "right-6 sm:right-10"
            } top-10 font-serif text-[120px] sm:text-[150px] leading-none select-none pointer-events-none transition-opacity duration-1000 ${
              isActive ? "opacity-[0.06] text-zinc-100" : "opacity-[0.015] text-white"
            }`}
          >
            &ldquo;
          </div>

          {/* Corner decorative lines */}
          {/* Top-left corner */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <div className={`w-6 h-px transition-colors duration-700 ${cornerClass}`} />
            <div className={`w-px h-6 transition-colors duration-700 ${cornerClass}`} />
          </div>

          {/* Top-right corner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div className={`w-6 h-px ml-auto transition-colors duration-700 ${cornerClass}`} />
            <div className={`w-px h-6 ml-auto transition-colors duration-700 ${cornerClass}`} />
          </div>

          {/* Bottom-left corner */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            <div className={`w-px h-6 transition-colors duration-700 ${cornerClass}`} />
            <div className={`w-6 h-px transition-colors duration-700 ${cornerClass}`} />
          </div>

          {/* Bottom-right corner */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <div className={`w-px h-6 ml-auto transition-colors duration-700 ${cornerClass}`} />
            <div className={`w-6 h-px ml-auto transition-colors duration-700 ${cornerClass}`} />
          </div>

          {/* Content area */}
          <div className={`relative z-10 px-8 sm:px-14 md:px-20 py-16 sm:py-22 md:py-28 ${textAlignClasses[align]}`}>
            {/* Main lyric text */}
            <h2
              className="font-serif text-4xl sm:text-5xl md:text-7xl font-semibold leading-[0.95] tracking-tight mb-8 sm:mb-10 transition-colors duration-700 select-text"
              style={{
                backgroundImage: isActive
                  ? accent === "gold"
                    ? "linear-gradient(180deg, #ffffff 0%, #fef3c7 65%, #f59e0b 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, #ecfdf5 65%, #10b981 100%)"
                  : "linear-gradient(180deg, #a1a1aa 0%, #52525b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {lyric}
            </h2>

            {/* Thin divider */}
            <div
              className={`h-px w-12 sm:w-16 transition-colors duration-700 ${cornerClass} ${
                align === "right" ? "ml-auto" : align === "center" ? "mx-auto" : ""
              } mb-6 sm:mb-8`}
            />

            {/* Annotation text */}
            {annotation && (
              <p
                className={`font-sans text-sm md:text-base leading-relaxed max-w-[520px] transition-colors duration-700 ${
                  isActive ? "text-zinc-300" : "text-zinc-500"
                }`}
                style={{
                  marginLeft: align === "right" ? "auto" : align === "center" ? "auto" : undefined,
                  marginRight: align === "left" ? "auto" : align === "center" ? "auto" : undefined,
                }}
              >
                {annotation}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
