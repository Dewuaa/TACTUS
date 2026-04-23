"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: { id: number; dx: number; dy: number }[];
}

export function TapBurst({ colorHex }: { colorHex: string }) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newBurst: Burst = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        particles: Array.from({ length: 6 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 6;
          return {
            id: i,
            dx: Math.cos(angle) * 30, // 30px spread
            dy: Math.sin(angle) * 30,
          };
        }),
      };
      setBursts((prev) => [...prev, newBurst]);

      // Remove after animation completes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <AnimatePresence>
        {bursts.map((burst) =>
          burst.particles.map((particle) => (
            <motion.div
              key={`${burst.id}-${particle.id}`}
              initial={{ opacity: 1, scale: 0, x: burst.x, y: burst.y }}
              animate={{
                opacity: 0,
                scale: 1,
                x: burst.x + particle.dx,
                y: burst.y + particle.dy,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ color: colorHex }}
            >
              <Sparkles className="w-3 h-3" style={{ color: colorHex }} />
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
