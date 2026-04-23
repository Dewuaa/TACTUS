"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import Link from "next/link";
import type { ARExperienceConfig } from "@/lib/arExperiences";

type ARState = "intro" | "loading" | "active";

const registerGestureComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AFRAME = (window as any).AFRAME;
  if (!AFRAME || AFRAME.components["gesture-handler"]) return;

  AFRAME.registerComponent("gesture-handler", {
    schema: {
      rotationFactor: { type: "number", default: 5 },
      scaleFactor: { type: "number", default: 0.01 },
      minScale: { type: "number", default: 0.5 },
      maxScale: { type: "number", default: 3 },
    },

    init: function () {
      this.handleRotation = this.handleRotation.bind(this);
      this.handleScale = this.handleScale.bind(this);
      this.initialScale = this.el.object3D.scale.clone();
      this.scaleFactor = 1;

      this.touchStartX = 0;
      this.touchStartY = 0;
      this.initialPinchDistance = 0;

      this.el.sceneEl?.addEventListener("touchstart", (e: TouchEvent) => {
        if (e.touches.length === 1) {
          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          this.initialPinchDistance = this.getPinchDistance(e);
        }
      });

      this.el.sceneEl?.addEventListener("touchmove", (e: TouchEvent) => {
        if (e.touches.length === 1) {
          this.handleRotation(e);
        } else if (e.touches.length === 2) {
          this.handleScale(e);
        }
      });
    },

    getPinchDistance: function (e: TouchEvent): number {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },

    handleRotation: function (e: TouchEvent) {
      const deltaX = e.touches[0].clientX - this.touchStartX;
      const deltaY = e.touches[0].clientY - this.touchStartY;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      const rotation = this.el.getAttribute("rotation") as {
        x: number;
        y: number;
        z: number;
      };
      this.el.setAttribute("rotation", {
        x: rotation.x - deltaY * this.data.rotationFactor * 0.1,
        y: rotation.y + deltaX * this.data.rotationFactor * 0.1,
        z: rotation.z,
      });
    },

    handleScale: function (e: TouchEvent) {
      const currentDistance = this.getPinchDistance(e);
      const delta = currentDistance - this.initialPinchDistance;
      this.initialPinchDistance = currentDistance;

      this.scaleFactor += delta * this.data.scaleFactor * 0.01;
      this.scaleFactor = Math.max(
        this.data.minScale,
        Math.min(this.data.maxScale, this.scaleFactor),
      );

      this.el.object3D.scale.set(
        this.initialScale.x * this.scaleFactor,
        this.initialScale.y * this.scaleFactor,
        this.initialScale.z * this.scaleFactor,
      );
    },
  });
};

