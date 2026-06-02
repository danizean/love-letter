"use client";

import { useEffect, useRef, useState } from "react";
import CinematicMoon from "./CinematicMoon";
import StarField from "./StarField";
import ShootingStars from "./ShootingStars";
import SpaceParallaxLayer from "./SpaceParallaxLayer";
import { timedLyrics, useAudio } from "./AudioProvider";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

interface CinematicSkyProps {
  isOpeningLetter?: boolean;
  isNoteOpen?: boolean;
}

export default function CinematicSky({ isOpeningLetter = false, isNoteOpen = false }: CinematicSkyProps) {
  const { isPlaying, activeLyricIndex } = useAudio();
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Smoothing for cloud layer
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 15,
    damping: 30,
    mass: 1.2,
  });

  const cloudY = useTransform(smoothProgress, [0, 1], ["0vh", "40vh"]);
  const cloudX = useTransform(smoothProgress, [0, 1], ["0vw", "-25vw"]);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const pointerShiftX = useSpring(useTransform(pointerX, [0, 100], [-18, 18]), {
    stiffness: 10,
    damping: 40,
    mass: 1.5,
  });
  const pointerShiftY = useSpring(useTransform(pointerY, [0, 100], [-14, 14]), {
    stiffness: 10,
    damping: 40,
    mass: 1.5,
  });

  const spotlightX = useTransform(pointerX, [0, 100], ["0vw", "100vw"]);
  const spotlightY = useTransform(pointerY, [0, 100], ["0vh", "100vh"]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onMediaChange = () => setIsMobile(mediaQuery.matches);
    onMediaChange();
    mediaQuery.addEventListener("change", onMediaChange);

    let pendingX = 50;
    let pendingY = 50;
    const commitPointer = () => {
      pointerX.set(pendingX);
      pointerY.set(pendingY);
      rafRef.current = null;
    };

    const schedulePointer = (x: number, y: number) => {
      pendingX = x;
      pendingY = y;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(commitPointer);
    };

    const onMouseMove = (event: MouseEvent) => {
      schedulePointer(
        (event.clientX / window.innerWidth) * 100,
        (event.clientY / window.innerHeight) * 100
      );
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      schedulePointer(
        (touch.clientX / window.innerWidth) * 100,
        (touch.clientY / window.innerHeight) * 100
      );
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      mediaQuery.removeEventListener("change", onMediaChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [pointerX, pointerY, shouldReduceMotion]);

  const activeLyric = activeLyricIndex >= 0 ? timedLyrics[activeLyricIndex]?.lyric : "";
  const isChorusActive =
    isPlaying &&
    (activeLyric.toLowerCase().includes("risk it all") ||
      activeLyric.toLowerCase().includes("say you want the moon"));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-950 transition-colors duration-[3000ms]">
      {/* Background Ambient Glow responding to music and opening state */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[3000ms] ${
          isNoteOpen 
            ? "opacity-50 bg-[radial-gradient(ellipse_at_center,rgba(253,230,138,0.06)_0%,transparent_80%)]"
            : isOpeningLetter
            ? "opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_80%)]"
            : isPlaying 
              ? isChorusActive 
                ? "opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.06)_0%,transparent_80%)]"
                : "opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)]"
              : "opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)]"
        }`} 
      />

      {/* Pointer/touch responsive spotlight for stronger depth on mobile and desktop */}
      {!shouldReduceMotion && !isMobile && (
        <motion.div
          className="absolute rounded-full pointer-events-none mix-blend-screen gpu"
          style={{
            width: "80vw",
            height: "80vh",
            left: "-40vw",
            top: "-40vh",
            x: spotlightX,
            y: spotlightY,
            background: "radial-gradient(ellipse at center, rgba(253,230,138,0.08) 0%, transparent 60%)",
            opacity: isOpeningLetter ? 0.35 : isPlaying ? 0.6 : 0.25,
            transition: "opacity 0.7s ease-in-out",
          }}
        />
      )}

      {/* Far Background: Stars */}
      <StarField />

      {/* Deep Space Parallax Layers (star clusters, nebula, astronaut, particles) */}
      {!isOpeningLetter && <SpaceParallaxLayer isPlaying={isPlaying} isLowPerf={isMobile} />}
      
      {/* Rare Shooting Stars */}
      {!isMobile && <ShootingStars />}

      {/* Mid Background: Cloud Mist Layer */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: cloudY, x: cloudX }}
      >
        <motion.div style={shouldReduceMotion || isMobile ? undefined : { x: pointerShiftX, y: pointerShiftY }} className="gpu">
          <div className="absolute top-[20%] left-[40%] w-[600px] h-[600px] rounded-full transform -translate-y-1/2" style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 60%)" }} />
          <div className="absolute top-[60%] left-[10%] w-[800px] h-[800px] rounded-full transform -translate-y-1/2" style={{ background: "radial-gradient(ellipse, rgba(253,230,138,0.015) 0%, transparent 65%)" }} />
        </motion.div>
      </motion.div>

      {/* Mid Background: Parallax Moon */}
      <CinematicMoon />

      {/* Foreground subtle grain/noise if needed - omitted for performance but could be added as a CSS filter */}
    </div>
  );
}
