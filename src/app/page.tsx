"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <main className="landing-page relative min-h-dvh overflow-x-hidden bg-tactus-black">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-20">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

        {/* Animated ring */}
        <div className="pulse-glow pointer-events-none absolute h-80 w-80 rounded-full border border-white/[0.06]" />

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
            Tap into the experience.
            <br />
            <span className="text-white/70">Music. AR. Unlocked.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href="#demo"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-tactus-black transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
            >
              Try Demo
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium uppercase tracking-wider text-white/60 transition-all duration-300 hover:border-white/20 hover:text-white"
            >
              Learn More
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
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative px-6 py-24">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30"
            >
              How It Works
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-wide text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three Taps Away
            </motion.h2>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-3"
          >
            {/* Step 1 */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.05]">
                <span className="text-2xl font-bold text-white/60">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Get Your Keychain
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Premium NFC-enabled keychain with your unique digital identity
                embedded.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.05]">
                <span className="text-2xl font-bold text-white/60">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Tap Your Phone
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Hold your phone near the keychain. No app required — it just
                works.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.05]">
                <span className="text-2xl font-bold text-white/60">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Unlock the Magic
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Instantly access exclusive music, AR experiences, and hidden
                content.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative px-6 py-24">
        {/* Subtle top border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-wide text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Physical Meets Digital
            </motion.h2>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2"
          >
            {/* Music Integration */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1DB954]/10">
                <svg
                  className="h-6 w-6 text-[#1DB954]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Music Integration
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Link directly to Spotify tracks, playlists, or albums. Share
                your sound with a tap.
              </p>
            </motion.div>

            {/* AR Experiences */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                AR Experiences
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Point your camera at the keychain to unlock immersive augmented
                reality content.
              </p>
            </motion.div>

            {/* No App Required */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                No App Required
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Works instantly with any NFC-enabled smartphone. Just tap and
                go.
              </p>
            </motion.div>

            {/* Premium Build */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <svg
                  className="h-6 w-6 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Premium Build
              </h3>
              <p className="text-sm leading-relaxed text-white/40">
                Crafted with quality materials. A collectible piece that carries
                your digital world.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== DEMO SECTION ===== */}
      <section id="demo" className="relative px-6 py-24">
        {/* Subtle top border */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-2xl">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-white/30"
            >
              Try It Now
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-wide text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Experience TACTUS
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mt-4 text-white/40"
            >
              Don&apos;t have a keychain yet? Try our demos below.
            </motion.p>
          </motion.div>

          {/* Demo Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-col gap-4"
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Link
                href="/play/4cOdK2wGLETKBW3PvgPWqT"
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1DB954]/10">
                  <svg
                    className="h-7 w-7 text-[#1DB954]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    Spotify Integration
                  </h3>
                  <p className="text-sm text-white/40">
                    Tap to open a track directly in Spotify
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Link
                href="/ar/retro-player"
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                  <svg
                    className="h-7 w-7 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
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
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">AR Retro Player</h3>
                  <p className="text-sm text-white/40">
                    Point your camera to see AR in action
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative px-6 py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative mx-auto max-w-xl text-center"
        >
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold tracking-wide text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Tap In?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="mb-8 text-white/40"
          >
            Be the first to know when TACTUS launches.
          </motion.p>

          {/* Email signup placeholder */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full max-w-xs rounded-full border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none sm:w-auto"
            />
            <button className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-tactus-black transition-all hover:bg-white/90 sm:w-auto">
              Notify Me
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
          {/* Top row: Logo + Social Icons */}
          <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Logo */}
            <p
              className="text-xl font-bold tracking-[0.15em] text-white/60"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TACTUS
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/tactus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/40 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@tactus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/40 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/tactus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/40 transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70"
                aria-label="X"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/[0.06]" />

          {/* Bottom row: Links + Copyright */}
          <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Links */}
            <div className="flex gap-6 text-xs uppercase tracking-wider text-white/30">
              <a href="#" className="transition-colors hover:text-white/60">
                About
              </a>
              <a href="#" className="transition-colors hover:text-white/60">
                Contact
              </a>
              <a href="#" className="transition-colors hover:text-white/60">
                Privacy
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/20">© 2026 TACTUS</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
