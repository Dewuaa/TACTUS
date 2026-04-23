"use client";

import { useMemo } from "react";
import { Slideshow } from "@/components/slideshow/Slideshow";
import type { TemplateProps } from "./index";

function Hearts() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 20,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 10,
        size: 10 + Math.random() * 14,
        opacity: 0.3 + Math.random() * 0.4,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {pieces.map((p) => (
        <svg
          key={p.id}
          className="heart-particle absolute bottom-0"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              opacity: p.opacity,
              ["--heart-drift-x" as string]: `${p.drift}vw`,
            } as React.CSSProperties
          }
          viewBox="0 0 24 24"
          fill="#ff4d6d"
        >
          <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
      ))}
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
      ambient={<Hearts />}
      theme={{
        accent: "#ff4d6d",
        background:
          "linear-gradient(165deg, #1a0510 0%, #3d0a1f 35%, #7a1a38 75%, #b8174a 100%)",
        titleClassName:
          "text-rose-50 font-light italic tracking-wide leading-[1.05] text-[clamp(2.75rem,11vw,5rem)] [font-family:Georgia,'Times_New_Roman',serif]",
        messageClassName:
          "text-rose-100/85 text-base leading-relaxed italic [font-family:Georgia,'Times_New_Roman',serif]",
        introTagClassName: "text-rose-300",
      }}
    />
  );
}
