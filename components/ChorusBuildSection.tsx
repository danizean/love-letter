"use client";

import { motion } from "framer-motion";

export default function ChorusBuildSection() {
  return (
    <section
      id="chorus-build"
      className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 px-6 z-10"
    >
      <motion.div
        className="max-w-xl text-center space-y-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans text-sm tracking-[0.2em] text-amber-200/60 uppercase">
          and then,
        </p>
        <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-zinc-100 leading-tight">
          the song finally says it...
        </h3>
        <p className="font-sans text-base text-zinc-400 max-w-sm mx-auto leading-relaxed">
          what I&apos;ve been meaning to tell you all along.
        </p>
      </motion.div>
    </section>
  );
}
