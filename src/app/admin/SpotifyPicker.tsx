"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { searchSpotifyAction, resolveSpotifyAction, uploadMusicAction } from "./actions";
import type { SpotifyTrack } from "@/lib/spotify";

type Props = {
  slug?: string;
  defaultValue?: string | null;
};

function isSpotifyUrl(val: string) {
  return val.includes("spotify.com/track/") || val.startsWith("spotify:track:");
}

export function SpotifyPicker({ slug, defaultValue }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [selected, setSelected] = useState<SpotifyTrack | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultValue ?? "");
  const [noPreview, setNoPreview] = useState(false);
  const [directUrl, setDirectUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"spotify" | "direct" | "upload">("spotify");
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue) setPreviewUrl(defaultValue);
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !slug) return;
    setUploadError(null);
    setUploadDone(false);
    const formData = new FormData();
    formData.append("music", file);
    startUpload(async () => {
      const result = await uploadMusicAction(slug, {}, formData);
      if (result.error) { setUploadError(result.error); return; }
      if (result.url) {
        setPreviewUrl(result.url);
        setUploadDone(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const search = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }

    if (isSpotifyUrl(q)) {
      debounceRef.current = setTimeout(() => {
        startTransition(async () => {
          const { track, error } = await resolveSpotifyAction(q);
          if (error || !track) return;
          selectTrack(track);
        });
      }, 400);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const tracks = await searchSpotifyAction(q);
        setResults(tracks);
        setOpen(tracks.length > 0);
      });
    }, 400);
  };

  const selectTrack = (track: SpotifyTrack) => {
    setSelected(track);
    setResults([]);
    setOpen(false);
    setQuery(`${track.name} — ${track.artists}`);
    if (track.previewUrl) {
      setPreviewUrl(track.previewUrl);
      setNoPreview(false);
    } else {
      setPreviewUrl("");
      setNoPreview(true);
    }
  };

  const clear = () => {
    setSelected(null); setPreviewUrl(""); setQuery("");
    setResults([]); setOpen(false); setNoPreview(false);
    stopPreview();
  };

  const stopPreview = () => {
    audioRef.current?.pause(); audioRef.current = null; setPlaying(false);
  };

  const togglePreview = (url: string) => {
    if (playing) { stopPreview(); return; }
    const audio = new Audio(url);
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audio.onended = () => setPlaying(false);
    audioRef.current = audio;
    setPlaying(true);
  };

  const PlayBtn = ({ url }: { url: string }) => (
    <button type="button" onClick={() => togglePreview(url)}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 hover:text-white transition active:scale-90">
      {playing
        ? <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
        : <svg className="h-3 w-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      }
    </button>
  );

  return (
    <div className="space-y-3">
      <input type="hidden" name="music_url" value={previewUrl} />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1 w-fit">
        {(["spotify", "direct", "upload"] as const).map((t) => (
          <button key={t} type="button"
            onClick={() => { setTab(t); stopPreview(); }}
            className={`px-3 py-1 rounded-md text-[11px] uppercase tracking-[0.2em] transition ${tab === t ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
            {t === "upload" ? "Upload MP3" : t === "direct" ? "Direct URL" : "Spotify"}
          </button>
        ))}
      </div>

      {/* ── Spotify tab ── */}
      {tab === "spotify" && (
        <div className="space-y-2">
          <div className="relative">
            <input type="text" value={query} onChange={(e) => search(e.target.value)}
              placeholder="Search song or paste Spotify link…"
              autoComplete="off" className="input pr-10" />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="tactus-spinner" style={{ width: 16, height: 16 }} />
              </div>
            )}
            {selected && !isPending && (
              <button type="button" onClick={clear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition">✕</button>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden shadow-2xl">
              {results.map((t) => (
                <button key={t.id} type="button" onClick={() => selectTrack(t)}
                  className="flex w-full items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition text-left">
                  {t.albumArt && <img src={t.albumArt} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{t.name}</p>
                    <p className="text-[11px] text-white/40 truncate">{t.artists}</p>
                  </div>
                  <span className={`text-[10px] shrink-0 ${t.previewUrl ? "text-emerald-400/60" : "text-white/25"}`}>
                    {t.previewUrl ? "30s preview" : "no preview"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selected && !noPreview && previewUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              {selected.albumArt && <img src={selected.albumArt} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{selected.name}</p>
                <p className="text-[11px] text-white/50 truncate">{selected.artists}</p>
                <p className="text-[10px] text-emerald-400/70 mt-0.5">30s preview ready</p>
              </div>
              <PlayBtn url={previewUrl} />
            </div>
          )}

          {selected && noPreview && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 space-y-2">
              <p className="text-[11px] text-amber-400">
                No Spotify preview for this track — upload an MP3 or paste a direct link instead.
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTab("upload")}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] text-white/70 hover:text-white transition">
                  Upload MP3
                </button>
                <button type="button" onClick={() => setTab("direct")}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] text-white/70 hover:text-white transition">
                  Direct URL
                </button>
              </div>
            </div>
          )}

          {!selected && (
            <p className="text-[11px] text-white/30">Search by song/artist or paste a Spotify track link.</p>
          )}
        </div>
      )}

      {/* ── Direct URL tab ── */}
      {tab === "direct" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="url" value={directUrl}
              onChange={(e) => { setDirectUrl(e.target.value); setPreviewUrl(e.target.value.trim()); }}
              placeholder="https://… (.mp3, .m4a, Dropbox, Drive)"
              className="input flex-1" />
            {directUrl && <PlayBtn url={directUrl} />}
          </div>
          {directUrl && <p className="text-[11px] text-emerald-400/80">URL set ✓</p>}
          <p className="text-[11px] text-white/30">
            Dropbox: change <code className="text-white/50">dl=0</code> → <code className="text-white/50">dl=1</code>. Google Drive: use direct download link.
          </p>
        </div>
      )}

      {/* ── Upload MP3 tab ── */}
      {tab === "upload" && (
        <div className="space-y-2">
          {!slug ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-5 text-center">
              <p className="text-[12px] text-white/50">Create the customer first, then upload music from the edit page.</p>
            </div>
          ) : (
            <>
              {uploadError && <p className="text-[11px] text-rose-400">{uploadError}</p>}
              {uploadDone && previewUrl && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
                  <div className="flex-1">
                    <p className="text-[11px] text-emerald-400">Uploaded ✓</p>
                    <p className="text-[10px] text-white/30 truncate">{previewUrl}</p>
                  </div>
                  <PlayBtn url={previewUrl} />
                </div>
              )}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <input ref={fileInputRef} type="file" name="music-upload"
                  accept="audio/mpeg,audio/mp4,audio/m4a,audio/ogg,audio/wav,.mp3,.m4a,.ogg,.wav"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="flex-1 text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:uppercase file:tracking-[0.2em] file:text-white hover:file:bg-white/20 disabled:opacity-40" />
                {isUploading && <div className="tactus-spinner shrink-0" style={{ width: 18, height: 18 }} />}
              </div>
              <p className="text-[11px] text-white/30">Max 12MB. MP3, M4A, OGG, WAV. Auto-saves on select.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
