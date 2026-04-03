"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";

// Track data map – extend this for more tracks or fetch from an API
const SPOTIFY_WEB_BASE = "https://open.spotify.com/track/";
const SPOTIFY_DEEP_LINK_BASE = "spotify:track:";

// Fallback timeout – how long to wait before assuming the deep link failed
const DEEP_LINK_TIMEOUT = 2500;

export default function PlayPage() {
  const params = useParams();
  const trackId = params.trackId as string;
  const [splashComplete, setSplashComplete] = useState(false);
  const redirectAttempted = useRef(false);

  const handleRedirect = useCallback(() => {
    if (redirectAttempted.current) return;
    redirectAttempted.current = true;

    const deepLink = `${SPOTIFY_DEEP_LINK_BASE}${trackId}`;
    const webFallback = `${SPOTIFY_WEB_BASE}${trackId}`;

    // Track if the page becomes hidden (app opened successfully)
    let appOpened = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Attempt deep link
    window.location.href = deepLink;

    // Fallback: if the page is still visible after timeout, redirect to web
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (!appOpened && !document.hidden) {
        window.location.href = webFallback;
      }
    }, DEEP_LINK_TIMEOUT);
  }, [trackId]);

  const handleSplashComplete = useCallback(() => {
    setSplashComplete(true);
  }, []);

  useEffect(() => {
    if (splashComplete) {
      handleRedirect();
    }
  }, [splashComplete, handleRedirect]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-tactus-black">
      <SplashScreen onComplete={handleSplashComplete} duration={1500} />

      {/* Post-splash fallback state (shown briefly if redirect takes time) */}
      {splashComplete && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <h1
            className="text-4xl font-black tracking-[0.2em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TACTUS
          </h1>
          <p className="text-sm text-tactus-muted">
            Opening Spotify…
          </p>
          <div className="tactus-spinner" />

          {/* Manual fallback link */}
          <a
            href={`${SPOTIFY_WEB_BASE}${trackId}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Open in Spotify
          </a>
        </div>
      )}
    </main>
  );
}
