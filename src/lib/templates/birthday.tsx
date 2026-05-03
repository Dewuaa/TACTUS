"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

const COLORS = ["#FF3CAC","#FF6B35","#FFD600","#00E5FF","#76FF03","#FF1744","#E040FB","#FFAB40","#00BFA5","#FF6D00"];

type Piece = {
  id: number; left: number; drift: number; duration: number;
  delay: number; color: string; size: number;
  type: "rect" | "circle" | "diamond" | "ribbon" | "star";
};

function ConfettiPiece({ p }: { p: Piece }) {
  const style: React.CSSProperties = {
    position: "absolute", top: 0, left: `${p.left}%`,
    animationDuration: `${p.duration}s`,
    animationDelay: `-${p.delay}s`,
    ["--confetti-drift-x" as string]: `${p.drift}vw`,
    willChange: "transform, opacity",
  };

  if (p.type === "star") return (
    <div className="confetti-particle absolute top-0" style={style}>
      <svg width={p.size + 4} height={p.size + 4} viewBox="0 0 20 20"
        style={{ filter: `drop-shadow(0 0 ${p.size * 0.5}px ${p.color})` }}>
        <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7" fill={p.color} />
      </svg>
    </div>
  );

  if (p.type === "ribbon") return (
    <div className="confetti-particle absolute top-0" style={{
      ...style, width: `${p.size * 0.35}px`, height: `${p.size * 3}px`,
      backgroundColor: p.color, borderRadius: "1px",
      boxShadow: `0 0 8px ${p.color}99`,
    }} />
  );

  if (p.type === "circle") return (
    <div className="confetti-particle absolute top-0" style={{
      ...style, width: `${p.size}px`, height: `${p.size}px`,
      backgroundColor: p.color, borderRadius: "50%",
      boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`,
    }} />
  );

  if (p.type === "diamond") return (
    <div className="confetti-particle absolute top-0" style={{
      ...style, width: `${p.size}px`, height: `${p.size}px`,
      backgroundColor: p.color, transform: "rotate(45deg)",
      boxShadow: `0 0 10px ${p.color}88`,
    }} />
  );

  return (
    <div className="confetti-particle absolute top-0" style={{
      ...style, width: `${p.size * 2}px`, height: `${p.size * 0.65}px`,
      backgroundColor: p.color, borderRadius: "1px",
    }} />
  );
}

function BirthdayAmbient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Animated aurora blobs
  const blobs = useMemo(() => [
    { color: "#FF3CAC", x: 20, y: 15, size: 55, dur: 8, delay: 0 },
    { color: "#FFD600", x: 75, y: 10, size: 50, dur: 10, delay: 1.5 },
    { color: "#00E5FF", x: 10, y: 60, size: 45, dur: 7, delay: 0.8 },
    { color: "#76FF03", x: 80, y: 65, size: 40, dur: 9, delay: 2 },
    { color: "#FF6B35", x: 50, y: 40, size: 60, dur: 11, delay: 0.4 },
    { color: "#E040FB", x: 35, y: 80, size: 48, dur: 6, delay: 1.2 },
  ], []);

  const pieces = useMemo<Piece[]>(() =>
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      drift: (Math.random() - 0.5) * 55,
      duration: 4.5 + Math.random() * 7,
      delay: Math.random() * 12,
      color: COLORS[i % COLORS.length],
      size: 4 + Math.random() * 12,
      type: (["rect","circle","diamond","ribbon","star"] as const)[i % 5],
    })), []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Animated aurora blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: `${b.size}vw`, height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color}55 0%, ${b.color}22 40%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(20px)",
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 20, -10, 0],
            scale: [1, 1.3, 0.85, 1.15, 1],
            opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}

      {/* Bright central burst */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "100vw", height: "100vw",
          background: "radial-gradient(circle, rgba(255,214,0,0.15) 0%, rgba(255,60,172,0.08) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Horizontal neon scanlines */}
      {[12, 35, 58, 78].map((top, i) => (
        <motion.div key={`line-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent, ${COLORS[i * 2]}66, transparent)` }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* All confetti */}
      {pieces.map((p) => <ConfettiPiece key={p.id} p={p} />)}
    </div>
  );
}

// Slide overlay — sparse confetti on top of each photo
function BirthdaySlideOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pieces = useMemo<Piece[]>(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      drift: (Math.random() - 0.5) * 35,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 8,
      color: COLORS[i % COLORS.length],
      size: 3 + Math.random() * 7,
      type: (["rect","circle","diamond","ribbon","star"] as const)[i % 5],
    })), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Color tint wash that pulses subtly */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(255,60,172,0.08) 0%, rgba(255,214,0,0.06) 50%, rgba(0,229,255,0.05) 100%)" }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sparse confetti falling over the photo */}
      {pieces.map((p) => <ConfettiPiece key={p.id} p={p} />)}
      {/* Corner neon glows */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FF3CAC, transparent 70%)", filter: "blur(20px)" }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #FFD600, transparent 70%)", filter: "blur(25px)" }} />
    </div>
  );
}

export function BirthdayTemplate({ customer, images }: TemplateProps) {
  return (
    <Slideshow
      images={images.map((i) => ({ url: i.url, caption: i.caption }))}
      title={customer.recipient_name}
      message={customer.message}
      musicUrl={customer.music_url}
      introTag="Happy Birthday"
      signature="Made on TACTUS"
      ambient={<BirthdayAmbient />}
      theme={{
        accent: "#FFD600",
        background: "linear-gradient(145deg, #0a0018 0%, #1a0040 18%, #3d0068 35%, #720050 52%, #b83010 72%, #e86800 88%, #ff9500 100%)",
        slideOverlay: <BirthdaySlideOverlay />,
        titleClassName: [
          "font-black tracking-tight leading-[0.92] text-[clamp(3rem,11vw,5.5rem)]",
          "[font-family:var(--font-display)] text-white",
          "[text-shadow:0_0_60px_rgba(255,214,0,0.7),0_0_20px_rgba(255,100,0,0.5),0_3px_0_rgba(0,0,0,0.6)]",
        ].join(" "),
        messageClassName: "text-yellow-50/90 text-base leading-relaxed [font-family:var(--font-body)]",
        introTagClassName: "text-[#FFD600] [text-shadow:0_0_30px_#FFD600,0_0_60px_#FF6B3566]",
        captionClassName: [
          "text-white font-bold tracking-[0.2em] uppercase text-xs [font-family:var(--font-display)]",
          "[text-shadow:0_0_15px_rgba(255,214,0,0.6)]",
        ].join(" "),
      }}
    />
  );
}