export function ARExperience({ config }: { config: ARExperienceConfig }) {
  const [arState, setARState] = useState<ARState>("intro");
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetFound, setTargetFound] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const sceneCreatedRef = useRef(false);

  const hasAudio = !!config.audio;
  const autoPlayAudio = !!config.audio?.autoPlayOnTarget;

  useEffect(() => {
    if (!config.audio) return;
    const audio = new Audio(config.audio.src);
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [config.audio]);

  useEffect(() => {
    if (!autoPlayAudio) return;
    if (targetFound && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio autoplay blocked:", err));
    }
  }, [targetFound, isPlaying, autoPlayAudio]);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.warn);
    }
  }, [isPlaying]);

  const exitAR = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setARState("intro");
    setTargetFound(false);
    sceneCreatedRef.current = false;

    if (sceneContainerRef.current) {
      sceneContainerRef.current.innerHTML = "";
    }

    document.querySelectorAll("video").forEach((video) => {
      const stream = video.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
    });
  }, []);

  const launchScene = useCallback(() => {
    if (sceneCreatedRef.current) return;
    sceneCreatedRef.current = true;
    setARState("loading");

    setTimeout(() => {
      if (!sceneContainerRef.current) return;
      registerGestureComponent();

      const sceneEl = document.createElement("a-scene");
      sceneEl.setAttribute(
        "mindar-image",
        `imageTargetSrc: ${config.targetSrc}; autoStart: true; uiLoading: no; uiError: no; uiScan: no; filterMinCF: 0.001; filterBeta: 10;`,
      );
      sceneEl.setAttribute("color-space", "sRGB");
      sceneEl.setAttribute(
        "renderer",
        "colorManagement: true; physicallyCorrectLights: true;",
      );
      sceneEl.setAttribute("vr-mode-ui", "enabled: false");
      sceneEl.setAttribute("device-orientation-permission-ui", "enabled: false");

      const cameraEl = document.createElement("a-camera");
      cameraEl.setAttribute("position", "0 0 0");
      cameraEl.setAttribute("look-controls", "enabled: false");
      sceneEl.appendChild(cameraEl);

      const targetEl = document.createElement("a-entity");
      targetEl.setAttribute("mindar-image-target", "targetIndex: 0");

      const model = document.createElement("a-entity");
      model.setAttribute("gltf-model", `url(${config.model.src})`);
      model.setAttribute("position", config.model.position);
      model.setAttribute("rotation", "0 0 0");
      model.setAttribute("scale", config.model.scale);
      model.setAttribute("animation-mixer", "loop: repeat");
      model.setAttribute(
        "gesture-handler",
        "rotationFactor: 4; scaleFactor: 0.8; minScale: 0.3; maxScale: 2.5",
      );

      if (config.model.hover) {
        const { from, to, duration } = config.model.hover;
        model.setAttribute(
          "animation__hover",
          `property: position; dir: alternate; from: ${from}; to: ${to}; dur: ${duration}; loop: true; easing: easeInOutQuad`,
        );
      }

      if (config.model.autoRotate) {
        model.setAttribute(
          "animation__rotate",
          `property: rotation; from: 0 0 0; to: 0 360 0; dur: ${config.model.autoRotate.duration}; loop: true; easing: linear`,
        );
      }

      targetEl.appendChild(model);

      config.sceneText?.forEach((label) => {
        const textEl = document.createElement("a-text");
        textEl.setAttribute("value", label.value);
        textEl.setAttribute("color", label.color);
        textEl.setAttribute("align", "center");
        textEl.setAttribute("position", label.position);
        textEl.setAttribute("scale", label.scale);
        textEl.setAttribute("font", "monoid");
        targetEl.appendChild(textEl);
      });

      sceneEl.appendChild(targetEl);
      sceneContainerRef.current.appendChild(sceneEl);

      const forceFullscreen = (el: HTMLElement) => {
        el.style.cssText =
          "position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100dvh!important;object-fit:cover!important;";
      };

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.tagName === "VIDEO" || node.tagName === "CANVAS") {
                forceFullscreen(node);
              }
              node.querySelectorAll?.("video, canvas")?.forEach((child) => {
                forceFullscreen(child as HTMLElement);
              });
            }
          });
        }
      });

      observer.observe(sceneContainerRef.current!, {
        childList: true,
        subtree: true,
      });

      let checks = 0;
      const interval = setInterval(() => {
        sceneContainerRef.current
          ?.querySelectorAll("video, canvas")
          .forEach((el) => forceFullscreen(el as HTMLElement));
        checks++;
        if (checks >= 6) {
          clearInterval(interval);
          observer.disconnect();
        }
      }, 500);

      targetEl.addEventListener("targetFound", () => {
        setTargetFound(true);
        setARState("active");
      });

      targetEl.addEventListener("targetLost", () => {
        setTargetFound(false);
      });

      sceneEl.addEventListener("arReady", () => {
        setARState("active");
      });

      setTimeout(() => {
        setARState((prev) => (prev === "loading" ? "active" : prev));
      }, 5000);
    }, 300);
  }, [config]);

  const startAR = useCallback(() => {
    if (!scriptsLoaded) {
      setARState("loading");
      return;
    }
    launchScene();
  }, [scriptsLoaded, launchScene]);

  useEffect(() => {
    if (scriptsLoaded && arState === "loading") {
      launchScene();
    }
  }, [scriptsLoaded, arState, launchScene]);

  const accent = config.accentColor;

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.6.0/aframe.min.js"
        strategy="lazyOnload"
        onLoad={() => setAframeLoaded(true)}
      />
      {aframeLoaded && (
        <>
          <Script
            src="https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.0.0/dist/aframe-extras.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
            strategy="lazyOnload"
            onLoad={() => setScriptsLoaded(true)}
          />
        </>
      )}

      <AnimatePresence>
        {arState === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-tactus-black px-8"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${accent}10 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-shimmer text-5xl font-black tracking-[0.2em]"
                style={{ fontFamily: "var(--font-display)", color: accent }}
              >
                {config.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="whitespace-pre-line text-sm leading-relaxed text-tactus-muted"
              >
                {config.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="pulse-glow flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
              >
                <svg
                  className="h-8 w-8 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                onClick={startAR}
                id="enable-camera-btn"
                className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] active:scale-95"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Enable Camera for AR</span>
              </motion.button>
            </div>

            <div className="absolute bottom-6 flex flex-col items-center gap-3">
              <Link
                href="/"
                className="text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 rounded-full px-4 py-1.5 transition-all hover:text-white/50 hover:border-white/20"
              >
                Explore Collection →
              </Link>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/15">
                TACTUS AR
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arState === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-tactus-black/90 backdrop-blur-sm"
          >
            <div className="tactus-spinner mb-6" />
            <p
              className="text-lg font-bold tracking-[0.2em] text-white/80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              INITIALIZING
            </p>
            <p className="mt-2 text-xs text-tactus-muted">
              Setting up camera & AR engine…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={sceneContainerRef}
        className="ar-scene-container fixed inset-0 z-40"
      />

      <AnimatePresence>
        {arState === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="mb-3 flex justify-center">
              {!targetFound ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md"
                >
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Scanning…
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <p
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: `${accent}cc` }}
                  >
                    {config.lockedLabel}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="mx-auto flex max-w-xs items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3.5 backdrop-blur-xl">
              <div className="flex-1 min-w-0">
                <p
                  className="truncate text-sm font-bold tracking-wide text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {config.title}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                  {config.activeTagline}
                </p>
              </div>

              {hasAudio && (
                <button
                  onClick={toggleAudio}
                  id="ar-play-pause-btn"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-90"
                  style={{ backgroundColor: accent }}
                >
                  {isPlaying ? (
                    <svg
                      className="h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="ml-0.5 h-5 w-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={exitAR}
                id="ar-exit-btn"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition-all duration-200 active:scale-90"
              >
                <svg
                  className="h-4 w-4 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
