"use client";

/**
 * HeroSection — First Page of the Letter
 *
 * After the letter opening interaction, this feels like the
 * first page of the letter unfolding. Features:
 * - Floating letter page feel with centered glow
 * - Updated title with serif quote marks
 * - New intimate subtitle
 * - "scroll gently" prompt
 * - Thin editorial lines and paper texture
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], ["0vh", "-30vh"]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      aria-label="Opening letter"
    >
      {/* Centered radial glow — letter page atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(253,230,138,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Very subtle paper-like inner frame */}
      <div className="absolute inset-8 sm:inset-16 md:inset-24 border border-white/[0.03] rounded-sm pointer-events-none" />

      {/* Main content — fades/moves on scroll */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
        style={{ opacity, y }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
      >
        {/* Top thin editorial line */}
        <motion.div
          className="w-16 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent mx-auto mb-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />

        {/* Opening quote mark */}
        <motion.div
          className="font-serif text-4xl sm:text-5xl text-amber-200/[0.08] leading-none mb-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          aria-hidden="true"
        >
          &ldquo;
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-zinc-100 leading-[0.95] tracking-tight"
          initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        >
          A Letter For You
        </motion.h1>

        {/* Closing quote mark */}
        <motion.div
          className="font-serif text-4xl sm:text-5xl text-amber-200/[0.08] leading-none mt-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          aria-hidden="true"
        >
          &rdquo;
        </motion.div>

        {/* Subtle divider */}
        <motion.div
          className="w-8 h-px bg-amber-200/15 mx-auto my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />

        {/* Subtitle — intimate and poetic */}
        <motion.p
          className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
        >
          I wrote this not because words are enough,
          <br />
          but because some feelings deserve a place to stay.
        </motion.p>

        {/* Bottom editorial line */}
        <motion.div
          className="w-10 h-px bg-gradient-to-r from-transparent via-amber-200/15 to-transparent mx-auto mt-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
        />
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ opacity }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600 font-sans italic">
          scroll gently
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-600" strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
}
