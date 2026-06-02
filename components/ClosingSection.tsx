"use client";

/**
 * ClosingSection — Interactive Final Letter Paragraph
 *
 * The emotional last page of the letter.
 * Features:
 * - Initially hidden behind an elegant "Keep reading" glass button
 * - Upon click, the button fades out and reveals the poetic sign-off stagger-fading in line by line
 * - A soft, intimate golden glow expands behind the final signature
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionLabel from "./SectionLabel";

export default function ClosingSection() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section
      id="closing"
      className="relative py-36 md:py-52 px-6 overflow-hidden"
      aria-label="Closing message"
    >
      {/* Top border — page break feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-amber-200/15 to-transparent" />

      {/* Background glow when revealed */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            style={{
              background:
                "radial-gradient(circle 35vw at 50% 55%, rgba(253,230,138,0.012) 0%, transparent 80%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <SectionLabel label="Always" className="block" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* ============================================
               KEEP READING BUTTON (State: Unrevealed)
               ============================================ */
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <motion.button
                onClick={() => setIsRevealed(true)}
                className="group relative px-10 py-3.5 rounded-full border border-amber-200/15 bg-white/[0.02] backdrop-blur-sm text-amber-200/80 hover:text-amber-100 hover:border-amber-200/35 hover:bg-white/[0.04] text-xs font-sans tracking-[0.25em] uppercase cursor-pointer transition-all duration-500"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Keep reading
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: "0 0 20px rgba(253,230,138,0.05)" }} />
              </motion.button>
            </motion.div>
          ) : (
            /* ============================================
               POETIC REVEAL MONOLOGUE (State: Revealed)
               ============================================ */
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-16"
            >
              {/* Verse 1 Staggered Reveal */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.25,
                    },
                  },
                }}
              >
                {[
                  "And if this letter ends here,",
                  "the feeling does not.",
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    className="font-serif text-2xl sm:text-3xl md:text-4xl text-zinc-200 leading-relaxed font-light"
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }}
                    transition={{
                      duration: 1.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>

              {/* Thin Golden Divider */}
              <motion.div
                className="w-10 h-px bg-amber-200/20 mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.6 }}
              />

              {/* Verse 2 Staggered Reveal */}
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.8,
                    },
                  },
                }}
              >
                {[
                  "It stays quietly,",
                  "somewhere between the song,",
                  "the silence,",
                  "and you.",
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    className="font-sans text-zinc-400 text-base sm:text-lg leading-relaxed font-light"
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>

              {/* Final Handwritten Signature with Back Glow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, delay: 1.8, ease: "easeOut" }}
                className="relative pt-6 max-w-xs mx-auto"
              >
                {/* Expanding gold light behind the signature */}
                <div
                  className="absolute inset-x-0 top-0 -bottom-6 pointer-events-none opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle 80px at 50% 50%, rgba(253,230,138,0.05) 0%, transparent 100%)",
                  }}
                />
                <p className="font-serif text-zinc-500 text-lg sm:text-xl italic tracking-wide relative z-10 select-text">
                  &mdash; always, for you
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Vertical Bottom Line */}
        <motion.div
          className="mt-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-white/[0.06] to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
