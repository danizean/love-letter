"use client";

/**
 * FloatingAtmosphere
 * 
 * Renders soft radial gradient blobs and subtle floating particles
 * behind all page content. Creates the living, breathing dark atmosphere.
 * 
 * All elements are pointer-events-none so they don't block interaction.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingAtmosphere() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onMediaChange = () => setIsMobile(mediaQuery.matches);
    onMediaChange();
    mediaQuery.addEventListener("change", onMediaChange);
    return () => mediaQuery.removeEventListener("change", onMediaChange);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Primary gradient blob — warm amber, top-left area */}
      <div
        className={`absolute -top-1/4 -left-1/4 rounded-full opacity-[0.07] ${
          isMobile ? "w-[560px] h-[560px]" : "w-[800px] h-[800px]"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(253,230,138,0.4) 0%, transparent 70%)",
          animation: "float-slow 25s ease-in-out infinite",
        }}
      />

      {/* Secondary gradient blob — cool sage, bottom-right area */}
      <div
        className={`absolute -bottom-1/4 -right-1/4 rounded-full opacity-[0.05] ${
          isMobile ? "w-[420px] h-[420px]" : "w-[600px] h-[600px]"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(167,243,208,0.3) 0%, transparent 70%)",
          animation: "float-slower 30s ease-in-out infinite",
        }}
      />

      {/* Tertiary blob — subtle warm center glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
          isMobile ? "w-[360px] h-[360px]" : "w-[500px] h-[500px]"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(253,230,138,0.08) 0%, transparent 60%)",
          animation: "pulse-glow 15s ease-in-out infinite",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-amber-200/30"
          style={{
            left: `${8 + (i * 7.5) % 85}%`,
            bottom: `-${10 + (i * 5) % 20}px`,
            animation: `float-particle ${18 + (i * 3) % 12}s linear infinite`,
            animationDelay: `${(i * 2.5) % 15}s`,
          }}
        />
      ))}
    </div>
  );
}
