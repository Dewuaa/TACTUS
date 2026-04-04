"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";

type ARState = "intro" | "loading" | "active" | "error";

export default function ARRetroPlayer() {
  const [arState, setARState] = useState<ARState>("intro");
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetFound, setTargetFound] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sceneContainerRef = useRef<HTMLDivElement>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/audio/track.mp3");
    audioRef.current.loop = true;
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // When target is found and audio isn't playing yet, auto-play
  useEffect(() => {
    if (targetFound && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio autoplay blocked:", err));
    }
  }, [targetFound, isPlaying]);

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

    // Clean up the scene
    if (sceneContainerRef.current) {
      sceneContainerRef.current.innerHTML = "";
    }

    // Stop camera tracks
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      const stream = video.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
  }, []);

  const startAR = useCallback(() => {
    if (!scriptsLoaded) {
      setARState("loading");
      return;
    }
    launchScene();
  }, [scriptsLoaded]);

  // Launch the A-Frame + MindAR scene
  const launchScene = useCallback(() => {
    setARState("loading");

    if (!sceneContainerRef.current) return;

    // Small delay to let the UI update show loading state
    setTimeout(() => {
      if (!sceneContainerRef.current) return;

      // Build the A-Frame scene via DOM
      const sceneEl = document.createElement("a-scene");
      sceneEl.setAttribute("mindar-image", "imageTargetSrc: /ar/targets.mind; autoStart: true; uiLoading: no; uiError: no; uiScan: no;");
      sceneEl.setAttribute("color-space", "sRGB");
      sceneEl.setAttribute("renderer", "colorManagement: true; physicallyCorrectLights: true;");
      sceneEl.setAttribute("vr-mode-ui", "enabled: false");
      sceneEl.setAttribute("device-orientation-permission-ui", "enabled: false");

      // Camera
      const cameraEl = document.createElement("a-camera");
      cameraEl.setAttribute("position", "0 0 0");
      cameraEl.setAttribute("look-controls", "enabled: false");
      sceneEl.appendChild(cameraEl);

      // Image target entity
      const targetEl = document.createElement("a-entity");
      targetEl.setAttribute("mindar-image-target", "targetIndex: 0");

      // ---- ANIMATED PHOENIX MODEL ----
      const phoenixModel = document.createElement("a-entity");
      phoenixModel.setAttribute("gltf-model", "url(/models/phoenix.glb)");
      // Position slightly up so it floats
      phoenixModel.setAttribute("position", "0 0.1 0.1");
      // Scale drastically reduced (some Sketchfab models are exported at 100x size)
      phoenixModel.setAttribute("scale", "0.015 0.015 0.015");
      // Add animation mixer to automatically play its built-in animations
      phoenixModel.setAttribute("animation-mixer", "loop: repeat");

      // Smooth entrance scale animation
      phoenixModel.setAttribute("animation__scale", "property: scale; from: 0 0 0; to: 0.015 0.015 0.015; dur: 800; easing: easeOutElastic");
      
      // Floating hover animation
      phoenixModel.setAttribute("animation__hover", "property: position; dir: alternate; from: 0 0.1 0.1; to: 0 0.15 0.1; dur: 2000; loop: true; easing: easeInOutSine");

      targetEl.appendChild(phoenixModel);

      // ---- BRAND TEXT ----
      const brandText = document.createElement("a-text");
      brandText.setAttribute("value", "TACTUS");
      brandText.setAttribute("color", "#FFFFFF");
      brandText.setAttribute("align", "center");
      brandText.setAttribute("position", "0 -0.3 0.05");
      brandText.setAttribute("scale", "0.35 0.35 0.35");
      brandText.setAttribute("font", "monoid");
      targetEl.appendChild(brandText);

      // ---- NOW PLAYING subtitle ----
      const subText = document.createElement("a-text");
      subText.setAttribute("value", "NOW PLAYING");
      subText.setAttribute("color", "#FF6B35");
      subText.setAttribute("align", "center");
      subText.setAttribute("position", "0 0.32 0.05");
      subText.setAttribute("scale", "0.2 0.2 0.2");
      subText.setAttribute("font", "monoid");
      targetEl.appendChild(subText);

      sceneEl.appendChild(targetEl);

      sceneContainerRef.current.appendChild(sceneEl);

      // ---- FORCE FULLSCREEN (safe, no infinite loop) ----
      // Only watch for NEW child elements being added, NOT style changes.
      // Use setInterval to periodically fix styles without causing loops.
      const forceFullscreen = (el: HTMLElement) => {
        el.style.cssText = "position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100dvh!important;object-fit:cover!important;";
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

      // MindAR can inject camera video/canvas as siblings of <a-scene>, so observe container.
      observer.observe(sceneContainerRef.current!, { childList: true, subtree: true });

      // Periodic check for 10 seconds, then stop
      let checks = 0;
      const interval = setInterval(() => {
        sceneContainerRef.current?.querySelectorAll("video, canvas").forEach((el) => {
          forceFullscreen(el as HTMLElement);
        });
        checks++;
        if (checks >= 20) {
          clearInterval(interval);
          observer.disconnect();
        }
      }, 500);

      // Listen for events
      targetEl.addEventListener("targetFound", () => {
        console.log("🎯 Target FOUND!");
        setTargetFound(true);
        setARState("active");
      });

      targetEl.addEventListener("targetLost", () => {
        console.log("❌ Target LOST");
        setTargetFound(false);
      });

      // Scene loaded
      sceneEl.addEventListener("arReady", () => {
        console.log("✅ AR Ready!");
        setARState("active");
      });

      // Fallback: if arReady doesn't fire, timeout to active after 5s
      setTimeout(() => {
        setARState((prev) => (prev === "loading" ? "active" : prev));
      }, 5000);
    }, 300);
  }, []);

  // When scripts are ready and user already clicked start
  useEffect(() => {
    if (scriptsLoaded && arState === "loading") {
      launchScene();
    }
  }, [scriptsLoaded, arState, launchScene]);

  return (
    <>
      {/* External Scripts – load A-Frame, Extras (for animation), then MindAR */}
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

      {/* ===== INTRO SCREEN ===== */}
      <AnimatePresence>
        {arState === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-tactus-black px-8"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              {/* Brand */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-shimmer text-5xl font-black tracking-[0.2em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                TACTUS
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm leading-relaxed text-tactus-muted"
              >
                Unlock the AR experience.
                <br />
                Point your camera at the keychain.
              </motion.p>

              {/* Camera icon */}
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

              {/* CTA Button */}
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

            {/* Bottom watermark */}
            <p className="absolute bottom-6 text-[10px] uppercase tracking-[0.3em] text-white/15">
              AR Experience
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LOADING STATE ===== */}
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

      {/* ===== AR SCENE CONTAINER ===== */}
      <div ref={sceneContainerRef} className="ar-scene-container fixed inset-0 z-40" />

      {/* ===== AR CONTROLS OVERLAY ===== */}
      <AnimatePresence>
        {arState === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            {/* Scanning / Locked status bar */}
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
                  <div className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF6B35]/80">
                    Now Playing
                  </p>
                </motion.div>
              )}
            </div>

            {/* Main controls card */}
            <div className="mx-auto flex max-w-xs items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3.5 backdrop-blur-xl">
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className="truncate text-sm font-bold tracking-wide text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  TACTUS
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                  AR Experience
                </p>
              </div>

              {/* Play / Pause */}
              <button
                onClick={toggleAudio}
                id="ar-play-pause-btn"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] transition-all duration-200 active:scale-90"
              >
                {isPlaying ? (
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="ml-0.5 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Exit */}
              <button
                onClick={exitAR}
                id="ar-exit-btn"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition-all duration-200 active:scale-90"
              >
                <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
