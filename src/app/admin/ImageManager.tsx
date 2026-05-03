"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { CustomerImage } from "@/lib/db/types";
import {
  addImagesAction,
  deleteImageAction,
  updateCaptionAction,
  type ActionState,
} from "./actions";

const initial: ActionState = {};

function UploadButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="rounded-full bg-white px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Uploading..." : "Upload"}
    </button>
  );
}

function CaptionInput({
  img,
  slug,
}: {
  img: CustomerImage;
  slug: string;
}) {
  const [value, setValue] = useState(img.caption ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = (caption: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        await updateCaptionAction(slug, img.id, caption.trim() || null);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      });
    }, 600);
  };

  return (
    <div className="relative mt-2">
      <input
        type="text"
        value={value}
        placeholder="Add caption…"
        maxLength={80}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
          save(e.target.value);
        }}
        className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/80 placeholder-white/25 outline-none focus:border-white/25 focus:bg-white/[0.08] transition"
      />
      {isPending && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white/30">
          saving…
        </span>
      )}
      {saved && !isPending && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400/80">
          ✓
        </span>
      )}
    </div>
  );
}

type Props = {
  slug: string;
  images: CustomerImage[];
  limit: number;
};

export function ImageManager({ slug, images, limit }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const action = addImagesAction.bind(null, slug);
  const [state, formAction] = useActionState(action, initial);

  const remaining = limit - images.length;
  const full = remaining <= 0;

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2
          className="text-xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Images
        </h2>
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">
          {images.length} / {limit}
        </span>
      </div>

      {state?.error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      )}

      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img, i) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-black"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.url}
                  alt={`Image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                    #{i + 1}
                  </span>
                  <form
                    action={async () => {
                      await deleteImageAction(slug, img.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:bg-rose-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <div className="px-3 pb-3 pt-1">
                <CaptionInput img={img} slug={slug} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-10 text-center text-sm text-white/50">
          No images yet.
        </div>
      )}

      <form
        action={formAction}
        className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={full}
            className="block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[11px] file:font-medium file:uppercase file:tracking-[0.25em] file:text-white hover:file:bg-white/20 disabled:opacity-40"
          />
          <p className="mt-2 text-[11px] text-white/40">
            {full
              ? "Limit reached. Raise the image limit to add more."
              : `You can add ${remaining} more. Max 8MB each. JPEG / PNG / WebP / GIF.`}
          </p>
        </div>
        <UploadButton disabled={full} />
      </form>
    </div>
  );
}
