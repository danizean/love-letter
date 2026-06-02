"use client";

/**
 * LyricImageSlider — Premium draggable horizontal image carousel
 *
 * Features:
 * - Framer Motion drag (mouse + touch swipe)
 * - Smooth snap between slides
 * - Desktop mouse-parallax inside each image
 * - Auto-slide when music is playing (pauses on drag)
 * - Navigation dots + prev/next buttons
 * - Graceful 404 fallback per image
 * - Active image glow + scale, neighbours muted
 * - Mobile-first, no horizontal page overflow
 */

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type PointerEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 6000;

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

interface SlideProps {
  src: string;
  alt: string;
  isActive: boolean;
}

function Slide({ src, alt, isActive }: SlideProps) {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse-parallax motion values (desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 30 });
  const imgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const imgY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
      mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
    },
    [isActive, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-3xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!hasError ? (
        <motion.img
          src={src}
          alt={alt}
          draggable={false}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{
            x: imgX,
            y: imgY,
            scale: isActive ? 1.08 : 1.04,
          }}
          transition={{ scale: { duration: 0.8, ease: SMOOTH_EASE } }}
        />
      ) : (
        /* Graceful fallback — dark gradient, no broken icon */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)",
          }}
        >
          <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-white/[0.06]" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/[0.06]" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-white/[0.06]" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-white/[0.06]" />
          <span className="font-serif text-zinc-600 text-xs italic tracking-wide">
            lyric memory
          </span>
        </div>
      )}

      {/* Dark overlay — lightens when active */}
      <div
        className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${
          isActive ? "opacity-30" : "opacity-60"
        }`}
        style={{ background: "rgba(9,9,11,0.6)" }}
      />

      {/* Active moonlight ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            boxShadow:
              "inset 0 0 40px rgba(253,230,138,0.04), 0 0 60px rgba(253,230,138,0.06)",
          }}
        />
      )}
    </div>
  );
}

interface LyricImageSliderProps {
  images: string[];
  isActive: boolean;
  isPlaying: boolean;
}

export default function LyricImageSlider({
  images,
  isActive,
  isPlaying,
}: LyricImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const dragX = useMotionValue(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = images.length;

  const paginate = useCallback(
    (dir: number) => {
      setIndex((prev) => (prev + dir + total) % total);
    },
    [total]
  );

  // Auto-slide when playing, pauses after user interaction
  useEffect(() => {
    if (!isPlaying || isDragging || total <= 1 || userInteracted) return;
    const timer = setInterval(() => paginate(1), 6500);
    return () => clearInterval(timer);
  }, [isPlaying, isDragging, total, userInteracted, paginate]);

  // Resume auto-slide 8 seconds after user manually navigates
  const handleManualNav = useCallback(
    (dir: number) => {
      paginate(dir);
      setUserInteracted(true);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => setUserInteracted(false), 8000);
    },
    [paginate]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setIsDragging(false);
      const power = swipePower(info.offset.x, info.velocity.x);
      if (power < -SWIPE_THRESHOLD) handleManualNav(1);
      else if (power > SWIPE_THRESHOLD) handleManualNav(-1);
    },
    [handleManualNav]
  );

  // Prevent pointer events from bubbling and triggering vertical scroll
  const handlePointerDown = useCallback((_: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
  }, []);

  if (total === 0) return null;

  return (
    <div className="relative w-full select-none">
      {/* Main slider track */}
      <div className="relative overflow-hidden">
        {/* Frame */}
        <motion.div
          className={`relative mx-auto aspect-square overflow-hidden rounded-3xl border gpu transition-all duration-700 cursor-grab active:cursor-grabbing ${
            isActive
              ? "border-white/20 shadow-[0_30px_120px_rgba(253,230,138,0.10)]"
              : "border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
          }`}
          style={{
            width: "min(88vw, 460px)",
          }}
          whileTap={{ scale: 0.985 }}
          onPointerDown={handlePointerDown}
        >
          {/* Sliding track — one slide visible at a time */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ x: isDragging ? 0 : "60%", opacity: 0, filter: "blur(8px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ x: "-60%", opacity: 0, filter: "blur(8px)" }}
              transition={{
                duration: 0.65,
                ease: SMOOTH_EASE,
              }}
              drag={total > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
            >
              <Slide
                src={images[index]}
                alt={`Lyric image ${index + 1}`}
                isActive={isActive}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev button */}
          {total > 1 && (
            <button
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-amber-200/30 transition-all duration-300 hover:shadow-[0_0_12px_rgba(253,230,138,0.1)]"
              onClick={(e) => {
                e.stopPropagation();
                handleManualNav(-1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}

          {/* Next button */}
          {total > 1 && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-amber-200/30 transition-all duration-300 hover:shadow-[0_0_12px_rgba(253,230,138,0.1)]"
              onClick={(e) => {
                e.stopPropagation();
                handleManualNav(1);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </motion.div>

        {/* Subtle image reflection */}
        <div
          className="pointer-events-none mx-auto mt-px rounded-b-3xl opacity-30"
          style={{
            width: "min(88vw, 460px)",
            height: "30px",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>

      {/* Dots + caption row */}
      {total > 1 && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <motion.button
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === index
                    ? "bg-amber-200/60 w-4 h-1.5"
                    : "bg-zinc-700 w-1.5 h-1.5 hover:bg-zinc-500"
                }`}
                onClick={() => {
                  handleManualNav(i - index);
                }}
                aria-label={`Go to image ${i + 1}`}
                layout
                transition={{ layout: { duration: 0.3, ease: SMOOTH_EASE } }}
              />
            ))}
          </div>
          <span className="text-[9px] uppercase tracking-[0.35em] text-zinc-600 font-sans">
            {isDragging ? "drag the memory" : "swipe softly"}
          </span>
        </div>
      )}
    </div>
  );
}
