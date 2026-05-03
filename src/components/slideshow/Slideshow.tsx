"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export type SlideshowImage = {
  url: string;
  caption?: string | null;
};

export type SlideshowTheme = {
  accent: string;
  background: string;
  titleClassName: string;
  messageClassName: string;
  introTagClassName?: string;
  outroClassName?: string;
  captionClassName?: string;
  slideOverlay?: React.ReactNode;
};

export type SlideshowProps = {
  images: SlideshowImage[];
  title: string;
  message?: string | null;
  musicUrl?: string | null;
  theme: SlideshowTheme;
  ambient?: ReactNode;
  introTag?: string;
  signature?: string;
};

type State = "idle" | "intro" | "playing" | "paused" | "ended";

const INTRO_DURATION = 3200;
const SLIDE_DURATION = 5500;
const SWIPE_THRESHOLD = 40;
const LONG_PRESS_MS = 180;

// Slide layout variants — cycles through for Wrapped feel
const LAYOUTS = ["fullbleed", "split", "centered", "dramatic"] as const;
type Layout = typeof LAYOUTS[number];

function fadeAudioTo(audio: HTMLAudioElement, target: number, ms: number) {
  const start = audio.volume;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / ms);
    audio.volume = start + (target - start) * p;
    if (p < 1) requestAnimationFrame(tick);
    else if (target === 0) audio.pause();
  };
  requestAnimationFrame(tick);
}

