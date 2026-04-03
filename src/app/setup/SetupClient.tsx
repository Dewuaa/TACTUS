"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Web NFC API types since they aren't standard in TypeScript yet
declare global {
  interface Window {
    NDEFReader?: any;
  }
}

type SetupState = "idle" | "writing" | "success" | "error";

export default function SetupClient() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [trackId, setTrackId] = useState<string | null>(null);
  const [status, setStatus] = useState<SetupState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isWebNFCAvailable, setIsWebNFCAvailable] = useState<boolean | null>(null);

  // Check if Web NFC is supported on mount
  useEffect(() => {
    setIsWebNFCAvailable("NDEFReader" in window);
  }, []);

  // Extract Track ID when URL changes
  useEffect(() => {
    if (!spotifyUrl) {
      setTrackId(null);
      setStatus("idle");
      return;
    }

    // Try to extract from common Spotify URL formats
    // Example: https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=xyz
    const trackMatch = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
    
    if (trackMatch && trackMatch[1]) {
      setTrackId(trackMatch[1]);
      setStatus("idle"); // Reset status when a new valid track is found
    } else {
      setTrackId(null);
    }
  }, [spotifyUrl]);

  const handleWriteNFC = async () => {
    if (!trackId) {
      setErrorMessage("Please enter a valid Spotify track link first.");
      setStatus("error");
      return;
    }

    if (!isWebNFCAvailable) {
      // Should not reach here if button is disabled, but just as a fallback
      return;
    }

    setStatus("writing");
    setErrorMessage("");

    try {
      const ndef = new window.NDEFReader();
      
      // Request permission and start scanning
      await ndef.scan();
      
      const payloadUrl = `https://tactus-red.vercel.app/play/${trackId}`;
      
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: payloadUrl,
          },
        ],
      });
      
      setStatus("success");
      
    } catch (error: any) {
      console.error("NFC Write Error:", error);
      setStatus("error");
      setErrorMessage(
        error.name === "NotAllowedError" 
          ? "NFC permission denied. Please allow NFC access." 
          : "Failed to write to NFC tag. Bring tag closer and try again."
      );
    }
  };

  const payloadUrl = trackId ? `https://tactus-red.vercel.app/play/${trackId}` : "";

  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex flex-col items-center justify-center bg-tactus-black px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <Link href="/" className="mb-8">
          <h1 className="text-3xl font-bold tracking-widest text-[#FF6B35]" style={{ fontFamily: "var(--font-display)" }}>
            TACTUS
          </h1>
        </Link>

        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
          <h2 className="mb-2 text-xl font-semibold text-white">Program Keychain</h2>
          <p className="mb-6 text-sm text-tactus-muted">
            Paste a Spotify track link below to configure your NFC keychain.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="spotify-url" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                Spotify Link
              </label>
              <input
                id="spotify-url"
                type="text"
                placeholder="https://open.spotify.com/track/..."
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#FF6B35]/50 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/50 transition-colors duration-200"
              />
            </div>

            <AnimatePresence mode="wait">
              {trackId && (
                <motion.div
                  key="valid-track"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl bg-green-500/10 p-3 border border-green-500/20"
                >
                  <p className="text-xs text-green-400 font-medium">✓ Valid track detected</p>
                  <p className="text-[10px] text-green-400/70 truncate mt-0.5 max-w-[250px]">ID: {trackId}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              {isWebNFCAvailable ? (
                // Android / Web NFC Supported Flow
                <button
                  onClick={handleWriteNFC}
                  disabled={!trackId || status === "writing"}
                  className={`w-full rounded-xl py-3.5 text-sm font-medium transition-all duration-300 ${
                    !trackId
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : status === "writing"
                      ? "bg-[#FF6B35]/50 text-white animate-pulse"
                      : status === "success"
                      ? "bg-green-500 text-white"
                      : "bg-[#FF6B35] text-white hover:bg-[#ff8559] active:scale-[0.98]"
                  }`}
                >
                  {status === "writing" && "Ready to Write - Tap Tag Now..."}
                  {status === "success" && "✓ Programmed Successfully"}
                  {status === "error" && "Try Again"}
                  {status === "idle" && "Program NFC Tag"}
                </button>
              ) : (
                // iOS / Web NFC Not Supported Flow
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="mb-3 text-xs text-tactus-muted">
                    Your browser doesn't support Web NFC (likely iOS). Don't worry! You can use an app like <strong className="text-white">NFC Tools</strong> to program your tag.
                  </p>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-white/50">Write this URL to your tag:</p>
                    <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={payloadUrl || "Enter a Spotify link first"} 
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white/70 font-mono truncate"
                      />
                      <button 
                        disabled={!payloadUrl}
                        onClick={() => payloadUrl && navigator.clipboard.writeText(payloadUrl)}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-xs text-red-400"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
