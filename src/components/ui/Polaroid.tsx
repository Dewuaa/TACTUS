"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PolaroidProps {
  src: string;
  caption: string;
  rotation?: number;
  className?: string;
  delay?: number;
}

export function Polaroid({ src, caption, rotation = 0, className = "", delay = 0 }: PolaroidProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotation - 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className={`relative inline-block bg-white p-3 pb-10 shadow-xl transition-shadow hover:shadow-2xl ${className}`}
      style={{ rotate: `${rotation}deg` }}
    >
      <div className="relative aspect-square w-64 overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} className="h-full w-full object-cover" />
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center font-serif text-lg text-gray-800">
        {caption}
      </div>
    </motion.div>
  );
}
