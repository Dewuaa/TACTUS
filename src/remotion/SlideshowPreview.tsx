import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Sequence,
} from "remotion";

// React is needed for JSX in Remotion compositions
import React from "react";

// ── Single photo slide ────────────────────────────────────────────────────────
const PhotoSlide = ({
  src,
  caption,
  accentColor = "#FF6B35",
  kbDir = 1,
}: {
  src: string;
  caption: string;
  accentColor?: string;
  kbDir?: 1 | -1;
}) => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [62, 80], [1, 0], { extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  // Ken Burns
  const scale = interpolate(frame, [0, 80], [1, 1.08], { extrapolateRight: "clamp" });
  const kbX = interpolate(frame, [0, 80], [0, kbDir * 12], { extrapolateRight: "clamp" });

  // Caption slide up
  const captionY = interpolate(frame, [20, 38], [20, 0], { extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Photo */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${kbX}px)`,
          }}
        />
        {/* Dark vignette */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Bottom gradient */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
          }}
        />
      </AbsoluteFill>

      {/* Caption */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 60,
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 22,
            fontFamily: "Georgia, serif",
            letterSpacing: "0.08em",
            textAlign: "center",
            padding: "0 40px",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {caption}
        </div>
        {/* Accent line */}
        <div
          style={{
            width: 32,
            height: 2,
            background: accentColor,
            marginTop: 10,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ slideCount, slideDuration }: { slideCount: number; slideDuration: number }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: 4, width: "100%" }}>
        {Array.from({ length: slideCount }).map((_, i) => {
          const start = i * slideDuration;
          const end = (i + 1) * slideDuration;
          const progress = interpolate(frame, [start, end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{ flex: 1, height: 2.5, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${progress * 100}%`, height: "100%", background: "white", borderRadius: 2 }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Tap ripple intro ──────────────────────────────────────────────────────────
const TapIntro = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 10, 50, 60], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale1 = interpolate(frame, [10, 40], [0.5, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale2 = interpolate(frame, [20, 50], [0.5, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring1Opacity = interpolate(frame, [10, 40], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2Opacity = interpolate(frame, [20, 50], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY = interpolate(frame, [5, 20], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", opacity, alignItems: "center", justifyContent: "center" }}>
      {/* Ripple rings */}
      <div style={{
        position: "absolute", width: 80, height: 80, borderRadius: "50%",
        border: "2px solid #FF6B35", opacity: ring1Opacity,
        transform: `scale(${scale1})`,
      }} />
      <div style={{
        position: "absolute", width: 80, height: 80, borderRadius: "50%",
        border: "2px solid #FF6B35", opacity: ring2Opacity,
        transform: `scale(${scale2})`,
      }} />
      {/* Icon */}
      <div style={{ fontSize: 36, marginBottom: 16 }}>👆</div>
      <div style={{
        color: "rgba(255,255,255,0.7)", fontSize: 13,
        fontFamily: "system-ui, sans-serif", letterSpacing: "0.2em",
        textTransform: "uppercase", transform: `translateY(${textY}px)`,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        Tap to unlock
      </div>
    </AbsoluteFill>
  );
};

// ── Outro ─────────────────────────────────────────────────────────────────────
const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame, config: { damping: 18, stiffness: 120 } });
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #0d0208 0%, #1a0510 50%, #0d0208 100%)",
        opacity: fadeIn,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Heart */}
      <div style={{ fontSize: 52, transform: `scale(${s})` }}>🌹</div>

      {/* Message */}
      <div style={{
        color: "white", fontSize: 20, fontFamily: "Georgia, serif",
        letterSpacing: "0.06em", textAlign: "center", padding: "0 40px",
        transform: `translateY(${interpolate(frame, [10, 28], [16, 0], { extrapolateRight: "clamp" })}px)`,
        opacity: interpolate(frame, [10, 28], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Made with love
      </div>

      <div style={{
        color: "rgba(255,255,255,0.4)", fontSize: 11,
        fontFamily: "system-ui, sans-serif", letterSpacing: "0.3em",
        textTransform: "uppercase", marginTop: 8,
        opacity: interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        TACTUS
      </div>

      {/* CTA pill */}
      <div style={{
        marginTop: 24,
        background: "#FF6B35", borderRadius: 999,
        padding: "10px 28px", color: "black",
        fontSize: 11, fontFamily: "system-ui, sans-serif",
        fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
        opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [30, 45], [10, 0], { extrapolateRight: "clamp" })}px)`,
      }}>
        Order yours →
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──────────────────────────────────────────────────────────
const SLIDE_DURATION = 80; // frames per slide
const INTRO_DURATION = 60;
const OUTRO_DURATION = 90;

const slides = [
  { src: staticFile("products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png"), caption: "Happy Birthday, Ate 🎂", accentColor: "#FF6B35", kbDir: 1 as const },
  { src: staticFile("products/Gemini_Generated_Image_v6osfcv6osfcv6os.png"), caption: "Our song is playing ♪", accentColor: "#f472b6", kbDir: -1 as const },
  { src: staticFile("products/Gemini_Generated_Image_btalaybtalaybtal.png"), caption: "Remember this day?", accentColor: "#a78bfa", kbDir: 1 as const },
];

export const SlideshowPreview: React.FC = () => {
  const totalSlides = slides.length;

  return (
    <AbsoluteFill style={{ background: "#000", borderRadius: 0 }}>
      {/* Tap intro */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <TapIntro />
      </Sequence>

      {/* Slides */}
      {slides.map((slide, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * SLIDE_DURATION}
          durationInFrames={SLIDE_DURATION}
        >
          <PhotoSlide
            src={slide.src}
            caption={slide.caption}
            accentColor={slide.accentColor}
            kbDir={slide.kbDir}
          />
        </Sequence>
      ))}

      {/* Progress bar (shown during slides) */}
      <Sequence from={INTRO_DURATION} durationInFrames={totalSlides * SLIDE_DURATION}>
        <ProgressBar slideCount={totalSlides} slideDuration={SLIDE_DURATION} />
      </Sequence>

      {/* Outro */}
      <Sequence
        from={INTRO_DURATION + totalSlides * SLIDE_DURATION}
        durationInFrames={OUTRO_DURATION}
      >
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SLIDESHOW_TOTAL_FRAMES = INTRO_DURATION + slides.length * SLIDE_DURATION + OUTRO_DURATION;