// ── Music bars ────────────────────────────────────────────────────────────────
function MusicBar({ accent, muted }: { accent: string; muted: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          animate={muted ? { height: 3 } : {
            height: [4, 14, 6, 16, 4],
            transition: { duration: 0.8 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
          }}
          style={{ background: accent, width: 3, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

// ── Slide card — Wrapped-style layout ────────────────────────────────────────
function SlideCard({
  image, caption, layout, accent, slideOverlay, captionClassName, idx,
}: {
  image: SlideshowImage;
  caption: string | null | undefined;
  layout: Layout;
  accent: string;
  slideOverlay?: ReactNode;
  captionClassName?: string;
  idx: number;
}) {
  // Direction alternates so slides push in from opposite sides
  const dir = idx % 2 === 0 ? 1 : -1;

  const slideVariants = {
    enter: { x: dir * 60, opacity: 0, scale: 0.96 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -dir * 40, opacity: 0, scale: 1.02 },
  };

  if (layout === "split") {
    // Photo top half, bold text bottom half
    return (
      <motion.div
        key={`slide-${idx}`}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0 flex flex-col"
      >
        {/* Photo — top 60% */}
        <div className="relative flex-[3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url} alt=""
            className="h-full w-full object-cover slideshow-kb-1"
            style={{ animationDuration: `${SLIDE_DURATION + 500}ms` }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          {slideOverlay}
        </div>
        {/* Text — bottom 40% */}
        <div className="relative flex-[2] flex flex-col justify-center px-7 py-5 overflow-hidden"
          style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}40, transparent 70%)` }} />
          {caption && (
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative z-10 text-2xl font-black leading-tight text-white ${captionClassName ?? ""}`}
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem,6vw,2rem)" }}
            >
              {caption}
            </motion.p>
          )}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 h-[3px] w-12 origin-left rounded-full"
            style={{ background: accent }}
          />
        </div>
      </motion.div>
    );
  }

  if (layout === "centered") {
    // Full bleed photo, caption centered in big bold text
    return (
      <motion.div
        key={`slide-${idx}`}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url} alt=""
          className="absolute h-full w-full object-cover slideshow-kb-3"
          style={{ animationDuration: `${SLIDE_DURATION + 500}ms` }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/50" />
        {slideOverlay}

        {caption && (
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <motion.div className="text-center">
              {/* Big accent word-by-word reveal */}
              {caption.split(" ").map((word, wi) => (
                <motion.span
                  key={wi}
                  initial={{ opacity: 0, y: 40, rotate: wi % 2 === 0 ? -3 : 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.15 + wi * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-3 inline-block text-white font-black drop-shadow-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem,9vw,3.5rem)",
                    lineHeight: 1.1,
                    textShadow: `0 0 40px ${accent}88`,
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mx-auto mt-4 h-1 w-16 rounded-full origin-center"
                style={{ background: accent }}
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  }

  if (layout === "dramatic") {
    // Full bleed, caption HUGE at bottom, letter-by-letter
    return (
      <motion.div
        key={`slide-${idx}`}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url} alt=""
          className="absolute h-full w-full object-cover slideshow-kb-4"
          style={{ animationDuration: `${SLIDE_DURATION + 500}ms` }}
          draggable={false}
        />
        {/* Heavy bottom gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)" }} />
        {slideOverlay}

        {caption && (
          <div className="absolute bottom-0 inset-x-0 px-6 pb-[max(6rem,calc(4.5rem+env(safe-area-inset-bottom)))]">
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`text-white font-black leading-[1.05] ${captionClassName ?? ""}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem,10vw,3.8rem)",
                textShadow: `0 4px 30px rgba(0,0,0,0.8), 0 0 60px ${accent}44`,
              }}
            >
              {caption}
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-3 h-1 rounded-full"
              style={{ background: accent }}
            />
          </div>
        )}
      </motion.div>
    );
  }

  // fullbleed — default, clean with caption bottom-center
  return (
    <motion.div
      key={`slide-${idx}`}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      className="absolute inset-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url} alt=""
        className="absolute h-full w-full object-cover slideshow-kb-2"
        style={{ animationDuration: `${SLIDE_DURATION + 500}ms` }}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />
      {slideOverlay}

      {caption && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 inset-x-0 px-6 pb-[max(6rem,calc(4.5rem+env(safe-area-inset-bottom)))] text-center"
        >
          <p
            className={`text-white font-semibold text-xl leading-snug drop-shadow-2xl ${captionClassName ?? ""}`}
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
          >
            {caption}
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mx-auto mt-2 h-[3px] w-10 rounded-full origin-center"
            style={{ background: accent }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function Slideshow({
  images, title, message, musicUrl, theme, ambient, introTag, signature,
}: SlideshowProps) {
  const [state, setState] = useState<State>("idle");
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [dir, setDir] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceRef = useRef<number | null>(null);
  const introRef = useRef<number | null>(null);
  const gestureRef = useRef<{
    startX: number; startY: number; startTime: number;
    lpTimer: number | null; isLongPress: boolean; wasPlaying: boolean;
  } | null>(null);

  const clearTimers = useCallback(() => {
    if (advanceRef.current) { clearTimeout(advanceRef.current); advanceRef.current = null; }
    if (introRef.current) { clearTimeout(introRef.current); introRef.current = null; }
  }, []);

  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop = true; audio.preload = "auto"; audio.volume = 0;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; audioRef.current = null; };
  }, [musicUrl]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const endShow = useCallback(() => {
    clearTimers();
    setState("ended");
    if (audioRef.current) fadeAudioTo(audioRef.current, 0, 1800);
  }, [clearTimers]);

  const goToSlide = useCallback((index: number, direction = 1) => {
    clearTimers();
    setDir(direction);
    setCurrent(index);
    setState("playing");
    if (navigator?.vibrate) navigator.vibrate(8);
  }, [clearTimers]);

  useEffect(() => {
    if (state !== "playing") return;
    advanceRef.current = window.setTimeout(() => {
      if (current >= images.length - 1) endShow();
      else goToSlide(current + 1, 1);
    }, SLIDE_DURATION);
  }, [state, current, images.length, goToSlide, endShow]);

  const start = useCallback(() => {
    setState("intro");
    if (audioRef.current && !muted) {
      audioRef.current.play().then(() => {
        if (audioRef.current && !muted) fadeAudioTo(audioRef.current, 0.75, 2000);
      }).catch(() => {});
    }
    introRef.current = window.setTimeout(() => {
      setCurrent(0); setDir(1); setState("playing");
    }, INTRO_DURATION);
  }, [muted]);

  const next = useCallback(() => {
    if (state !== "playing" && state !== "paused") return;
    if (current >= images.length - 1) endShow();
    else goToSlide(current + 1, 1);
  }, [state, current, images.length, goToSlide, endShow]);

  const prev = useCallback(() => {
    if (state !== "playing" && state !== "paused") return;
    if (current === 0) return;
    goToSlide(current - 1, -1);
  }, [state, current, goToSlide]);

  const toggleMute = useCallback(() => {
    const nm = !muted; setMuted(nm);
    if (!audioRef.current) return;
    if (nm) fadeAudioTo(audioRef.current, 0, 400);
    else if (state === "intro" || state === "playing") {
      audioRef.current.play().catch(() => {});
      fadeAudioTo(audioRef.current, 0.75, 600);
    }
  }, [muted, state]);

  const replay = useCallback(() => {
    setCurrent(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    start();
  }, [start]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (state !== "playing" && state !== "paused") return;
    const g = { startX: e.clientX, startY: e.clientY, startTime: Date.now(),
      lpTimer: null as number | null, isLongPress: false, wasPlaying: state === "playing" };
    g.lpTimer = window.setTimeout(() => {
      g.isLongPress = true;
      clearTimers(); setState("paused");
      if (audioRef.current) audioRef.current.pause();
      if (navigator?.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
    gestureRef.current = g;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [state, clearTimers]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const g = gestureRef.current; if (!g) return;
    if ((Math.abs(e.clientX - g.startX) > 10 || Math.abs(e.clientY - g.startY) > 10) && g.lpTimer) {
      clearTimeout(g.lpTimer); g.lpTimer = null;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current; if (!g) return;
    gestureRef.current = null;
    if (g.lpTimer) clearTimeout(g.lpTimer);
    if (g.isLongPress) {
      if (g.wasPlaying) { setState("playing"); audioRef.current?.play().catch(() => {}); }
      return;
    }
    const dx = e.clientX - g.startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Date.now() - g.startTime < 500) {
      if (dx < 0) next(); else prev(); return;
    }
    const relX = (e.clientX - (e.currentTarget as HTMLDivElement).getBoundingClientRect().left)
      / (e.currentTarget as HTMLDivElement).getBoundingClientRect().width;
    if (relX < 0.3) prev(); else next();
  }, [next, prev]);

  const isPlaying = state === "playing" || state === "paused";
  const layout: Layout = LAYOUTS[current % LAYOUTS.length];

  return (
    <div
      className={`slideshow-root fixed inset-0 overflow-hidden ${state === "paused" ? "slideshow-paused" : ""}`}
      style={{ background: theme.background }}
    >
      {ambient}

      {/* Preload */}
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={img.url} src={img.url} alt="" className="hidden" aria-hidden />
      ))}

      {/* ── SLIDES ── */}
      <AnimatePresence mode="popLayout" custom={dir}>
        {isPlaying && (
          <SlideCard
            key={`slide-${current}`}
            image={images[current]}
            caption={images[current]?.caption}
            layout={layout}
            accent={theme.accent}
            slideOverlay={theme.slideOverlay}
            captionClassName={theme.captionClassName}
            idx={current}
          />
        )}
      </AnimatePresence>

      {/* ── PROGRESS BARS ── */}
      {isPlaying && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <div key={i} className="relative h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/20">
                {i < current && <div className="absolute inset-0 bg-white" />}
                {i === current && (
                  <div
                    key={`fill-${current}`}
                    className="slideshow-progress-fill absolute inset-0 bg-white"
                    style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GESTURE LAYER ── */}
      {isPlaying && (
        <div className="absolute inset-0 z-20 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}

      {/* ── BOTTOM BAR ── */}
      {isPlaying && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-center justify-between px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {musicUrl
            ? <MusicBar accent={theme.accent} muted={muted} />
            : <div />}
          <span className="text-[10px] font-bold tabular-nums text-white/40 tracking-widest">
            {current + 1}<span className="text-white/20"> / {images.length}</span>
          </span>
        </div>
      )}

      {/* ── MUTE ── */}
      {musicUrl && state !== "idle" && state !== "ended" && (
        <button type="button" onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="pointer-events-auto absolute bottom-[max(1.1rem,env(safe-area-inset-bottom))] right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition hover:text-white active:scale-90"
        >
          {muted
            ? <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l4-4m0 4l-4-4M9 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4l4 4V5L9 9z" /></svg>
            : <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14M9 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4l4 4V5L9 9z" /></svg>
          }
        </button>
      )}

      {/* ── PAUSE INDICATOR ── */}
      <AnimatePresence>
        {state === "paused" && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-xl border border-white/15">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IDLE ── */}
      <AnimatePresence>
        {state === "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          >
            {images.length > 0 && (
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0].url} alt=""
                  className="h-full w-full scale-110 object-cover blur-3xl brightness-[0.2] saturate-150" draggable={false} />
                <div className="absolute inset-0" style={{ background: theme.background, opacity: 0.55 }} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
              </div>
            )}
            <button type="button" onClick={start}
              className="group relative z-10 flex flex-col items-center gap-8 px-8 focus:outline-none"
            >
              {introTag && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`text-[11px] uppercase tracking-[0.5em] ${theme.introTagClassName ?? "text-white/50"}`}
                >
                  {introTag}
                </motion.p>
              )}
              <motion.div className="relative flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute h-32 w-32 rounded-full"
                  style={{ border: `1.5px solid ${theme.accent}` }} />
                <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  className="absolute h-24 w-24 rounded-full"
                  style={{ border: `1px solid ${theme.accent}` }} />
                <motion.div animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-md"
                  style={{ background: `${theme.accent}25`, border: `1.5px solid ${theme.accent}60` }}
                >
                  <svg className="ml-1.5 h-8 w-8" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.accent }}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Tap to begin</p>
                {musicUrl && <p className="text-[10px] text-white/25 tracking-wider">🎵 Music included</p>}
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INTRO ── */}
      <AnimatePresence>
        {state === "intro" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-8 text-center"
          >
            {images.length > 0 && (
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0].url} alt=""
                  className="h-full w-full scale-110 object-cover blur-2xl brightness-[0.15] saturate-150" draggable={false} />
                <div className="absolute inset-0" style={{ background: theme.background, opacity: 0.65 }} />
              </div>
            )}
            <div className="relative z-10 flex flex-col items-center gap-6">
              {introTag && (
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.6 }}
                  className={`text-[11px] uppercase tracking-[0.55em] ${theme.introTagClassName ?? "text-white/60"}`}
                >
                  {introTag}
                </motion.p>
              )}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="h-px w-14 origin-center" style={{ background: theme.accent }} />
              {/* Title slams in with spring */}
              <motion.h1
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.35 }}
                className={theme.titleClassName}
              >
                {title}
              </motion.h1>
              {message && (
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                  className={`mt-1 max-w-sm whitespace-pre-line ${theme.messageClassName}`}
                >
                  {message}
                </motion.p>
              )}
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="h-px w-8 origin-center opacity-40" style={{ background: theme.accent }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OUTRO ── */}
      <AnimatePresence>
        {state === "ended" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center px-8 text-center ${theme.outroClassName ?? ""}`}
          >
            {/* Mosaic background */}
            {images.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                <div className="slideshow-mosaic-grid"
                  style={{ "--mosaic-count": Math.min(images.length, 6) } as React.CSSProperties}>
                  {images.slice(0, 6).map((img, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.8, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: (i % 2 === 0 ? 1 : -1) * (1.5 + (i % 3) * 1.5) }}
                      transition={{ delay: 0.05 + i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="slideshow-mosaic-item overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
                    </motion.div>
                  ))}
                </div>
                <div className="absolute inset-0 z-10 bg-black/65 backdrop-blur-[4px]" />
              </motion.div>
            )}

            <div className="relative z-20 flex flex-col items-center gap-4">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.5 }}
                className="h-3 w-3 rounded-full" style={{ background: theme.accent,
                  boxShadow: `0 0 20px ${theme.accent}, 0 0 40px ${theme.accent}66` }} />

              <motion.h2
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.7, type: "spring", bounce: 0.3 }}
                className={theme.titleClassName}
                style={{ fontSize: "clamp(2rem,8vw,3rem)" }}
              >
                {title}
              </motion.h2>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="text-[10px] uppercase tracking-[0.55em] text-white/45"
              >
                {signature ?? "Made on TACTUS"}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-3 flex flex-col items-center gap-3"
              >
                <button type="button" onClick={replay}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] text-white transition hover:scale-105 active:scale-95 backdrop-blur-md"
                  style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}22` }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 14-4l2 2M20 14a8 8 0 0 1-14 4l-2-2" />
                  </svg>
                  Replay
                </button>
                <p className="text-[9px] text-white/20 tracking-widest uppercase">tactus.ph</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
