"use client";

import { Slideshow } from "@/components/slideshow/Slideshow";

const DEMO_IMAGES = [
  { url: "/images/photo1.png", caption: "The night we first met" },
  { url: "/images/photo2.png", caption: "Our favorite place" },
  { url: "/images/photo3.png", caption: "Forever & always" },
];

export default function SlideshowDemoPage() {
  return (
    <Slideshow
      images={DEMO_IMAGES}
      title="Sofia"
      message="Every moment with you is a memory I'll always treasure."
      musicUrl="/audio/track.mp3"
      introTag="For You"
      signature="With love — on TACTUS"
      theme={{
        accent: "#ff4d6d",
        background:
          "linear-gradient(165deg, #1a0510 0%, #3d0a1f 35%, #7a1a38 75%, #b8174a 100%)",
        titleClassName:
          "text-rose-50 font-light italic tracking-wide leading-[1.05] text-[clamp(2.75rem,11vw,5rem)] [font-family:Georgia,'Times_New_Roman',serif]",
        messageClassName:
          "text-rose-100/85 text-base leading-relaxed italic [font-family:Georgia,'Times_New_Roman',serif]",
        introTagClassName: "text-rose-300",
        captionClassName: "italic [font-family:Georgia,'Times_New_Roman',serif]",
      }}
    />
  );
}
