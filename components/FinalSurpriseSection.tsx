"use client";

import { motion } from "framer-motion";

export default function FinalSurpriseSection() {
  return (
    <section
      id="final-surprise"
      className="relative min-h-[60vh] flex flex-col items-center justify-center py-20 px-6 z-10"
    >
      <motion.div
        className="max-w-3xl text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <h2 className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-600/50 leading-tight">
          Everything I couldn&apos;t say,
          <br />
          I hope you felt here.
        </h2>
        <motion.div 
          className="w-px h-24 bg-gradient-to-b from-amber-200/50 to-transparent mx-auto mt-12"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>
    </section>
  );
}
