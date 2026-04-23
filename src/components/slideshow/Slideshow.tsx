"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const INTRO_DURATION = 2400;
const SLIDE_DURATION = 4500;
const OUTRO_DELAY = 600;
const CROSSFADE = 700;
const SWIPE_THRESHOLD = 50;
const LONG_PRESS_MS = 200;
const KB_CLASSES = [
  "slideshow-kb-1",
  "slideshow-kb-2",
  "slideshow-kb-3",
  "slideshow-kb-4",
];

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

export function Slideshow({
  images,
  title,
  message,
  musicUrl,
  theme,
  ambient,
  introTag,
  signature,
}: SlideshowProps) {
  const [state, setState] = useState<State>("idle");
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);

  // Gesture refs
  const gestureRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    lpTimer: number | null;
    isLongPress: boolean;
    wasPlaying: boolean;
  } | null>(null);

  const kbPerSlide = useMemo(
    () => images.map((_, i) => KB_CLASSES[i % KB_CLASSES.length]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length],
  );

  const clearTimers = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (introTimerRef.current) {
      clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
  }, []);

  const handleImageLoaded = useCallback((url: string) => {
    setLoadedUrls((prev) => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  // ─── Audio ───
  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [musicUrl]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // ─── Navigation ───
  const scheduleAdvance = useCallback(
    (duration: number, onDone: () => void) => {
      clearTimers();
      advanceTimerRef.current = window.setTimeout(onDone, duration);
    },
    [clearTimers],
  );

  const goToSlide = useCallback(
    (index: number) => {
      clearTimers();
      setCurrent(index);
      setState("playing");
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(8);
      }
    },
    [clearTimers],
  );

  const endShow = useCallback(() => {
    clearTimers();
    setState("ended");
    if (audioRef.current) fadeAudioTo(audioRef.current, 0, 1500);
  }, [clearTimers]);

  // Auto-advance timer
  useEffect(() => {
    if (state !== "playing") return;
    scheduleAdvance(SLIDE_DURATION, () => {
      if (current >= images.length - 1) {
        endShow();
      } else {
        goToSlide(current + 1);
      }
    });
  }, [state, current, images.length, scheduleAdvance, goToSlide, endShow]);

  const start = useCallback(() => {
    setState("intro");
    if (audioRef.current && !muted) {
      audioRef.current
        .play()
        .then(() => {
          if (audioRef.current && !muted)
            fadeAudioTo(audioRef.current, 0.7, 1500);
        })
        .catch(() => {});
    }
    introTimerRef.current = window.setTimeout(() => {
      setCurrent(0);
      setState("playing");
    }, INTRO_DURATION);
  }, [muted]);

  const next = useCallback(() => {
    if (state !== "playing" && state !== "paused") return;
    if (current >= images.length - 1) endShow();
    else goToSlide(current + 1);
  }, [state, current, images.length, goToSlide, endShow]);

  const prev = useCallback(() => {
    if (state !== "playing" && state !== "paused") return;
    if (current === 0) return;
    goToSlide(current - 1);
  }, [state, current, goToSlide]);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (!audioRef.current) return;
    if (newMuted) {
      fadeAudioTo(audioRef.current, 0, 400);
    } else if (state === "intro" || state === "playing") {
      audioRef.current.play().catch(() => {});
      fadeAudioTo(audioRef.current, 0.7, 600);
    }
  }, [muted, state]);

  const replay = useCallback(() => {
    setCurrent(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    start();
  }, [start]);

  // ─── Gesture: swipe + long-press + tap (IG Stories style) ───
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (state !== "playing" && state !== "paused") return;
      const g = {
        startX: e.clientX,
        startY: e.clientY,
        startTime: Date.now(),
        lpTimer: null as number | null,
        isLongPress: false,
        wasPlaying: state === "playing",
      };
      g.lpTimer = window.setTimeout(() => {
        g.isLongPress = true;
        clearTimers();
        setState("paused");
        if (audioRef.current) audioRef.current.pause();
        if ("vibrate" in navigator) navigator.vibrate?.(15);
      }, LONG_PRESS_MS);
      gestureRef.current = g;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [state, clearTimers],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g) return;
      const dx = Math.abs(e.clientX - g.startX);
      const dy = Math.abs(e.clientY - g.startY);
      if ((dx > 10 || dy > 10) && g.lpTimer) {
        clearTimeout(g.lpTimer);
        g.lpTimer = null;
      }
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const g = gestureRef.current;
      if (!g) return;
      gestureRef.current = null;
      if (g.lpTimer) clearTimeout(g.lpTimer);

      // Long-press release → resume
      if (g.isLongPress) {
        if (g.wasPlaying) {
          setState("playing");
          if (audioRef.current && !muted)
            audioRef.current.play().catch(() => {});
        }
        return;
      }

      // Check for swipe
      const dx = e.clientX - g.startX;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Date.now() - g.startTime < 500) {
        if (dx < 0) next();
        else prev();
        return;
      }

      // Regular tap — left 30% = prev, rest = next
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      if (relX < 0.3) prev();
      else next();
    },
    [next, prev, muted],
  );

  const isPlayingPhase = state === "playing" || state === "paused";
  const currentCaption = isPlayingPhase ? images[current]?.caption : null;
  const isCurrentLoaded =
    images.length > 0 && loadedUrls.has(images[current]?.url);

  return (
    <div
      className={`slideshow-root fixed inset-0 overflow-hidden ${state === "paused" ? "slideshow-paused" : ""}`}
      style={{ background: theme.background }}
    >
      {ambient}

      {/* ─── Eagerly preload ALL images ─── */}
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.url}
          src={img.url}
          alt=""
          className="hidden"
          aria-hidden
          onLoad={() => handleImageLoaded(img.url)}
        />
      ))}

      {/* ─── Slide renderer ─── */}
      <AnimatePresence>
        {isPlayingPhase && (
          <motion.div
            key={`slide-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE / 1000, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className={`absolute inset-0 ${kbPerSlide[current]}`}
              style={{
                animationDuration: `${SLIDE_DURATION + OUTRO_DELAY}ms`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[current].url}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* ─── Caption ─── */}
            {currentCaption && (
              <motion.div
                key={`caption-${current}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-[max(5rem,calc(3rem+env(safe-area-inset-bottom)))]"
              >
                <p
                  className={`text-center text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${theme.captionClassName ?? ""}`}
                >
                  {currentCaption}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Loading spinner ─── */}
      {isPlayingPhase && !isCurrentLoaded && (
        <div className="pointer-events-none absolute inset-0 z-[35] flex items-center justify-center">
          <div className="tactus-spinner" />
        </div>
      )}

      {/* ─── Progress bars + slide counter ─── */}
      {isPlayingPhase && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {images.map((_, i) => (
                <div
                  key={i}
                  className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                >
                  {i < current && (
                    <div className="absolute inset-0 bg-white" />
                  )}
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
            <span className="shrink-0 ml-1 text-[10px] font-medium tabular-nums text-white/50">
              {current + 1}/{images.length}
            </span>
          </div>
        </div>
      )}

      {/* ─── Unified gesture handler (replaces old tap zones) ─── */}
      {isPlayingPhase && (
        <div
          className="absolute inset-0 z-20 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}

      {/* ─── Pause indicator ─── */}
      <AnimatePresence>
        {state === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-black/30 backdrop-blur-md"
            >
              <svg
                className="h-7 w-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Audio mute toggle ─── */}
      {musicUrl && state !== "idle" && state !== "ended" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:text-white active:scale-90"
        >
          {muted ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 14l4-4m0 4l-4-4M9 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4l4 4V5L9 9z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14M9 9H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4l4 4V5L9 9z"
              />
            </svg>
          )}
        </button>
      )}

      {/* ─── Idle: blurred preview + play button ─── */}
      <AnimatePresence>
        {state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          >
            {/* Blurred first image as cinematic background */}
            {images.length > 0 && (
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0].url}
                  alt=""
                  className="h-full w-full scale-110 object-cover blur-2xl brightness-[0.3] saturate-[1.2]"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: theme.background, opacity: 0.4 }}
                />
              </div>
            )}

            <button
              type="button"
              onClick={start}
              className="group relative z-10 flex flex-col items-center gap-6 px-8 focus:outline-none"
            >
              {introTag && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`text-[11px] uppercase tracking-[0.4em] ${theme.introTagClassName ?? "text-white/50"}`}
                >
                  {introTag}
                </motion.p>
              )}

              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 backdrop-blur-md"
                style={{
                  borderColor: `${theme.accent}55`,
                  background: `${theme.accent}18`,
                }}
              >
                <svg
                  className="ml-1 h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: theme.accent }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xs uppercase tracking-[0.3em] text-white/60"
              >
                Tap to begin
              </motion.p>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Intro card ─── */}
      <AnimatePresence>
        {state === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-8 text-center"
          >
            {introTag && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className={`mb-5 text-[11px] uppercase tracking-[0.4em] ${theme.introTagClassName ?? "text-white/60"}`}
              >
                {introTag}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className={theme.titleClassName}
            >
              {title}
            </motion.h1>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className={`mt-6 max-w-sm whitespace-pre-line ${theme.messageClassName}`}
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Outro with photo mosaic ─── */}
      <AnimatePresence>
        {state === "ended" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center px-8 text-center ${theme.outroClassName ?? ""}`}
          >
            {/* Photo mosaic behind */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                <div
                  className="slideshow-mosaic-grid"
                  style={
                    {
                      "--mosaic-count": Math.min(images.length, 6),
                    } as React.CSSProperties
                  }
                >
                  {images.slice(0, 6).map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: (i % 2 === 0 ? 1 : -1) * (3 + (i % 3) * 2),
                      }}
                      transition={{
                        delay: 0.15 + i * 0.08,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="slideshow-mosaic-item overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </motion.div>
                  ))}
                </div>
                {/* Scrim over mosaic for text readability */}
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]" />
              </motion.div>
            )}

            {/* Title + replay */}
            <div className="relative z-20 flex flex-col items-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className={theme.titleClassName}
                style={{ fontSize: "clamp(1.75rem, 6vw, 2.5rem)" }}
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-3 text-xs uppercase tracking-[0.4em] text-white/60"
              >
                {signature ?? "Made on TACTUS"}
              </motion.p>
              <motion.button
                type="button"
                onClick={replay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-10 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-white transition hover:scale-105 active:scale-95"
                style={{
                  borderColor: `${theme.accent}55`,
                  background: `${theme.accent}22`,
                }}
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 14-4l2 2M20 14a8 8 0 0 1-14 4l-2-2"
                  />
                </svg>
                Replay
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
