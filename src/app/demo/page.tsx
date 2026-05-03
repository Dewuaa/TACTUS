"use client";

import { useState } from "react";
import { BirthdayTemplate } from "@/lib/templates/birthday";
import { LoveTemplate } from "@/lib/templates/love";
import { FriendshipTemplate } from "@/lib/templates/friendship";
import { AnniversaryTemplate } from "@/lib/templates/anniversary";
import { GraduationTemplate } from "@/lib/templates/graduation";

const DEMOS = [
  {
    id: "love",
    label: "Love",
    customer: {
      id: "demo", slug: "demo", template_id: "love",
      recipient_name: "Sofia",
      message: "Every moment with you is my favorite place to be.",
      music_url: null, image_limit: 3, created_at: "",
    },
    images: [
      { id: "1", customer_id: "demo", storage_path: "", order_index: 0, caption: "The day we met", url: "/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png" },
      { id: "2", customer_id: "demo", storage_path: "", order_index: 1, caption: "Our favorite song", url: "/products/Gemini_Generated_Image_btalaybtalaybtal.png" },
      { id: "3", customer_id: "demo", storage_path: "", order_index: 2, caption: "Forever starts here", url: "/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png" },
    ],
  },
  {
    id: "birthday",
    label: "Birthday",
    customer: {
      id: "demo", slug: "demo", template_id: "birthday",
      recipient_name: "Ate Bea",
      message: "Happy birthday to the person who makes every room brighter. 🎂",
      music_url: null, image_limit: 3, created_at: "",
    },
    images: [
      { id: "1", customer_id: "demo", storage_path: "", order_index: 0, caption: "Since day one", url: "/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png" },
      { id: "2", customer_id: "demo", storage_path: "", order_index: 1, caption: "Best memories", url: "/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png" },
      { id: "3", customer_id: "demo", storage_path: "", order_index: 2, caption: "Here's to you", url: "/products/Gemini_Generated_Image_btalaybtalaybtal.png" },
    ],
  },
  {
    id: "friendship",
    label: "Friendship",
    customer: {
      id: "demo", slug: "demo", template_id: "friendship",
      recipient_name: "My Person",
      message: "No matter where life takes us, you're always home to me.",
      music_url: null, image_limit: 3, created_at: "",
    },
    images: [
      { id: "1", customer_id: "demo", storage_path: "", order_index: 0, caption: "Us against the world", url: "/products/Gemini_Generated_Image_n5qp56n5qp56n5qp.png" },
      { id: "2", customer_id: "demo", storage_path: "", order_index: 1, caption: "Every laugh counts", url: "/products/Gemini_Generated_Image_btalaybtalaybtal.png" },
      { id: "3", customer_id: "demo", storage_path: "", order_index: 2, caption: "Always & forever", url: "/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png" },
    ],
  },
  {
    id: "anniversary",
    label: "Anniversary",
    customer: {
      id: "demo", slug: "demo", template_id: "anniversary",
      recipient_name: "My Love",
      message: "Years go by but this feeling never does.",
      music_url: null, image_limit: 3, created_at: "",
    },
    images: [
      { id: "1", customer_id: "demo", storage_path: "", order_index: 0, caption: "Year one", url: "/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png" },
      { id: "2", customer_id: "demo", storage_path: "", order_index: 1, caption: "Still my favorite", url: "/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png" },
      { id: "3", customer_id: "demo", storage_path: "", order_index: 2, caption: "Here's to more", url: "/products/Gemini_Generated_Image_btalaybtalaybtal.png" },
    ],
  },
  {
    id: "graduation",
    label: "Graduation",
    customer: {
      id: "demo", slug: "demo", template_id: "graduation",
      recipient_name: "Isko",
      message: "You did it. Everything you sacrificed was worth it.",
      music_url: null, image_limit: 3, created_at: "",
    },
    images: [
      { id: "1", customer_id: "demo", storage_path: "", order_index: 0, caption: "The journey begins", url: "/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png" },
      { id: "2", customer_id: "demo", storage_path: "", order_index: 1, caption: "Late nights paid off", url: "/products/Gemini_Generated_Image_n5qp56n5qp56n5qp.png" },
      { id: "3", customer_id: "demo", storage_path: "", order_index: 2, caption: "Congratulations 🎓", url: "/products/Gemini_Generated_Image_btalaybtalaybtal.png" },
    ],
  },
];

const COMPONENTS = {
  love: LoveTemplate,
  birthday: BirthdayTemplate,
  friendship: FriendshipTemplate,
  anniversary: AnniversaryTemplate,
  graduation: GraduationTemplate,
} as const;

export default function DemoPage() {
  const [active, setActive] = useState<string | null>(null);

  if (active) {
    const demo = DEMOS.find((d) => d.id === active)!;
    const Template = COMPONENTS[active as keyof typeof COMPONENTS];
    return (
      <div className="fixed inset-0">
        <Template customer={demo.customer} images={demo.images} />
        {/* Back button */}
        <button
          onClick={() => setActive(null)}
          className="pointer-events-auto fixed top-4 left-4 z-[999] rounded-full border border-white/20 bg-black/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-md transition hover:text-white"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-[#080808] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-3">TACTUS</p>
          <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Pick a Template
          </h1>
          <p className="mt-3 text-sm text-white/40">See exactly what your recipient will experience.</p>
        </div>

        <div className="space-y-3">
          {DEMOS.map((d) => (
            <button key={d.id} onClick={() => setActive(d.id)}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98]">
              <div>
                <p className="font-bold text-white text-sm">{d.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5 truncate max-w-[220px]">{d.customer.message}</p>
              </div>
              <svg className="h-4 w-4 text-white/30 group-hover:text-white/60 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-[10px] text-white/20">No account needed. Tap any template to preview.</p>
      </div>
    </main>
  );
}
