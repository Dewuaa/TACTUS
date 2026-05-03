"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

const CAP_COLOR = "#1a1a2e";
const COLORS = ["#1a3a6e", "#0d5c8a", "#1a6e3a", "#2d4a8a", "#8a7a00", "#ffffff"];

type Square = {
  id: number; x: number; duration: number; delay: number;
  size: number; color: string; rotate: number;
};

function SquarePiece({ s }: { s: Square }) {
  return (
    <div className="confetti-particle absolute top-0"
      style={{
        left: `${s.x}%`,
        width: s.size, height: s.size,
        backgroundColor: s.color,
        transform: `rotate(${s.rotate}deg)`,
        animationDuration: `${s.duration}s`,
        animationDelay: `-${s.delay}s`,
        ["--confetti-drift-x" as string]: `${(Math.random() - 0.5) * 30}vw`,
        opacity: 0.7,
        borderRadius: 2,
      } as React.CSSProperties}
    />
  );
}

function GraduationAmbient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const squares = useMemo<Square[]>(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 5 + Math.random() * 6,
      delay: Math.random() * 10,
      size: 5 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
    })), []);

  const blobs = useMemo(() => [
    { color: "#0a1628", x: 20, y: 20, size: 70, dur: 10 },
    { color: "#0d3b5e", x: 75, y: 15, size: 55, dur: 8 },
    { color: "#0a2818", x: 15, y: 70, size: 60, dur: 12 },
    { color: "#1a2a5e", x: 80, y: 65, size: 50, dur: 9 },
    { color: "#2a1f00", x: 50, y: 45, size: 65, dur: 11 },
  ], []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Deep academic blobs */}
      {blobs.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: `${b.size}vw`, height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color}80 0%, ${b.color}30 50%, transparent 70%)`,
            transform: "translate(-50%, -50%)", filter: "blur(30px)",
          }}
          animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.6, 0.9, 0.5, 0.8, 0.6], x: [0, 20, -15, 10, 0], y: [0, -20, 15, -8, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* Gold shimmer center */}
      <motion.div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "90vw", height: "90vw", background: "radial-gradient(circle, rgba(180,140,0,0.12) 0%, rgba(100,80,0,0.06) 40%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Falling mortarboard squares */}
      {squares.map((s) => <SquarePiece key={s.id} s={s} />)}

      {/* Horizontal gold accent lines */}
      {[25, 60].map((top, i) => (
        <motion.div key={i} className="absolute left-0 right-0 h-px"
          style={{ top: `${top}%`, background: "linear-gradient(90deg, transparent, rgba(200,160,0,0.2), transparent)" }}
          animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 4 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 3 }}
        />
      ))}

      {/* Vignettes */}
      <div className="absolute top-0 left-0 right-0 h-[40vh]" style={{ background: "linear-gradient(to bottom, rgba(2,4,12,0.92) 0%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[50vh]" style={{ background: "linear-gradient(to top, rgba(2,4,12,0.95) 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 left-0 w-[15vw]" style={{ background: "linear-gradient(to right, rgba(2,4,12,0.75), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-[15vw]" style={{ background: "linear-gradient(to left, rgba(2,4,12,0.75), transparent)" }} />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}

function GraduationSlideOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(10,20,60,0.3) 0%, rgba(5,15,30,0.15) 50%, rgba(15,40,20,0.25) 100%)", mixBlendMode: "multiply" }}
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,4,12,0.75) 100%)" }} />
      <motion.div className="absolute top-0 left-0 right-0 h-[20vh] opacity-[0.07]"
        style={{ background: "linear-gradient(180deg, rgba(200,160,0,1) 0%, transparent 100%)", filter: "blur(15px)" }}
        animate={{ opacity: [0.04, 0.1, 0.04] }} transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}

void CAP_COLOR;

export function GraduationTemplate({ customer, images }: TemplateProps) {
  return (
    <Slideshow
      images={images.map((i) => ({ url: i.url, caption: i.caption }))}
      title={customer.recipient_name}
      message={customer.message}
      musicUrl={customer.music_url}
      introTag="Congratulations"
      signature="Proud of you — on TACTUS"
      ambient={<GraduationAmbient />}
      theme={{
        accent: "#C8A000",
        background: "linear-gradient(160deg, #02040c 0%, #060d1a 15%, #0a1628 30%, #0d1f3c 48%, #0a1e2e 65%, #061020 82%, #02040c 100%)",
        slideOverlay: <GraduationSlideOverlay />,
        titleClassName: [
          "font-black tracking-tight leading-[0.95] text-[clamp(2.8rem,11vw,5rem)]",
          "[font-family:var(--font-display)] text-white",
          "[text-shadow:0_0_60px_rgba(200,160,0,0.7),0_0_20px_rgba(200,160,0,0.4),0_3px_0_rgba(0,0,0,0.7)]",
        ].join(" "),
        messageClassName: "text-blue-50/80 text-base leading-relaxed [font-family:var(--font-body)]",
        introTagClassName: "text-amber-300/90 tracking-[0.5em] [text-shadow:0_0_25px_rgba(200,160,0,0.8)]",
        captionClassName: [
          "text-amber-200/90 font-bold tracking-[0.15em] uppercase text-sm",
          "[font-family:var(--font-display)]",
          "[text-shadow:0_0_20px_rgba(200,160,0,0.5)]",
        ].join(" "),
      }}
    />
  );
}
