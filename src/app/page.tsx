"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { AR_EXPERIENCES } from "@/lib/arExperiences";

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

// Reusable Spring Button Component
const SpringButton = ({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) => {
  const baseClasses = "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl py-3.5 px-8 text-sm font-semibold tracking-wide transition-colors";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20 hover:bg-[#ff8559]",
    secondary: "bg-white/5 border border-white/10 text-white/90 hover:bg-white/10",
  };

  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${variants[variant]}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.a>
  );
};

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Parallax transform for Hero Background
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <main className="landing-page relative min-h-dvh overflow-x-hidden bg-tactus-black selection:bg-[#FF6B35]/30">
      {/* Global Noise Layer */}
      <div className="bg-noise absolute inset-0 z-50 pointer-events-none" />

      {/* Floating Glass Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-black/50 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl" : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-widest text-white" style={{ fontFamily: "var(--font-display)" }}>
            TACTUS
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#shop" className="hover:text-white transition-colors">Collection</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <motion.a
            href="https://www.instagram.com/hellotactus/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Order Now
          </motion.a>
        </div>
      </motion.header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-dvh flex-col items-center justify-start lg:justify-center px-6 pt-32 pb-20 overflow-visible">
        {/* Cinematic Parallax Background */}
        <motion.div 
          style={{ y: yBg }} 
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,107,53,0.15)_0%,transparent_50%)]" />
        </motion.div>

        <div className="mx-auto max-w-6xl w-full flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center z-10 pt-4 lg:pt-10">
          
          {/* Left Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left mt-10 lg:mt-0"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-3 py-1 text-xs font-medium text-[#FF6B35]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
              </span>
              The Phygital Era
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[1.1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your music.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#ffaa85]">Unlocked in a tap.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-lg text-lg leading-relaxed text-white/50"
            >
              The premium smart keychain that bridges the physical and digital world. Instantly play songs or summon 3D AR holograms directly to your phone.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 mt-4"
            >
              <SpringButton href="#shop" variant="primary">
                Shop Collection
              </SpringButton>
              <SpringButton href="#demo" variant="secondary">
                Try AR Demo
              </SpringButton>
            </motion.div>
          </motion.div>

          {/* Right Cinematic Hero Image showcase */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
             animate={{ opacity: 1, scale: 1, rotateY: 0 }}
             transition={{ duration: 1, type: "spring", bounce: 0.4 }}
             className="relative w-full aspect-[4/5] lg:aspect-square max-w-[400px] lg:max-w-[500px] mx-auto perspective-1000 mt-8 lg:mt-0"
          >
             {/* Glowing shadow behind the product */}
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-4 bg-[#FF6B35]/20 blur-[60px] rounded-full pointer-events-none"
             />
             
             {/* Styled Image Card */}
             <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-[#101010]/20 z-10 pointer-events-none" />
                <Image 
                  src="/products/pro-keychain.png" 
                  alt="TACTUS NFC Keychain" 
                  fill 
                  className="object-cover"
                  priority
                />
             </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative px-6 py-32 bg-black border-t border-white/5 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B35]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Your music.<br />
              <span className="text-[#FF6B35]">Unlocked in a tap.</span>
            </motion.h2>
          </motion.div>

          <div className="relative mx-auto max-w-2xl">
            {/* Connecting line */}
            <div className="absolute left-[27px] md:left-1/2 top-8 bottom-8 w-[2px] bg-white/10 md:-translate-x-1/2" />

            <div className="flex flex-col gap-12">
              {/* Step 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="relative flex items-center gap-6 md:justify-center"
              >
                <div className="md:w-1/2 md:text-right md:pr-12 hidden md:block">
                  <div className="relative h-full min-h-[160px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <Image src="/products/basic-keychain-1.jpg" alt="Get the Keychain" fill className="object-cover" />
                  </div>
                </div>
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#111] border-4 border-[#FF6B35] text-xl font-bold text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                  1
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                    <h3 className="text-xl font-bold text-white">Get the Keychain</h3>
                    <p className="mt-2 text-sm text-white/50">Choose your favorite song, artist, or playlist. We craft it into a premium acrylic keychain with an embedded invisible NFC chip.</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative flex items-center gap-6 md:justify-center md:flex-row-reverse"
              >
                <div className="md:w-1/2 md:pl-12 hidden md:block">
                  <div className="relative h-full min-h-[160px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <Image src="/products/basic-keychain-2.jpg" alt="Tap with Your Phone" fill className="object-cover" />
                  </div>
                </div>
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#111] border-4 border-[#FF6B35] text-xl font-bold text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                  2
                </div>
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/20">
                    <h3 className="text-xl font-bold text-white">Tap with Your Phone</h3>
                    <p className="mt-2 text-sm text-white/50">Simply bring your smartphone close to the keychain. No app required, works instantly on iOS and Android.</p>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative flex items-center gap-6 md:justify-center"
              >
                <div className="md:w-1/2 md:text-right md:pr-12 hidden md:block">
                  <div className="relative h-full min-h-[160px] w-full rounded-2xl overflow-hidden border border-[#FF6B35]/30 shadow-[0_0_20px_rgba(255,107,53,0.15)]">
                    <Image src="/products/pro-keychain.png" alt="Unlock the Vibe" fill className="object-cover" />
                  </div>
                </div>
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#111] border-4 border-[#FF6B35] text-xl font-bold text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]">
                  3
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="rounded-2xl bg-[#FF6B35]/10 border border-[#FF6B35]/30 p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(255,107,53,0.1)] transition-colors hover:bg-[#FF6B35]/20">
                    <h3 className="text-xl font-bold text-white">Unlock the Vibe</h3>
                    <p className="mt-2 text-sm text-white/70">Instantly launch your music, custom augmented reality experiences, or private slideshows.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT TIERS (SHOP) ===== */}
      <section id="shop" className="relative px-6 py-32 bg-black/50 border-y border-white/5">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              The Collection
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-white/40 max-w-xl mx-auto">
              Engineered with premium acrylic and invisible NFC technology. Choose your experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-10 sm:grid-cols-2 relative"
          >
            {/* TIER 1: TACTUS NFC */}
            <motion.div 
               variants={fadeInUp} 
               className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#FF6B35]/20 bg-[#1a1a1a] shadow-2xl transition-all hover:border-[#FF6B35]/50 hover:-translate-y-2"
            >
              {/* Animated Border Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B35]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="absolute top-4 right-4 z-10 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] backdrop-blur-md">
                Best Seller
              </div>
              <div className="relative aspect-[4/3] w-full bg-black">
                <Image src="/products/pro-keychain.png" alt="TACTUS NFC Keychain" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700" />
              </div>
              <div className="flex flex-1 flex-col p-8 relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white/90" style={{ fontFamily: "var(--font-display)" }}>TACTUS NFC</h3>
                  <span className="text-2xl font-black text-white">₱99</span>
                </div>
                <p className="mb-8 text-sm text-white/50">The original smart keychain with magic tap.</p>
                <ul className="mb-10 flex-1 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B35]/20 text-[#FF6B35] text-[10px]">✓</span>
                    <span><strong>Tap to play</strong> instantly via NFC</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 text-[10px]">✓</span>
                    <span>No app required – works on all phones</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 text-[10px]">✓</span>
                    <span>Holographic premium packaging</span>
                  </li>
                </ul>
                <SpringButton href="https://www.instagram.com/hellotactus/" variant="primary">
                  Order via DM
                </SpringButton>
              </div>
            </motion.div>

            {/* TIER 2: PREMIUM AR */}
            <motion.div 
               variants={fadeInUp} 
               className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-2xl transition-all hover:border-purple-500/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative aspect-[4/3] w-full bg-black">
                <Image src="/products/premium-keychain.png" alt="TACTUS Premium AR" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700" />
              </div>
              <div className="flex flex-1 flex-col p-8 relative z-10">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-white/90" style={{ fontFamily: "var(--font-display)" }}>AR COLLECTOR</h3>
                  <span className="text-2xl font-black text-white">₱199</span>
                </div>
                <p className="mb-8 text-sm text-white/50">Unlock immersive 3D AR experiences.</p>
                <ul className="mb-10 flex-1 space-y-4 text-sm text-white/70">
                  <li className="flex items-start gap-4">
                     <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-[10px]">✓</span>
                    <span><strong>NFC Tap + AR Models</strong></span>
                  </li>
                  <li className="flex items-start gap-4">
                     <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 text-[10px]">✓</span>
                    <span>Interactive 3D figures pop up on screen</span>
                  </li>
                  <li className="flex items-start gap-4">
                     <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 text-[10px]">✓</span>
                    <span>Limited edition designs (Space Boi & Retro)</span>
                  </li>
                </ul>
                <SpringButton href="https://www.instagram.com/hellotactus/" variant="secondary">
                  Order via DM
                </SpringButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* ===== LIVE AR DEMO ===== */}
      <section id="demo" className="relative px-6 py-32 bg-transparent border-t border-white/5">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-12 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-3 text-xs uppercase tracking-[0.3em] text-[#FF6B35]">Live Preview</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold tracking-tight text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
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
            {AR_EXPERIENCES.map((exp) => (
              <motion.div key={exp.slug} variants={fadeInUp}>
                <Link
                  href={`/ar/${exp.slug}`}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111] p-5 transition-all duration-300 hover:bg-white/[0.03] hover:-translate-y-1"
                  style={{ ["--accent" as string]: exp.accentColor }}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors"
                    style={{ backgroundColor: `${exp.accentColor}1a` }}
                  >
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      style={{ color: exp.accentColor }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{exp.title} AR</h3>
                    <p className="text-sm text-white/40">{exp.listing.description}</p>
                  </div>
                  <svg
                    className="h-5 w-5 text-white/20 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative px-6 py-32 bg-black/50 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Questions?
            </h2>
            <p className="text-white/40">Everything you need to know about the phygital experience.</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What is an NFC keychain?",
                a: "NFC (Near Field Communication) allows your keychain to securely communicate with your smartphone. When holding them close, it triggers an instant action without batteries or charging. It's the same tech used in Apple Pay."
              },
              {
                q: "Do I need to download an app?",
                a: "No! Most modern smartphones (iPhone XS & newer, and most Androids) have NFC enabled by default. TACTUS works straight out of the box using your phone's native features."
              },
              {
                q: "What if a phone doesn't have NFC?",
                a: "For older budget phones without NFC, no worries! The visual design on the acrylic acts as a standard visual code. You can just open the Spotify app, tap the camera icon in search, and scan it."
              },
              {
                q: "How do I order?",
                a: "Currently, we manage our limited stock directly through our Instagram or Facebook DMs. Just let us know which tier you want and if you want a custom track!"
              }
            ].map((faq, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-white/5 bg-[#111] transition-colors hover:bg-white/[0.02]">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-6 cursor-pointer"
                >
                  <span className="font-semibold text-white/90 text-left">{faq.q}</span>
                  <div className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform duration-300 ${activeFaq === idx ? "rotate-90 bg-[#FF6B35]/20 text-[#FF6B35]" : "text-white/40"}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: activeFaq === idx ? "auto" : 0, opacity: activeFaq === idx ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 pt-2 text-sm text-white/50 leading-relaxed border-t border-white/5 mx-6 mt-2">{faq.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-white/10 px-6 py-20 bg-tactus-black overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-[#FF6B35]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 z-10">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-5xl font-black tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-display)" }}>
              TACTUS
            </h2>
            <p className="text-sm text-white/40 text-center max-w-sm">
              Your vibe, captured in acrylic. Phygital experiences designed and assembled in the Philippines.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <a 
              href="mailto:hellotactus@gmail.com" 
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zM4.5 5a.5.5 0 00-.5.5v.465l7.636 5.345a1 1 0 001.146 0L20 5.965V5.5a.5.5 0 00-.5-.5h-15zm15.5 2.4l-7.25 5.075a2 2 0 01-2.293 0L3 7.4v11.1a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V7.4z"/>
              </svg>
              <span className="text-xl font-medium tracking-wide">hellotactus@gmail.com</span>
            </a>

            <div className="flex gap-4">
              <motion.a 
                href="https://www.facebook.com/share/1H68VmrE9K/?mibextid=wwXIfr" 
                target="_blank" 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 107, 53, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-[#FF6B35] transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/hellotactus" 
                target="_blank" 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 107, 53, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-[#FF6B35] transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </motion.a>
              <motion.a 
                href="https://www.tiktok.com/@hellotactus" 
                target="_blank" 
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 107, 53, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-[#FF6B35] transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" /></svg>
              </motion.a>
            </div>
          </div>

          <p className="text-xs text-white/20 font-medium">© 2026 TACTUS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
