"use client";

/**
 * LyricScene — Cinematic Lyric Composition with Slider + Scroll Parallax
 *
 * Each lyric scene features:
 * - LyricImageSlider: multi-image horizontal swipeable slider
 * - Scroll-driven parallax: image and text move at different speeds
 * - Music-reactive active state (glow, scale, text brightness)
 * - Chorus surprise overlay
 * - Auto-scroll when "follow lyrics" is on
 * - Hidden note reveal on hover/tap
 */

import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useAudio } from "./AudioProvider";
import SpaceImageFrame from "./SpaceImageFrame";
import LoveParticles from "./LoveParticles";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

interface LyricSceneProps {
  lyric: string;
  annotation: string;
  hiddenNote: string;
  images: string[];
  layout: "image-left" | "image-right" | "image-top";
  index: number;
}

export default function LyricScene({
  lyric,
  annotation,
  hiddenNote,
  images,
  layout,
  index,
}: LyricSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { activeLyricIndex, isPlaying, followLyrics } = useAudio();
  const [mobileRevealed, setMobileRevealed] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const isActive = isPlaying && activeLyricIndex === index;
  const isChorus = lyric.toLowerCase().includes("risk it all");

  // ── Scroll-parallax setup ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const rawImageY = useTransform(scrollYProgress, [0, 1], [isCompact ? 40 : 70, isCompact ? -40 : -70]);
  const rawTextY = useTransform(scrollYProgress, [0, 1], [isCompact ? 22 : 35, isCompact ? -22 : -35]);
  const sceneProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 1 });

  const imageY = useSpring(rawImageY, { stiffness: 50, damping: 24, mass: 1 });
  const textY = useSpring(rawTextY, { stiffness: 50, damping: 24, mass: 1 });

  // ── Auto-scroll to active lyric ────────────────────────────────────────
  useEffect(() => {
    if (isActive && followLyrics && sceneRef.current) {
      sceneRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, followLyrics]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsCompact(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  // ── Grid alignment ─────────────────────────────────────────────────────
  const gridClasses = {
    "image-left": "md:grid-cols-[1.1fr_1fr] md:text-left",
    "image-right": "md:grid-cols-[1fr_1.1fr] md:text-right",
    "image-top": "grid-cols-1 text-center",
  };
  const imageOrderClass = layout === "image-right" ? "md:order-2" : "";
  const textOrderClass = layout === "image-right" ? "md:order-1" : "";

  return (
    <div
      ref={sceneRef}
      className={`relative min-h-[82vh] md:min-h-[90vh] flex items-center justify-center py-20 md:py-32 px-4 sm:px-6 md:px-12 transition-colors duration-1000 ${
        isActive
          ? isChorus
            ? "bg-amber-950/[0.04]"
            : "bg-white/[0.01]"
          : "bg-transparent"
      }`}
    >
      {/* Scene local progress rail */}
      {!isCompact && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[74%] max-w-md h-px bg-white/10 overflow-hidden rounded-full">
          <motion.div
            className={`h-full origin-left ${
              isActive ? "bg-amber-200/80" : "bg-zinc-500/30"
            }`}
            style={{ scaleX: sceneProgress }}
          />
        </div>
      )}

      {/* Decorative vertical timeline line */}
      {layout !== "image-top" && (
        <div
          className={`hidden lg:block absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent transition-opacity duration-1000 ${
            isActive ? "opacity-100" : "opacity-35"
          } ${layout === "image-left" ? "left-12" : "right-12"}`}
        />
      )}

      {/* Ambient glow under image when active */}
      <div
        className={`absolute w-[140%] h-[140%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-1000 -z-10 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: isActive
            ? isChorus
              ? "radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 60%)"
              : "radial-gradient(ellipse at center, rgba(253,230,138,0.05) 0%, transparent 60%)"
            : "none",
        }}
      />

      {/* Main composition */}
      <motion.div
        className={`w-full max-w-6xl mx-auto grid grid-cols-1 gap-10 md:gap-14 lg:gap-20 items-center ${gridClasses[layout]}`}
        animate={{ scale: isActive ? 1.012 : 1, y: isActive ? -4 : 0 }}
        transition={{ duration: 1.1, ease: SMOOTH_EASE }}
      >
        {/* ── IMAGE SLIDER BLOCK ── */}
        <motion.div
          className={`flex justify-center ${imageOrderClass}`}
          style={shouldReduceMotion ? undefined : { y: imageY }}
        >
          <SpaceImageFrame
            image={images[0]}
            isActive={isActive}
            isPlaying={isPlaying}
            index={index}
          />
        </motion.div>

        {/* ── TYPOGRAPHY BLOCK ── */}
        <motion.div
          className={`flex flex-col gap-6 justify-center ${textOrderClass} ${
            layout === "image-top" ? "max-w-3xl mx-auto" : ""
          }`}
          style={shouldReduceMotion ? undefined : { y: textY }}
          onClick={() => {
            if (isCompact) setMobileRevealed((p) => !p);
          }}
        >
          {/* Main lyric text */}
          <div className="relative group/lyric">
            <motion.h2
              className="flex flex-wrap font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium leading-none pb-2 tracking-tight transition-all duration-700 select-text"
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
              }}
            >
              {lyric.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="mr-3 sm:mr-4 md:mr-5 lg:mr-6 last:mr-0 inline-block"
                  style={{
                    backgroundImage: isActive
                      ? index % 2 === 0
                        ? "linear-gradient(180deg, #ffffff 0%, #fef3c7 60%, #e0a96d 100%)"
                        : "linear-gradient(180deg, #ffffff 0%, #d1fae5 60%, #6ee7b7 100%)"
                      : "linear-gradient(180deg, #a1a1aa 0%, #52525b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    willChange: "transform, opacity, filter",
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.9, ease: SMOOTH_EASE },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            {/* Hover underline */}
            <div
              className={`h-[1px] w-0 group-hover/lyric:w-full bg-gradient-to-r ${
                index % 2 === 0 ? "from-amber-200/40" : "from-emerald-200/35"
              } to-transparent transition-all duration-700 mt-2`}
            />
          </div>

          {/* Annotation */}
          <motion.p
            className={`font-sans text-sm sm:text-base leading-relaxed max-w-[420px] transition-colors duration-700 ${
              isActive ? "text-zinc-300" : "text-zinc-500"
            } ${
              layout === "image-top"
                ? "mx-auto"
                : layout === "image-right"
                ? "ml-auto"
                : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: SMOOTH_EASE, delay: 0.15 }}
          >
            {annotation}
          </motion.p>

          {isCompact && (
            <p className="md:hidden text-[10px] tracking-[0.2em] uppercase text-zinc-600">
              {mobileRevealed ? "tap again to hide note" : "tap lyric to reveal hidden note"}
            </p>
          )}

          {/* Hidden note reveal */}
          <AnimatePresence>
            {(isActive || mobileRevealed) && (
              <motion.div
                className={`${
                  layout === "image-top"
                    ? "mx-auto"
                    : layout === "image-right"
                    ? "ml-auto"
                    : ""
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.7, ease: SMOOTH_EASE }}
              >
                <div
                  className="inline-flex items-start gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm max-w-[320px]"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                >
                  <span className="w-px h-full min-h-[16px] bg-amber-200/30 mt-0.5 flex-shrink-0" />
                  <p className="font-serif text-xs sm:text-sm text-amber-100/70 italic leading-relaxed">
                    &ldquo;{hiddenNote}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chorus live badge */}
          <AnimatePresence>
            {isActive && isChorus && (
              <motion.div
                className={`pt-1 ${
                  layout === "image-top"
                    ? "mx-auto"
                    : layout === "image-right"
                    ? "ml-auto"
                    : ""
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200/20 bg-amber-200/[0.03] backdrop-blur-sm"
                  style={{ boxShadow: "0 0 15px rgba(253,230,138,0.06)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  <span className="font-serif text-xs text-amber-200/80 italic tracking-wide">
                    this is the part I wanted you to feel.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Inject LoveParticles during chorus peak for emotional impact */}
      <AnimatePresence>
        {isActive && isChorus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <LoveParticles variant="float" trigger={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
