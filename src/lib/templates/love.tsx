"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

const PETAL_PATHS = [
  "M12 3C12 3 18 8 18 13.5C18 17 15.3 20 12 20C8.7 20 6 17 6 13.5C6 8 12 3 12 3Z",
  "M12 2C14 5 17 8 17 12C17 16.4 14.9 19 12 19C9.1 19 7 16.4 7 12C7 8 10 5 12 2Z",
  "M12 4C15 7 17 10 16 14C15 17.5 13.5 19 12 19C10.5 19 9 17.5 8 14C7 10 9 7 12 4Z",
];

type Petal = {
  id: number; left: number; drift: number; duration: number;
  delay: number; size: number; opacity: number;
  path: string; color: string; rotate: number;
};

function LoveAmbient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const petals = useMemo<Petal[]>(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: 3 + Math.random() * 94,
      drift: (Math.random() - 0.5) * 22,
      duration: 11 + Math.random() * 12,
      delay: Math.random() * 16,
      size: 9 + Math.random() * 18,
      opacity: 0.2 + Math.random() * 0.45,
      path: PETAL_PATHS[i % PETAL_PATHS.length],
      color: i % 4 === 0 ? "#ff6b81" : i % 4 === 1 ? "#c9184a" : i % 4 === 2 ? "#ffb3c1" : "#ff4d6d",
      rotate: Math.random() * 360,
    })), []);

  // Deep romantic blobs that slowly breathe
  const glowBlobs = useMemo(() => [
    { color: "#8b0030", x: 50, y: 30, size: 80, dur: 12 },
    { color: "#5c0020", x: 20, y: 70, size: 60, dur: 9 },
    { color: "#b51a3a", x: 80, y: 60, size: 50, dur: 14 },
    { color: "#3a000f", x: 60, y: 85, size: 70, dur: 8 },
  ], []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">

      {/* Deep breathing glow blobs */}
      {glowBlobs.map((b, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: `${b.size}vw`, height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color}70 0%, ${b.color}30 45%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(35px)",
          }}
          animate={{
            scale: [1, 1.35, 0.9, 1.2, 1],
            opacity: [0.5, 0.85, 0.4, 0.75, 0.5],
            x: [0, 20, -15, 10, 0],
            y: [0, -20, 15, -8, 0],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.8 }}
        />
      ))}

      {/* Slow burning ember core */}
      <motion.div
        className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "90vw", height: "90vw",
          background: "radial-gradient(circle, rgba(160,20,40,0.22) 0%, rgba(100,5,20,0.12) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.15, 0.95, 1], opacity: [0.6, 1, 0.5, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top dark vignette — cinematic letterbox */}
      <div className="absolute top-0 left-0 right-0 h-[40vh]"
        style={{ background: "linear-gradient(to bottom, rgba(2,0,6,0.85) 0%, rgba(2,0,6,0.3) 60%, transparent 100%)" }}
      />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{ background: "linear-gradient(to top, rgba(2,0,6,0.9) 0%, rgba(2,0,6,0.4) 50%, transparent 100%)" }}
      />
      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-[18vw]"
        style={{ background: "linear-gradient(to right, rgba(2,0,6,0.7), transparent)" }}
      />
      <div className="absolute inset-y-0 right-0 w-[18vw]"
        style={{ background: "linear-gradient(to left, rgba(2,0,6,0.7), transparent)" }}
      />

      {/* Angled moonlight shaft */}
      <motion.div
        className="absolute top-0 left-[30%] w-[25vw] h-full opacity-[0.05]"
        style={{
          background: "linear-gradient(180deg, rgba(255,200,180,1) 0%, transparent 55%)",
          transform: "skewX(-10deg)",
        }}
        animate={{ opacity: [0.03, 0.07, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* Floating rose petals */}
      {petals.map((p) => (
        <svg key={p.id}
          className="heart-particle absolute bottom-0"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
            opacity: p.opacity,
            ["--heart-drift-x" as string]: `${p.drift}vw`,
            transform: `rotate(${p.rotate}deg)`,
            filter: `drop-shadow(0 0 ${p.size * 0.3}px ${p.color}77)`,
          } as React.CSSProperties}
          viewBox="0 0 24 24" fill={p.color}
        >
          <path d={p.path} />
        </svg>
      ))}

      {/* Tiny floating embers / light motes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div key={`ember-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${10 + i * 8}%`,
            bottom: `${8 + (i * 17) % 55}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            backgroundColor: i % 2 === 0 ? "#ff9ab2" : "#ffcdd2",
            boxShadow: `0 0 6px 3px ${i % 2 === 0 ? "rgba(255,100,130,0.5)" : "rgba(255,180,180,0.4)"}`,
          }}
          animate={{
            y: [0, -(60 + i * 12)],
            x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 2)],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0],
          }}
          transition={{
            duration: 6 + i * 1.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.8,
          }}
        />
      ))}
    </div>
  );
}

// Slide overlay — petals + cinematic color grade on top of each photo
function LoveSlideOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const petals = useMemo<Petal[]>(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      drift: (Math.random() - 0.5) * 16,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 12,
      size: 8 + Math.random() * 14,
      opacity: 0.25 + Math.random() * 0.4,
      path: PETAL_PATHS[i % PETAL_PATHS.length],
      color: i % 3 === 0 ? "#ff6b81" : i % 3 === 1 ? "#ffb3c1" : "#ff4d6d",
      rotate: Math.random() * 360,
    })), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Warm rose color grade over photo */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(80,0,20,0.35) 0%, rgba(40,0,10,0.15) 40%, rgba(100,5,25,0.4) 100%)", mixBlendMode: "multiply" }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Vignette burned hard on edges */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,0,10,0.75) 100%)" }} />
      {/* Petals over the photo */}
      {petals.map((p) => (
        <svg key={p.id}
          className="heart-particle absolute bottom-0"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
            opacity: p.opacity,
            ["--heart-drift-x" as string]: `${p.drift}vw`,
            transform: `rotate(${p.rotate}deg)`,
            filter: `drop-shadow(0 0 ${p.size * 0.4}px ${p.color}88)`,
          } as React.CSSProperties}
          viewBox="0 0 24 24" fill={p.color}>
          <path d={p.path} />
        </svg>
      ))}
      {/* Soft light leak top-left */}
      <motion.div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,150,130,0.12), transparent 70%)", filter: "blur(20px)" }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function LoveTemplate({ customer, images }: TemplateProps) {
  return (
    <Slideshow
      images={images.map((i) => ({ url: i.url, caption: i.caption }))}
      title={customer.recipient_name}
      message={customer.message}
      musicUrl={customer.music_url}
      introTag="For You"
      signature="With love — on TACTUS"
      ambient={<LoveAmbient />}
      theme={{
        accent: "#e8637a",
        slideOverlay: <LoveSlideOverlay />,
        background: "linear-gradient(170deg, #020006 0%, #0a0010 15%, #180010 32%, #2e0018 50%, #520820 68%, #7a1030 82%, #520820 100%)",
        titleClassName: [
          "font-light italic tracking-wide leading-[1.05] text-[clamp(2.75rem,11vw,5rem)]",
          "[font-family:Georgia,'Times_New_Roman',serif] text-rose-50",
          "[text-shadow:0_2px_40px_rgba(220,60,90,0.5),0_0_80px_rgba(150,10,40,0.4)]",
        ].join(" "),
        messageClassName: [
          "text-rose-100/80 text-base leading-[1.9] italic",
          "[font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_1px_16px_rgba(0,0,0,0.7)]",
        ].join(" "),
        introTagClassName: [
          "text-rose-200/90 italic [font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_0_25px_rgba(230,100,120,0.6)]",
        ].join(" "),
        captionClassName: [
          "text-rose-100/85 italic text-sm tracking-wide",
          "[font-family:Georgia,'Times_New_Roman',serif]",
          "[text-shadow:0_1px_10px_rgba(0,0,0,0.8)]",
        ].join(" "),
      }}
    />
  );
}
