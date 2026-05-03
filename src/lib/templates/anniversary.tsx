"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

function AnniversaryAmbient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 12,
      size: 2 + Math.random() * 3,
    })), []);

  const blobs = useMemo(() => [
    { color: "#7c4a00", x: 20, y: 25, size: 70, dur: 11 },
    { color: "#4a2800", x: 75, y: 20, size: 55, dur: 9 },
    { color: "#9c6200", x: 50, y: 55, size: 60, dur: 13 },
    { color: "#3d1f00", x: 30, y: 80, size: 50, dur: 8 },
    { color: "#6b3800", x: 80, y: 70, size: 45, dur: 10 },
  ], []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Warm gold blobs */}
      {blobs.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: `${b.size}vw`, height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color}60 0%, ${b.color}25 50%, transparent 70%)`,
            transform: "translate(-50%, -50%)", filter: "blur(35px)",
          }}
          animate={{ scale: [1, 1.3, 0.85, 1.15, 1], opacity: [0.45, 0.75, 0.35, 0.65, 0.45], x: [0, 20, -12, 8, 0], y: [0, -15, 12, -6, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}

      {/* Central golden glow */}
      <motion.div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "100vw", height: "100vw", background: "radial-gradient(circle, rgba(200,140,0,0.18) 0%, rgba(120,70,0,0.1) 40%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ scale: [1, 1.15, 0.95, 1], opacity: [0.5, 0.8, 0.4, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating gold dust particles */}
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, bottom: "-5%", width: p.size, height: p.size, backgroundColor: "#FFD700", boxShadow: `0 0 ${p.size * 4}px rgba(255,215,0,0.6)` }}
          animate={{ y: [0, -(60 + Math.random() * 80) + "vh"], x: [0, (Math.random() - 0.5) * 8 + "vw"], opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeOut", delay: p.delay }}
        />
      ))}

      {/* Horizontal gold line accents */}
      {[20, 55, 80].map((top, i) => (
        <motion.div key={i} className="absolute left-0 right-0 h-px"
          style={{ top: `${top}%`, background: `linear-gradient(90deg, transparent 0%, rgba(200,140,0,0.15) 30%, rgba(255,200,0,0.25) 50%, rgba(200,140,0,0.15) 70%, transparent 100%)` }}
          animate={{ opacity: [0, 0.7, 0], scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 2.5 }}
        />
      ))}

      {/* Vignettes */}
      <div className="absolute top-0 left-0 right-0 h-[40vh]" style={{ background: "linear-gradient(to bottom, rgba(5,3,1,0.92) 0%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[50vh]" style={{ background: "linear-gradient(to top, rgba(5,3,1,0.95) 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 left-0 w-[15vw]" style={{ background: "linear-gradient(to right, rgba(5,3,1,0.75), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-[15vw]" style={{ background: "linear-gradient(to left, rgba(5,3,1,0.75), transparent)" }} />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}

function AnniversarySlideOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(80,50,0,0.3) 0%, rgba(40,20,0,0.15) 50%, rgba(100,65,0,0.25) 100%)", mixBlendMode: "multiply" }}
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(5,3,1,0.7) 100%)" }} />
      {/* Gold top shimmer */}
      <motion.div className="absolute top-0 left-0 right-0 h-[25vh] opacity-[0.08]"
        style={{ background: "linear-gradient(180deg, #FFD700 0%, transparent 100%)", filter: "blur(15px)" }}
        animate={{ opacity: [0.05, 0.12, 0.05] }} transition={{ duration: 7, repeat: Infinity }}
      />
    </div>
  );
}

export function AnniversaryTemplate({ customer, images }: TemplateProps) {
  return (
    <Slideshow
      images={images.map((i) => ({ url: i.url, caption: i.caption }))}
      title={customer.recipient_name}
      message={customer.message}
      musicUrl={customer.music_url}
      introTag="Happy Anniversary"
      signature="Forever — on TACTUS"
      ambient={<AnniversaryAmbient />}
      theme={{
        accent: "#D4A017",
        background: "linear-gradient(160deg, #050301 0%, #0e0800 15%, #1c1000 30%, #2a1800 48%, #3d2200 65%, #2a1800 82%, #0e0800 100%)",
        slideOverlay: <AnniversarySlideOverlay />,
        titleClassName: [
          "font-light italic tracking-wide leading-[1.05] text-[clamp(2.8rem,11vw,5rem)]",
          "[font-family:Georgia,'Times_New_Roman',serif] text-amber-50",
          "[text-shadow:0_2px_40px_rgba(212,160,23,0.6),0_0_80px_rgba(150,100,0,0.4)]",
        ].join(" "),
        messageClassName: [
          "text-amber-100/80 text-base leading-[1.9] italic",
          "[font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_1px_16px_rgba(0,0,0,0.7)]",
        ].join(" "),
        introTagClassName: [
          "text-amber-200/90 italic [font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_0_25px_rgba(212,160,23,0.7)]",
        ].join(" "),
        captionClassName: [
          "text-amber-100/90 italic text-sm tracking-wide",
          "[font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_1px_10px_rgba(0,0,0,0.8)]",
        ].join(" "),
      }}
    />
  );
}
