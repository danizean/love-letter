"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { SONG_CONFIG, useAudio } from "./AudioProvider";

interface OpeningQuestionProps {
  onSelect: (wantsMusic: boolean) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function OpeningQuestion({ onSelect }: OpeningQuestionProps) {
  const { isPlaying, currentTime, duration, togglePlay, seek, setWantsMusic, isAudioError } =
    useAudio();
  const [isVisible, setIsVisible] = useState(true);
  const [coverMissing, setCoverMissing] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const activePointerIdRef = useRef<number | null>(null);

  const safeDuration = duration > 0 ? duration : 244;
  const progress = Math.max(0, Math.min(100, (currentTime / safeDuration) * 100));

  const seekFromX = useCallback(
    (clientX: number, element: HTMLDivElement) => {
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percent = x / rect.width;
      seek(percent * safeDuration);
    },
    [seek, safeDuration]
  );

  const skipRelative = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(safeDuration, currentTime + delta));
      seek(next);
    },
    [currentTime, safeDuration, seek]
  );

  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAndProceed = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    // Start music immediately to unlock audio context in the same synchronous click event
    if (!isPlaying) {
      togglePlay();
    }
    setWantsMusic(true);

    // Allow a tiny delay for audio buffer to start before triggering heavy unmount animations
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onSelect(true), 420);
    }, 200);
  }, [isPlaying, togglePlay, setWantsMusic, onSelect, isLoading]);

  // Handle keyboard shortcuts (space to play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayAndProceed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayAndProceed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          className="fixed inset-0 z-[120] overflow-y-auto overflow-x-hidden scroll-smooth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Custom Background Image from public/images */}
          <div className="fixed inset-0 pointer-events-none -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/moonlight.jpg" 
              alt="Background Halaman Awal" 
              className="w-full h-full object-cover opacity-50 mix-blend-screen"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Subtle vignette over the CinematicSky so the UI is readable */}
          <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.6)_100%)] -z-10" />

          {/* Main Container - Responsive Grid */}
          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col items-center justify-center px-6 py-12 md:flex-row md:justify-between md:gap-16 lg:gap-24 md:px-16 lg:px-24">
            
            {/* Left side: Space-Themed Album Art */}
            <div className="flex w-full max-w-[340px] md:max-w-[440px] flex-col items-center justify-center pt-8 md:pt-0">
              <div className="relative w-full aspect-square group">
                
                {/* Space Decoration: Outer glowing ring */}
                <motion.div
                  className="absolute pointer-events-none gpu"
                  style={{
                    inset: "-40px",
                    background: isPlaying
                      ? "radial-gradient(circle at center, rgba(253,230,138,0.08) 0%, transparent 60%)"
                      : "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 60%)",
                  }}
                  animate={{ opacity: isPlaying ? 1 : 0.5 }}
                  transition={{ duration: 2 }}
                />

                {/* Space Decoration: Rotating orbital ring */}
                <motion.div
                  className="absolute inset-[-12px] md:inset-[-20px] rounded-full border border-dashed border-white/10 pointer-events-none"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-200/50 shadow-[0_0_8px_rgba(253,230,138,0.8)]" />
                  <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/30" />
                </motion.div>

                {/* Cover Image */}
                <div className="relative w-full h-full overflow-hidden rounded-full shadow-[0_32px_64px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  {!coverMissing ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={SONG_CONFIG.albumArt}
                      alt={`${SONG_CONFIG.title} cover`}
                      className={`h-full w-full object-cover transition-transform duration-[20s] ease-linear ${isPlaying ? "scale-110" : "scale-100"}`}
                      onError={() => setCoverMissing(true)}
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#18181b_0%,#09090b_100%)] flex items-center justify-center">
                      <span className="text-white/10 text-6xl">♥</span>
                    </div>
                  )}
                  {/* Glossy sphere overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />
                  <div className="absolute inset-0 rounded-full ring-inset ring-2 ring-white/[0.05] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right side: Player Controls & Typography */}
            <div className="flex w-full max-w-md flex-col items-center md:items-start text-center md:text-left mt-12 md:mt-0">
              
              <div className="inline-flex items-center gap-2 mb-6 md:mb-8 border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-amber-300 animate-pulse shadow-[0_0_6px_rgba(253,230,138,0.8)]" : "bg-zinc-500"}`} />
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-zinc-300">
                  Audio Experience
                </p>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-white drop-shadow-md">
                  {SONG_CONFIG.title}
                </h1>
                <p className="mt-2 text-base md:text-lg text-zinc-300/80 font-sans tracking-wide">
                  {SONG_CONFIG.artist}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-10 w-full space-y-3">
                <div
                  className="relative h-2 w-full cursor-pointer rounded-full bg-white/10 backdrop-blur-sm"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    activePointerIdRef.current = e.pointerId;
                    setIsScrubbing(true);
                    seekFromX(e.clientX, e.currentTarget);
                  }}
                  onPointerMove={(e) => {
                    if (!isScrubbing || activePointerIdRef.current !== e.pointerId) return;
                    seekFromX(e.clientX, e.currentTarget);
                  }}
                  onPointerUp={(e) => {
                    if (activePointerIdRef.current !== e.pointerId) return;
                    activePointerIdRef.current = null;
                    setIsScrubbing(false);
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                  }}
                  onPointerCancel={(e) => {
                    if (activePointerIdRef.current !== e.pointerId) return;
                    activePointerIdRef.current = null;
                    setIsScrubbing(false);
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-100/80 to-amber-200"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(253,230,138,0.8)] transition-transform duration-200"
                    style={{ 
                      left: `calc(${progress}% - 8px)`,
                      transform: isScrubbing ? 'translateY(-50%) scale(1.4)' : 'translateY(-50%) scale(0)'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-zinc-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(safeDuration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 flex w-full items-center justify-center md:justify-start gap-8 lg:gap-12">
                <button
                  onClick={() => skipRelative(-10)}
                  aria-label="Back 10 seconds"
                  className="rounded-full p-3 text-zinc-400 transition-all hover:bg-white/10 hover:text-white active:scale-90"
                >
                  <SkipBack className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" />
                </button>

                <motion.button
                  onClick={handlePlayAndProceed}
                  disabled={isLoading}
                  whileTap={{ scale: 0.94 }}
                  aria-label="Play music and start journey"
                  className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 bg-white text-zinc-900 border border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group disabled:opacity-80 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-[3px] border-zinc-900/20 border-t-zinc-900 animate-spin" />
                  ) : (
                    <Play className="ml-1.5 h-8 w-8 md:h-10 md:w-10 group-hover:scale-110 transition-transform" fill="currentColor" />
                  )}
                </motion.button>

                <button
                  onClick={() => skipRelative(10)}
                  aria-label="Forward 10 seconds"
                  className="rounded-full p-3 text-zinc-400 transition-all hover:bg-white/10 hover:text-white active:scale-90"
                >
                  <SkipForward className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" />
                </button>
              </div>

              {/* Next Action removed per request - error message moved up */}
              {isAudioError && (
                <div className="mt-8 w-full">
                  <p className="text-center md:text-left text-xs text-red-300/80">
                    File audio belum ditemukan di `public/audio/risk-it-all.mp3`.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
