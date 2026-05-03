"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export function QRSection({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${slug}`
      : `https://tactus.ph/p/${slug}`;

  const download = () => {
    // Find the canvas rendered by QRCodeCanvas
    const canvas = document.getElementById(`qr-${slug}`) as HTMLCanvasElement | null;
    if (!canvas) return;

    // Draw onto a padded canvas for clean print output
    const pad = 40;
    const size = canvas.width;
    const out = document.createElement("canvas");
    out.width = size + pad * 2;
    out.height = size + pad * 2;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, pad, pad);

    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = `tactus-qr-${slug}.png`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          QR Code
        </h2>
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/30">NFC fallback + print</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* QR display */}
        <div className="rounded-2xl border border-white/10 bg-white p-4 shrink-0">
          <QRCodeCanvas
            id={`qr-${slug}`}
            value={`https://tactus.ph/p/${slug}`}
            size={180}
            bgColor="#ffffff"
            fgColor="#0a0a0a"
            level="M"
            marginSize={1}
          />
        </div>

        {/* Info + actions */}
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1">Link</p>
            <p className="font-mono text-xs text-white/60 break-all">tactus.ph/p/{slug}</p>
          </div>

          <p className="text-[12px] text-white/40 leading-relaxed">
            Print this alongside the NFC chip on the keychain. Customers without NFC can scan to open the same experience.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={download}
              className="rounded-full bg-white px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-white/90 active:scale-95"
            >
              Download PNG
            </button>
            <a
              href={`/p/${slug}`}
              target="_blank"
              className="rounded-full border border-white/20 px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Open Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
