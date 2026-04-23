"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Hash, Sparkles } from "lucide-react";

interface TrailItem {
  id: number;
  x: number;
  y: number;
}

export function CursorTrail({ type, color }: { type: string; color: string }) {
  const [trail, setTrail] = useState<TrailItem[]>([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setTrail((prev) => [...prev, newPoint].slice(-15)); // Keep last 15 points
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: point.x, top: point.y, color: color }}
            onAnimationComplete={() => {
              setTrail((prev) => prev.filter((p) => p.id !== point.id));
            }}
          >
            {type === "matrix" ? (
              <Hash className="w-4 h-4" style={{ color }} />
            ) : type === "stars" ? (
              <Sparkles className="w-4 h-4" style={{ fill: color, color }} />
            ) : (
              <Heart className="w-4 h-4" style={{ fill: color, color }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
