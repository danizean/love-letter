"use client";

import { motion } from "framer-motion";

export default function SongIntroSection() {
  return (
    <section
      id="song-intro"
      className="relative min-h-[70vh] flex flex-col items-center justify-center py-20 px-6 z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl text-center space-y-6"
      >
        <p className="font-serif text-2xl md:text-3xl text-zinc-300 leading-relaxed italic">
          &ldquo;Some letters are better felt than read. Let the music speak where my words might fail.&rdquo;
        </p>
        <div className="w-12 h-[1px] bg-white/20 mx-auto mt-8" />
      </motion.div>
    </section>
  );
}
