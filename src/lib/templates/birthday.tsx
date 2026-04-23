"use client";

import { useMemo } from "react";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

const CONFETTI_COLORS = ["#FF6B6B", "#FFD166", "#06D6A0", "#4D96FF", "#C77DFF", "#FF9F68"];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 30,
        duration: 7 + Math.random() * 6,
        delay: Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-particle absolute top-0 block rounded-[2px]"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.6}px`,
              backgroundColor: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              ["--confetti-drift-x" as string]: `${p.drift}vw`,
              opacity: 0.75,
            } as React.CSSProperties
          }
        />
      ))}
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
      ambient={<Confetti />}
      theme={{
        accent: "#FFB347",
        background:
          "linear-gradient(160deg, #2A1B3D 0%, #44318D 40%, #E98074 85%, #F6BD60 100%)",
        titleClassName:
          "text-white font-black tracking-tight leading-[1.05] text-[clamp(2.5rem,10vw,4.5rem)] [font-family:var(--font-display)]",
        messageClassName: "text-white/85 text-base leading-relaxed",
        introTagClassName: "text-[#FFD166]",
      }}
    />
  );
}
