"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BirthdayTemplate } from "@/lib/templates/birthday";
import { LoveTemplate } from "@/lib/templates/love";
import { FriendshipTemplate } from "@/lib/templates/friendship";
import { AnniversaryTemplate } from "@/lib/templates/anniversary";
import { GraduationTemplate } from "@/lib/templates/graduation";

const DEMOS = [
  {
    id: "love",
    label: "Love",
    sub: "For the one who has your whole heart",
    accent: "#e8637a",
    from: "#520820",
    to: "#020006",
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
    sub: "Make them feel like the main character",
    accent: "#FFD600",
    from: "#b83010",
    to: "#0a0018",
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
    sub: "For the one who knows all your secrets",
    accent: "#FFD700",
    from: "#2d0f7a",
    to: "#020010",
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
    sub: "Celebrate everything you've built together",
    accent: "#D4A017",
    from: "#3d2200",
    to: "#050301",
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
    sub: "They earned every second of this moment",
    accent: "#C8A000",
    from: "#0d1f3c",
    to: "#02040c",
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
  const [hovered, setHovered] = useState<string | null>(null);

  const activeDemo = DEMOS.find((d) => d.id === active);

  return (
    <>
      {/* ── SLIDESHOW VIEW ── */}
      <AnimatePresence>
        {active && activeDemo && (
          <motion.div
            key="slideshow"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50"
          >
            {(() => {
              const Template = COMPONENTS[active as keyof typeof COMPONENTS];
              return <Template customer={activeDemo.customer} images={activeDemo.images} />;
            })()}

            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setActive(null)}
              className="pointer-events-auto fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-[999] flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur-xl transition hover:border-white/40 hover:text-white active:scale-95"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PICKER VIEW ── */}
      <AnimatePresence>
        {!active && (
          <motion.main
            key="picker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="relative min-h-dvh overflow-hidden bg-[#060608]"
          >
            {/* Ambient background — shifts with hover */}
            <motion.div
              className="pointer-events-none fixed inset-0 z-0"
              animate={{
                background: hovered
                  ? `radial-gradient(ellipse at 60% 40%, ${DEMOS.find(d => d.id === hovered)?.from}88 0%, transparent 65%)`
                  : "radial-gradient(ellipse at 60% 40%, #1a0a2888 0%, transparent 65%)",
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Noise grain */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "180px" }}
            />

            <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-10">

              {/* Back to home */}
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Link href="/"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/30 transition hover:text-white/60">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Home
                </Link>
              </motion.div>

              {/* Header */}
              <div className="mt-10 mb-8">
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3"
                >
                  TACTUS · Live Demo
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(2.4rem,10vw,3.5rem)] font-black leading-[0.92] tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  CHOOSE
                  <br />
                  <span className="text-white/25">YOUR VIBE.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-4 text-sm text-white/35 leading-relaxed"
                >
                  Tap any template to see exactly what your recipient experiences when they tap the keychain.
                </motion.p>
              </div>

              {/* Template cards */}
              <div className="flex flex-col gap-3 flex-1">
                {DEMOS.map((d, i) => (
                  <motion.button
                    key={d.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActive(d.id)}
                    onHoverStart={() => setHovered(d.id)}
                    onHoverEnd={() => setHovered(null)}
                    whileTap={{ scale: 0.975 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] text-left transition-colors duration-300"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    {/* Color swatch strip */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                      style={{ background: `linear-gradient(to bottom, ${d.accent}, ${d.from})` }}
                      animate={{ opacity: hovered === d.id ? 1 : 0.5 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: `radial-gradient(ellipse at 20% 50%, ${d.accent}12, transparent 60%)` }}
                      animate={{ opacity: hovered === d.id ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="relative flex items-center gap-4 px-5 py-4">
                      {/* Mini color orb */}
                      <motion.div
                        className="h-10 w-10 shrink-0 rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${d.accent}60, ${d.from}80)`, border: `1px solid ${d.accent}30` }}
                        animate={{ scale: hovered === d.id ? 1.08 : 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-black text-white text-sm tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                          {d.label.toUpperCase()}
                        </p>
                        <p className="text-[11px] text-white/40 mt-0.5 truncate">{d.sub}</p>
                      </div>

                      {/* Play arrow */}
                      <motion.div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${d.accent}22`, border: `1px solid ${d.accent}40` }}
                        animate={{ scale: hovered === d.id ? 1.12 : 1, x: hovered === d.id ? 2 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <svg className="h-3 w-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ color: d.accent }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-8 text-center text-[10px] text-white/20 tracking-widest uppercase"
              >
                No account needed · tap to experience
              </motion.p>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
