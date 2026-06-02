"use client";

/**
 * Digital Love Letter — Main Page (Version 3)
 *
 * Flow:
 * 1. OpeningQuestion — Select playback preference (Silence vs Play softly)
 * 2. LetterOpening — Sealed envelope card, rotating 3D flap, sliding paper,
 *    surprising cinematic line "then read this slowly.", and autoplay triggers.
 * 3. Main Letter Experience (reveals once envelope is dismissed):
 *    - FloatingAtmosphere — Elegant background stars and gold light particles
 *    - ScrollProgress — Minimal top scroll tracker bar
 *    - HeroSection — Center editorial title/intro page of the letter
 *    - BeforeReffSection — Intimate pre-chorus text reveal card
 *    - LyricsSection — Sync 1:1 local photo and typography scenes, Pre-Reff scroll pause
 *    - ClosingSection — Interactive letter closing reveal paragraph
 *    - CurrentLyricOverlay — Floating glass text overlay above player
 *    - MusicPlayer — Sticky bottom player with local risk-it-all.mp3 controls
 */

import { useState } from "react";
import AudioProvider from "@/components/AudioProvider";
import OpeningQuestion from "@/components/OpeningQuestion";
import LetterOpening from "@/components/LetterOpening";
import CinematicSky from "@/components/CinematicSky";
import FloatingAtmosphere from "@/components/FloatingAtmosphere";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import SongIntroSection from "@/components/SongIntroSection";
import ChorusBuildSection from "@/components/ChorusBuildSection";
import LyricsSection from "@/components/LyricsSection";
import FinalSurpriseSection from "@/components/FinalSurpriseSection";
import ClosingSection from "@/components/ClosingSection";
import MusicPlayer from "@/components/MusicPlayer";
import { AnimatePresence, motion } from "framer-motion";

export type OpeningPhase = 
  | "question" 
  | "sealed" 
  | "seal-glow" 
  | "flap-opening" 
  | "note-rising" 
  | "note-ready" 
  | "note-opening" 
  | "note-opened" 
  | "complete";

export default function Home() {
  const [openingPhase, setOpeningPhase] = useState<OpeningPhase>("question");

  return (
    <AudioProvider>
      {/* Background stays visible during opening and letter */}
      <CinematicSky 
        isOpeningLetter={openingPhase !== "complete"} 
        isNoteOpen={openingPhase === "note-opening" || openingPhase === "note-opened"}
      />

      <AnimatePresence mode="wait">
        {/* Step 1: Intimate preference check screen */}
        {openingPhase === "question" && (
          <OpeningQuestion key="question" onSelect={() => setOpeningPhase("sealed")} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Step 2: The complex Letter Opening Interaction */}
        {openingPhase !== "question" && openingPhase !== "complete" && (
          <LetterOpening 
            key="letter-opening"
            phase={openingPhase} 
            setPhase={setOpeningPhase} 
          />
        )}
      </AnimatePresence>

      {/* Step 3: Reveal Main Digital Letter page once complete */}
      <AnimatePresence>
        {openingPhase === "complete" && (
            <motion.div 
              key="main-letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
            {/* Additional background atmosphere stars/lights */}
            <FloatingAtmosphere />

            {/* Top scroll progress bar */}
            <ScrollProgress />

            {/* Primary letter contents */}
            <main id="smooth-wrapper" className="relative z-10 pb-56 md:pb-44">
              <HeroSection />
              <SongIntroSection />
              <ChorusBuildSection />
              <LyricsSection />
              <FinalSurpriseSection />
              <ClosingSection />
            </main>

            {/* Main Audio Player */}
            <MusicPlayer />

          </motion.div>
        )}
      </AnimatePresence>
    </AudioProvider>
  );
}
