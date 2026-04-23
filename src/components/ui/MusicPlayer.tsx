"use client";

import { motion } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";
import { useState } from "react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 1 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-neutral-900/80 backdrop-blur-xl border border-rose-500/20 p-3 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.15)] cursor-pointer hover:bg-neutral-800 transition-colors"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      <div className="bg-rose-500/20 p-2 rounded-full">
        {isPlaying ? (
          <Pause className="w-5 h-5 text-rose-400" />
        ) : (
          <Play className="w-5 h-5 text-rose-400 translate-x-[1px]" />
        )}
      </div>
      
      <div className="flex flex-col pr-4">
        <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider">
          Our Song
        </span>
        <div className="flex items-end gap-[2px] h-3 mt-1">
          {/* Equalizer bars */}
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-rose-400/80 rounded-t-sm"
              animate={
                isPlaying
                  ? { height: ["20%", "100%", "40%", "80%", "30%"] }
                  : { height: "20%" }
              }
              transition={{
                duration: 1 + i * 0.2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
