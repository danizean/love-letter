"use client";

/**
 * ClientLetterOrchestrator
 * Manages the state and layout of the cinematic letter experience.
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

export default function ClientLetterOrchestrator() {
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
