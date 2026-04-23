"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FallingPetals({ colorHex }: { colorHex: string }) {
  const [petals, setPetals] = useState<{ id: number; left: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate petals on mount to avoid hydration mismatch
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 15 : 30;
    const newPetals = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10, // 10 to 20s
      delay: Math.random() * 10,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 w-3 h-3 rounded-tl-full rounded-br-full"
          style={{ left: `${p.left}%`, y: "-20px", backgroundColor: colorHex }}
          animate={{
            y: ["0vh", "110vh"],
            x: ["0px", "50px", "-50px", "0px"],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            x: { duration: p.duration * 0.4, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            rotate: { duration: p.duration * 0.2, repeat: Infinity, ease: "linear" },
          }}
        />
      ))}
    </div>
  );
}
