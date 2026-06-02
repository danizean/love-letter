"use client";

/**
 * SectionLabel
 * 
 * A small editorial label used throughout the page.
 * Example: "01 / Promise", "02 / Distance"
 * Inter font, uppercase, letter-spaced, muted zinc-500 color.
 * Fades in when entering the viewport.
 */

import { motion } from "framer-motion";

interface SectionLabelProps {
  /** The label text, e.g. "01 / Promise" */
  label: string;
  /** Optional additional class names */
  className?: string;
}

export default function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <motion.span
      className={`inline-block font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-500 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {label}
    </motion.span>
  );
}
