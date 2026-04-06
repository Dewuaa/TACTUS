"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <main className="landing-page relative min-h-dvh overflow-x-hidden bg-tactus-black">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-20 pb-32">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

        {/* Animated ring */}
        <div className="pulse-glow pointer-events-none absolute h-80 w-80 md:h-[500px] md:w-[500px] rounded-full border border-white/[0.06]" />

        {/* Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 flex flex-col items-center gap-6 text-center"
        >
          {/* Brand Mark */}
          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-shimmer text-6xl font-black tracking-[0.2em] sm:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            TACTUS
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-lg leading-relaxed text-tactus-muted sm:text-xl"
          >
            Your music & memories in a tap.<br />
            <span className="text-white/70">The next-generation smart keychain.</span>
          </motion.p>

          {/* New Hero Image - Showcasing Basic Tier */}
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-8 mb-4 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-white/5"
          >
            <div className="aspect-[4/5] relative">
               <Image 
                 src="/products/basic-keychain-1.jpg" 
                 alt="TACTUS Basic Keychain" 
                 fill 
                 className="object-cover"
                 priority
               />
               {/* Subtle gradient overlay to make it blend */}
               <div className="absolute inset-0 bg-gradient-to-t from-tactus-black/60 to-transparent" />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4 mt-2"
          >
            <a
              href="#shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-10 py-4 text-sm font-semibold uppercase tracking-wider text-tactus-black transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
            >
              Shop Collection
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white/60 transition-all duration-300 hover:border-white/20 hover:text-white"
            >
              Try AR Demo
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ===== PRODUCT TIERS (SHOP) ===== */}
      <section id="shop" className="relative px-6 py-24">
        {/* Subtle top border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">
              The Collection
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-wide text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Choose Your Experience
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto"
          >
            {/* TIER 1: TACTUS NFC */}
            <motion.div variants={fadeInUp} className="relative flex flex-col overflow-hidden rounded-3xl border border-[#FF6B35]/30 bg-gradient-to-b from-[#FF6B35]/5 to-transparent transition-all hover:border-[#FF6B35]/50">
              <div className="absolute top-4 right-4 z-10 rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                Best Seller
              </div>
              <div className="relative aspect-[4/3] w-full bg-black/50">
                <Image src="/products/pro-keychain.png" alt="TACTUS NFC Keychain" fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white/90" style={{ fontFamily: "var(--font-display)" }}>TACTUS NFC</h3>
                  <span className="rounded-full bg-[#FF6B35]/20 px-3 py-1 text-sm font-semibold text-[#FF6B35]">₱99</span>
                </div>
                <p className="mb-6 text-sm text-white/50">The original smart keychain with magic tap.</p>
                <ul className="mb-8 flex-1 space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#FF6B35]">✓</span>
                    <span><strong>Tap to play</strong> instantly via NFC</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#FF6B35]">✓</span>
                    <span>No app required – works on all phones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#FF6B35]">✓</span>
                    <span>Holographic premium packaging</span>
                  </li>
                </ul>
                <a href="https://ig.me/m/tactus" target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-[#FF6B35] py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#FF6B35]/20 transition-transform active:scale-95">
                  Order via DM
                </a>
              </div>
            </motion.div>

            {/* TIER 2: PREMIUM AR */}
            <motion.div variants={fadeInUp} className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] transition-all hover:bg-white/[0.04]">
              <div className="relative aspect-[4/3] w-full bg-black/50">
                <Image src="/products/premium-keychain.png" alt="TACTUS Premium AR" fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white/90" style={{ fontFamily: "var(--font-display)" }}>AR COLLECTOR</h3>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-semibold text-purple-400">₱199</span>
                </div>
                <p className="mb-6 text-sm text-white/50">Unlock immersive 3D AR experiences.</p>
                <ul className="mb-8 flex-1 space-y-3 text-sm text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-purple-400">✓</span>
                    <span><strong>NFC Tap + AR Models</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-purple-400">✓</span>
                    <span>Interactive 3D figures pop up on your phone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 text-purple-400">✓</span>
                    <span>Limited edition designs (Space Boi & Retro)</span>
                  </li>
                </ul>
                <a href="https://ig.me/m/tactus" target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-white/10 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/20">
                  Order via DM
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative px-6 py-24 bg-black/40">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">
              The Magic
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-wide text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              No App Required
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-3"
          >
            {[
              {
                step: "1",
                title: "Get Your Keychain",
                desc: "Choose from our Lite, Pro, or AR collections. Customize your Pro card with your favorite song."
              },
              {
                step: "2",
                title: "Tap Your Phone",
                desc: "Hold your phone near the keychain. The built-in NFC chip connects instantly without an app."
              },
              {
                step: "3",
                title: "Unlock the Vibe",
                desc: "Your chosen Spotify song plays immediately, or watch as 3D AR characters come to life on your screen."
              }
            ].map((s, i) => (
              <motion.div key={i} variants={fadeInUp} className="group flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-tactus-border)] bg-white/[0.02] transition-all group-hover:border-[#FF6B35]/50 group-hover:bg-[#FF6B35]/10 group-hover:text-[#FF6B35]">
                  <span className="text-2xl font-bold text-white/60 group-hover:text-[#FF6B35] transition-colors">{s.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== LIVE AR DEMO ===== */}
      <section id="demo" className="relative px-6 py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30">Live Preview</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-wide text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Try the AR Experience
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-white/40">
              Want to see how the AR keychains work before buying? Launch the demo below and point it at our display banner.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col gap-4"
          >
            <motion.div variants={fadeInUp}>
              <Link
                href="/ar/retro-player"
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="h-7 w-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AR Retro Player</h3>
                  <p className="text-sm text-white/40">Launch Kuromi AR Demo</p>
                </div>
                <svg className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/ar/space-boi"
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/10"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#00D4FF]/10 group-hover:bg-[#00D4FF]/20 transition-colors">
                  <svg className="h-7 w-7 text-[#00D4FF]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AR Space Boi</h3>
                  <p className="text-sm text-white/40">Launch Space Boi Demo</p>
                </div>
                <svg className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative px-6 py-24 bg-black/40">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-wide text-white" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What is an NFC keychain?",
                a: "NFC (Near Field Communication) allows your keychain to communicate with your smartphone. You just tap it against the back of your phone, and it automatically triggers an action—like opening a Spotify song or an AR experience—no batteries required!"
              },
              {
                q: "Do I need to download an app?",
                a: "No! Most modern smartphones (iPhone 11 & newer, and most Androids) have NFC enabled by default. TACTUS works straight out of the box using your phone's native features."
              },
              {
                q: "How do I customize my Pro keychain?",
                a: "When you order the Pro tier via DM, you'll provide us with a link to your favorite Spotify song, and optionally a custom photo to print inside the acrylic. We program it for you before shipping."
              },
              {
                q: "How do I order?",
                a: "Currently, we accept orders directly through our Instagram / Facebook DMs. Just let us know which tier you want! We are setting up Shopee and TikTok shops very soon."
              }
            ].map((faq, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-white/90">{faq.q}</span>
                  <svg 
                    className={`h-5 w-5 text-white/40 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="px-6 pb-6 text-sm text-white/50">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-white/[0.06] px-6 py-12 bg-tactus-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-4xl font-black tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-display)" }}>
              TACTUS
            </h2>
            <p className="text-sm text-white/40 text-center max-w-sm">
              Your music and memories, unlocked in a simple tap. Designed and assembled in the Philippines.
            </p>
          </div>

          <div className="flex gap-6">
            {/* Social Icons mapped to standard DMs or handles */}
            <a href="https://ig.me/m/tactus" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:bg-[#FF6B35]/20 hover:text-[#FF6B35] transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="https://tiktok.com/@tactus" target="_blank" rel="noopener noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/20 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>
            </a>
          </div>

          <p className="text-xs text-white/20">© 2026 TACTUS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
