"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({
  onComplete,
  duration = 1500,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Small delay for exit animation before triggering callback
      setTimeout(onComplete, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-tactus-black"
        >
          {/* Subtle radial gradient backdrop */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_60%)]" />

          {/* Animated background pulse ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1.2 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute h-64 w-64 rounded-full border border-white/10"
          />

          {/* TACTUS Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-5xl font-black tracking-[0.25em] text-white sm:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TACTUS
          </motion.h1>

          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-10"
          >
            <div className="tactus-spinner" />
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em] text-white"
          >
            Redirecting…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
