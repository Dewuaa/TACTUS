"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState } from "react";

export function GiftBox({ onOpen }: { onOpen: () => void }) {
  const [taps, setTaps] = useState(0);
  const [opened, setOpened] = useState(false);

  const handleTap = () => {
    if (opened) return;
    if (taps < 3) {
      setTaps(taps + 1);
    } else {
      setOpened(true);
      setTimeout(onOpen, 800); // Wait for explosion animation to finish
    }
  };

  if (opened) {
    return (
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pointer-events-none absolute z-20 flex flex-col items-center justify-center"
      >
        <Gift className="w-24 h-24 text-rose-400" />
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={handleTap}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        taps > 0
          ? {
              x: [-5, 5, -5, 5, 0],
              rotate: [-5, 5, -5, 5, 0],
            }
          : {}
      }
      transition={{ duration: 0.3 }}
      className="cursor-pointer flex flex-col items-center justify-center gap-4 z-20"
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full group-hover:bg-rose-500/40 transition-all duration-300" />
        <div className="relative bg-neutral-900/80 border border-rose-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
          <Gift className="w-16 h-16 text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
        </div>
      </div>
      <p className="text-rose-200/80 font-light tracking-wider animate-pulse">
        {taps === 0 ? "Tap to open your gift" : taps < 3 ? "Keep tapping!" : "Opening..."}
      </p>
    </motion.div>
  );
}
