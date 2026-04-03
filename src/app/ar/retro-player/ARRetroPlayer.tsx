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

      // 3D model anchored to target
      const modelEl = document.createElement("a-gltf-model");
      modelEl.setAttribute("src", "/models/boombox.glb");
      modelEl.setAttribute("position", "0 0 0");
      modelEl.setAttribute("rotation", "0 0 0");
      modelEl.setAttribute("scale", "0.15 0.15 0.15");
      targetEl.appendChild(modelEl);

      sceneEl.appendChild(targetEl);

      sceneContainerRef.current.appendChild(sceneEl);

      // Listen for events
      targetEl.addEventListener("targetFound", () => {
        setTargetFound(true);
        setARState("active");
      });

      targetEl.addEventListener("targetLost", () => {
        setTargetFound(false);
      });

      // Scene loaded
      sceneEl.addEventListener("arReady", () => {
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
      {/* External Scripts – load A-Frame then MindAR */}
      <Script
        src="https://aframe.io/releases/1.6.0/aframe.min.js"
        strategy="lazyOnload"
        onLoad={() => setAframeLoaded(true)}
      />
      {aframeLoaded && (
        <Script
          src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
          strategy="lazyOnload"
          onLoad={() => setScriptsLoaded(true)}
        />
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
      <div ref={sceneContainerRef} className="fixed inset-0 z-40" />

      {/* ===== AR CONTROLS OVERLAY ===== */}
      <AnimatePresence>
        {arState === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="ar-controls"
          >
            {/* Scanning indicator */}
            {!targetFound && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 flex items-center justify-center gap-2"
              >
                <div className="h-2 w-2 animate-pulse rounded-full bg-white/40" />
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Scanning for target…
                </p>
              </motion.div>
            )}

            {/* Target found indicator */}
            {targetFound && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 flex items-center justify-center gap-2"
              >
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <p className="text-xs uppercase tracking-[0.2em] text-green-400/80">
                  Target Locked
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Play / Pause */}
              <button
                onClick={toggleAudio}
                id="ar-play-pause-btn"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-md transition-all duration-200 active:scale-90 hover:bg-white/[0.12]"
              >
                {isPlaying ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="ml-0.5 h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Exit AR */}
              <button
                onClick={exitAR}
                id="ar-exit-btn"
                className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 backdrop-blur-md transition-all duration-200 active:scale-95 hover:bg-white/[0.08]"
              >
                <svg
                  className="h-4 w-4 text-white/70"
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
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                  Exit AR
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
