"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

const STAR_COLORS = ["#FFD700", "#FFF176", "#FFFDE7", "#FFC107", "#FFECB3"];

function FriendshipAmbient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stars = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      color: STAR_COLORS[i % STAR_COLORS.length],
    })), []);

  const blobs = useMemo(() => [
    { color: "#6c3f9e", x: 15, y: 20, size: 65, dur: 10 },
    { color: "#3d2c8d", x: 80, y: 15, size: 55, dur: 8 },
    { color: "#1a1a6e", x: 50, y: 60, size: 70, dur: 12 },
    { color: "#7b2fbe", x: 25, y: 75, size: 45, dur: 9 },
    { color: "#ff6b9d", x: 75, y: 80, size: 40, dur: 11 },
  ], []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {/* Deep galaxy blobs */}
      {blobs.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: `${b.size}vw`, height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color}55 0%, ${b.color}20 50%, transparent 70%)`,
            transform: "translate(-50%, -50%)", filter: "blur(30px)",
          }}
          animate={{ scale: [1, 1.25, 0.9, 1.1, 1], opacity: [0.5, 0.8, 0.4, 0.7, 0.5], x: [0, 25, -15, 10, 0], y: [0, -20, 15, -8, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* Twinkling stars */}
      {stars.map((s) => (
        <motion.div key={s.id} className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 ${s.size * 3}px ${s.color}` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
      ))}

      {/* Shooting star */}
      <motion.div className="absolute top-[15%] left-[-5%] h-[1px] w-32 rounded-full"
        style={{ background: "linear-gradient(90deg, transparent, #FFD700, transparent)", transformOrigin: "left center" }}
        animate={{ x: ["0vw", "120vw"], y: [0, "20vh"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 7, ease: "easeIn" }}
      />

      {/* Vignettes */}
      <div className="absolute top-0 left-0 right-0 h-[35vh]" style={{ background: "linear-gradient(to bottom, rgba(5,2,20,0.9) 0%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[45vh]" style={{ background: "linear-gradient(to top, rgba(5,2,20,0.95) 0%, transparent 100%)" }} />
      <div className="absolute inset-y-0 left-0 w-[15vw]" style={{ background: "linear-gradient(to right, rgba(5,2,20,0.7), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-[15vw]" style={{ background: "linear-gradient(to left, rgba(5,2,20,0.7), transparent)" }} />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "160px 160px" }}
      />
    </div>
  );
}

function FriendshipSlideOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(60,20,120,0.25) 0%, rgba(20,10,60,0.15) 50%, rgba(100,30,150,0.2) 100%)", mixBlendMode: "multiply" }}
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,2,20,0.7) 100%)" }} />
      {/* Gold shimmer top */}
      <motion.div className="absolute top-0 left-[20%] w-[40vw] h-[30vh] opacity-[0.06]"
        style={{ background: "linear-gradient(180deg, #FFD700 0%, transparent 100%)", filter: "blur(20px)" }}
        animate={{ opacity: [0.04, 0.09, 0.04] }} transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}

export function FriendshipTemplate({ customer, images }: TemplateProps) {
  return (
    <Slideshow
      images={images.map((i) => ({ url: i.url, caption: i.caption }))}
      title={customer.recipient_name}
      message={customer.message}
      musicUrl={customer.music_url}
      introTag="For My Person"
      signature="With love — on TACTUS"
      ambient={<FriendshipAmbient />}
      theme={{
        accent: "#FFD700",
        background: "linear-gradient(160deg, #020010 0%, #0a0525 15%, #130a3e 30%, #1e0d5c 48%, #2d0f7a 65%, #1a0d52 82%, #080320 100%)",
        slideOverlay: <FriendshipSlideOverlay />,
        titleClassName: [
          "font-black tracking-tight leading-[0.95] text-[clamp(2.8rem,11vw,5rem)]",
          "[font-family:var(--font-display)] text-white",
          "[text-shadow:0_0_60px_rgba(255,215,0,0.6),0_0_20px_rgba(255,215,0,0.3),0_3px_0_rgba(0,0,0,0.6)]",
        ].join(" "),
        messageClassName: "text-yellow-100/80 text-base leading-relaxed [font-family:var(--font-body)]",
        introTagClassName: "text-yellow-200/90 tracking-[0.5em] [text-shadow:0_0_25px_rgba(255,215,0,0.7)]",
        captionClassName: [
          "text-yellow-100/90 font-bold tracking-[0.15em] uppercase text-sm",
          "[font-family:var(--font-display)]",
          "[text-shadow:0_0_20px_rgba(255,215,0,0.5)]",
        ].join(" "),
      }}
    />
  );
}
