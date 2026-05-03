"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ── Magnetic Button ──────────────────────────────────────────────────────────
const MagneticBtn = ({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const base =
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-colors duration-200";
  const styles = {
    primary: "bg-[#FF6B35] text-black hover:bg-[#ff8559]",
    ghost: "border border-white/20 text-white/80 hover:border-white/50 hover:text-white",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </motion.a>
  );
};

// ── Marquee Strip ─────────────────────────────────────────────────────────────
const Marquee = ({ items }: { items: string[] }) => (
  <div className="overflow-hidden border-y border-white/[0.06] py-3 bg-[#0a0a0a]">
    <motion.div
      animate={{ x: [0, "-50%"] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      className="flex whitespace-nowrap"
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="mx-10 text-xs font-bold tracking-[0.25em] uppercase text-white/25">
          {item}
          <span className="mx-10 text-[#FF6B35]/60">✦</span>
        </span>
      ))}
    </motion.div>
  </div>
);

// ── Phone Mockup — instant CSS Ken Burns slideshow ────────────────────────────
const PHONE_SLIDES = [
  { src: "/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png", caption: "Happy Birthday, Ate 🎂" },
  { src: "/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png", caption: "Our song is playing ♪" },
  { src: "/products/Gemini_Generated_Image_btalaybtalaybtal.png", caption: "Remember this day?" },
];
const SLIDE_MS = 3200;

const PhoneMockup = () => {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / SLIDE_MS, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setPrev(idx);
        setIdx((i) => (i + 1) % PHONE_SLIDES.length);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const slide = PHONE_SLIDES[idx];
  const prevSlide = prev !== null ? PHONE_SLIDES[prev] : null;

  return (
    <div className="relative mx-auto w-[200px] sm:w-[260px]">
      {/* Outer shell */}
      <div className="relative rounded-[2.8rem] border-[6px] border-white/10 bg-[#0a0a0a] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.85)] aspect-[9/19]">
        {/* Side buttons */}
        <div className="absolute -left-[7px] top-20 w-[5px] h-8 bg-white/10 rounded-l-sm" />
        <div className="absolute -left-[7px] top-32 w-[5px] h-12 bg-white/10 rounded-l-sm" />
        <div className="absolute -right-[7px] top-24 w-[5px] h-14 bg-white/10 rounded-r-sm" />
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0a] rounded-b-2xl z-20" />

        {/* Screen */}
        <div className="absolute inset-0 bg-black">
          {/* Previous slide fading out */}
          {prevSlide && (
            <div
              key={`prev-${prev}`}
              className="absolute inset-0"
              style={{ opacity: 1 - Math.min(progress * 3, 1) }}
            >
              <Image src={prevSlide.src} alt="" fill className="object-cover" style={{ transform: "scale(1.08)" }} unoptimized />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
            </div>
          )}

          {/* Current slide with Ken Burns */}
          <div key={`slide-${idx}`} className="absolute inset-0" style={{ opacity: Math.min(progress * 3, 1) }}>
            <Image
              src={slide.src}
              alt={slide.caption}
              fill
              priority
              className="object-cover"
              style={{ transform: `scale(${1 + progress * 0.08})`, transformOrigin: idx % 2 === 0 ? "left center" : "right center" }}
              unoptimized
            />
            {/* Vignette */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />

            {/* Caption */}
            <div
              className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2"
              style={{ opacity: Math.max(0, (progress - 0.25) * 2), transform: `translateY(${Math.max(0, (1 - progress * 4) * 12)}px)` }}
            >
              <p className="text-white text-[11px] font-light tracking-widest text-center px-6 drop-shadow-lg" style={{ fontFamily: "Georgia, serif" }}>
                {slide.caption}
              </p>
              <div className="w-6 h-[2px] rounded-full bg-[#FF6B35]" />
            </div>
          </div>

          {/* Progress bars */}
          <div className="absolute top-10 left-3 right-3 flex gap-1 z-10">
            {PHONE_SLIDES.map((_, i) => (
              <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/20">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: i < idx ? "100%" : i === idx ? `${progress * 100}%` : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute inset-0 -z-10 blur-[70px] opacity-50 bg-[#FF6B35]/25 rounded-full" />
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const marqueeItems = [
    "Personalized Gift",
    "Birthday",
    "Anniversary",
    "Graduation",
    "Love",
    "NFC Keychain",
    "Made in PH",
    "Tap to Remember",
    "No App Needed",
    "Custom Song",
  ];

  const occasions = [
    { emoji: "🎂", label: "Birthdays" },
    { emoji: "💍", label: "Anniversaries" },
    { emoji: "🎓", label: "Graduation" },
    { emoji: "💌", label: "Valentine's" },
    { emoji: "🌟", label: "Just Because" },
  ];

  const faqs = [
    {
      q: "What exactly will they see when they tap it?",
      a: "A beautiful full-screen slideshow of the photos you send us, playing your chosen song in the background. It opens instantly — no app, no login, just the memory.",
    },
    {
      q: "How do I send my photos and song?",
      a: "After ordering via DM, we'll ask you to send your photos and the song you want. We handle everything from there.",
    },
    {
      q: "Do they need to download an app?",
      a: "No. It works on any modern smartphone — iPhone XS and newer, plus most Android phones. They just tap and it opens.",
    },
    {
      q: "What if their phone doesn't have NFC?",
      a: "The acrylic also works as a visual code. Open Spotify, tap the camera in Search, and scan it — they'll still get to the experience.",
    },
    {
      q: "How do I order?",
      a: "DM us on Instagram or Facebook. Tell us the occasion, your photos, and the song. We'll take it from there.",
    },
  ];

  return (
    <main className="landing-page relative min-h-dvh overflow-x-hidden bg-[#080808] selection:bg-[#FF6B35]/30">
      <div className="bg-noise fixed inset-0 z-50 pointer-events-none" />

      {/* ── NAV ─────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#080808]/85 backdrop-blur-2xl border-b border-white/5 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-black tracking-[0.25em] text-white" style={{ fontFamily: "var(--font-display)" }}>
            TACTUS
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#gifts" className="hover:text-white transition-colors duration-200">Gifts</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </nav>
          <MagneticBtn href="https://www.instagram.com/hellotactus/" external variant="primary">
            Order Now
          </MagneticBtn>
        </div>
      </motion.header>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative min-h-dvh flex items-center px-6 pt-32 pb-24 overflow-hidden">
        <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-[#FF6B35]/6 blur-[150px]" />
          <div className="absolute bottom-0 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/10 blur-[120px]" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl w-full z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B35]">
                  Personalized Gifts — Made in PH
                </span>
              </motion.div>

              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[clamp(3rem,10vw,7.5rem)] font-black leading-[0.92] tracking-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  A GIFT
                  <br />
                  THEY{`'`}LL NEVER
                  <br />
                  <span className="text-[#FF6B35]">FORGET.</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="max-w-md text-base leading-relaxed text-white/50"
              >
                A keychain that holds a memory. They tap it once and a private photo
                slideshow opens — their photos, their song, your message. No app. Just the moment.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="flex flex-wrap gap-3"
              >
                {occasions.map((o) => (
                  <span key={o.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60">
                    {o.emoji} {o.label}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <MagneticBtn href="https://www.instagram.com/hellotactus/" external variant="primary">
                  Order a Gift
                </MagneticBtn>
                <MagneticBtn href="#how-it-works" variant="ghost">
                  See How It Works
                </MagneticBtn>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="text-xs text-white/25"
              >
                Starting at <span className="text-white/50 font-semibold">₱99</span> · Ships anywhere in PH
              </motion.p>
            </div>

            {/* Right — unified phone + keychain composition */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.3 }}
              className="relative flex items-center justify-center"
              style={{ minHeight: 560 }}
            >
              {/* Ambient glow behind everything */}
              <div className="absolute inset-0 bg-[#FF6B35]/8 blur-[100px] rounded-full pointer-events-none" />

              {/* Phone — centered */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <PhoneMockup />

                {/* "Unlocked" badge — floats on top-left of phone */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="absolute -left-6 top-16 z-20 flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 shadow-xl"
                >
                  <span className="text-sm">🎵</span>
                  <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">Playing your song</span>
                </motion.div>
              </motion.div>

              {/* Keychain — absolutely positioned bottom-right, overlapping phone */}
              <motion.div
                animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 -right-4 sm:-right-8 z-20 w-36 sm:w-44 aspect-square"
              >
                {/* Soft glow under keychain */}
                <div className="absolute inset-2 bg-[#FF6B35]/20 blur-[30px] rounded-full" />
                <Image
                  src="/products/Gemini_Generated_Image_v6osfcv6osfcv6os.png"
                  alt="TACTUS Keychain"
                  fill
                  className="object-cover drop-shadow-2xl rounded-xl"
                  priority
                />

                {/* NFC tap indicator on the keychain */}
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border border-[#FF6B35]/40 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 rounded-full border border-[#FF6B35]/20 pointer-events-none"
                />
              </motion.div>

              {/* Tap label — anchored below keychain */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute bottom-[-28px] right-4 sm:right-0 flex items-center gap-1.5"
              >
                <span className="text-xs">👆</span>
                <span className="text-[10px] text-white/35 font-medium tracking-wide uppercase">Tap</span>
              </motion.div>
            </motion.div>

          </div>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-6 w-[1px] bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how-it-works" className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FF6B35]/4 blur-[150px] rounded-full" />
        </div>

        <div className="relative mx-auto max-w-7xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-20 max-w-xl"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B35] mb-4">How It Works</p>
            <h2
              className="text-[clamp(2.5rem,7vw,6rem)] font-black tracking-tight text-white leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ORDER ONCE.
              <br />
              <span className="text-white/20">THEY FEEL IT FOREVER.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {[
              {
                step: "01",
                icon: "💬",
                title: "DM Us",
                desc: "Tell us the occasion — birthday, anniversary, graduation, anything. We'll guide you from there.",
              },
              {
                step: "02",
                icon: "📸",
                title: "Send Your Photos + Song",
                desc: "A few photos and the song that means something. That's all we need.",
              },
              {
                step: "03",
                icon: "✨",
                title: "We Build It",
                desc: "We embed your memory into a premium acrylic keychain with an invisible NFC chip.",
              },
              {
                step: "04",
                icon: "💥",
                title: "They Tap. They Feel It.",
                desc: "One tap opens a private slideshow — photos, song, and your message. No app needed.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative bg-[#0d0d0d] p-8 hover:bg-[#111] transition-colors duration-300"
              >
                <div className="text-[4rem] font-black leading-none mb-4 text-white/[0.03]" style={{ fontFamily: "var(--font-display)" }}>
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-black text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-[#FF6B35]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT THEY'LL SEE ────────────────────────────── */}
      <section className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/10 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B35] mb-4">The Experience</p>
              <h2
                className="text-[clamp(2.5rem,6vw,5.5rem)] font-black tracking-tight text-white leading-[0.95] mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                WHAT THEY
                <br />
                SEE WHEN
                <br />
                <span className="text-[#FF6B35]">THEY TAP.</span>
              </h2>
              <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm">
                A full-screen, cinematic slideshow of your photos — set to their song.
                Private, beautiful, and completely theirs. No sign-in. No friction. Just the memory.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: "🎵", text: "Their song plays automatically" },
                  { icon: "📷", text: "Your photos fill the screen" },
                  { icon: "💬", text: "Your personal message at the end" },
                  { icon: "🔒", text: "Private — only accessible via the keychain" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-white/60">
                    <span className="text-lg">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>

              <MagneticBtn href="/demo" variant="ghost">
                Preview a demo →
              </MagneticBtn>
            </motion.div>

            {/* Animated phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PhoneMockup />
                </motion.div>
                {/* Decorative rings */}
                {[1, 2, 3].map((n) => (
                  <motion.div
                    key={n}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0, 0.15] }}
                    transition={{ duration: 3, repeat: Infinity, delay: n * 0.8 }}
                    className="absolute inset-0 rounded-full border border-[#FF6B35]/20 pointer-events-none"
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── GIFT TIERS ──────────────────────────────────── */}
      <section id="gifts" className="relative px-6 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="text-[18vw] font-black text-white/[0.015] leading-none" style={{ fontFamily: "var(--font-display)" }}>GIFT</span>
        </div>

        <div className="relative mx-auto max-w-7xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-20"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B35] mb-4">Choose Your Gift</p>
            <h2
              className="text-[clamp(2.5rem,7vw,6rem)] font-black tracking-tight text-white leading-[0.95]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TWO WAYS
              <br />
              <span className="text-white/20">TO MAKE THEM CRY.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Tier 1 — Classic */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className="group relative overflow-hidden rounded-3xl border border-[#FF6B35]/20 bg-[#0d0d0d] hover:border-[#FF6B35]/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src="/products/Gemini_Generated_Image_u6arz0u6arz0u6ar.png" alt="Classic Gift" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-[#FF6B35] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                  Most Popular
                </div>
              </div>

              <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                      CLASSIC
                    </h3>
                    <p className="text-sm text-white/40 mt-1">Photo + Song + Keychain</p>
                  </div>
                  <span className="text-4xl font-black text-[#FF6B35]" style={{ fontFamily: "var(--font-display)" }}>₱99</span>
                </div>

                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  Tap to instantly play their song. Add a photo and it shows on the keychain itself. Simple, clean, and powerful.
                </p>

                <ul className="space-y-3 mb-8">
                  {["Custom photo printed on keychain", "Custom song via NFC tap", "No app — works on all phones", "Holographic packaging"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B35] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <MagneticBtn href="https://www.instagram.com/hellotactus/" external variant="primary">
                  Order via DM →
                </MagneticBtn>
              </div>
            </motion.div>

            {/* Tier 2 — Memory */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-rose-500/20 bg-[#0d0d0d] hover:border-rose-500/40 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src="/products/Gemini_Generated_Image_btalaybtalaybtal.png" alt="Memory Gift" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/20 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-rose-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-300 border border-rose-500/30">
                  Most Meaningful
                </div>
              </div>

              <div className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                      MEMORY
                    </h3>
                    <p className="text-sm text-white/40 mt-1">Keychain + Photos + Song + Message</p>
                  </div>
                  <span className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>₱199</span>
                </div>

                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  Tap to open a private photo slideshow with their song. The most personal gift you can give — a moment they can relive forever.
                </p>

                <ul className="space-y-3 mb-8">
                  {["Premium acrylic keychain", "Private photo slideshow (up to 10 photos)", "Their song plays automatically", "Your personal message included", "Holographic packaging"].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <MagneticBtn href="https://www.instagram.com/hellotactus/" external variant="ghost">
                  Order via DM →
                </MagneticBtn>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" className="relative px-6 py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B35] mb-4">FAQ</p>
              <h2
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black tracking-tight text-white leading-[0.95]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                GOT
                <br />
                QUESTIONS?
              </h2>
              <p className="mt-6 text-sm text-white/40 max-w-xs leading-relaxed">
                Everything you need to know before ordering.
              </p>
            </motion.div>

            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.07, duration: 0.5 }}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    activeFaq === idx
                      ? "border-[#FF6B35]/30 bg-[#FF6B35]/5"
                      : "border-white/5 bg-[#0d0d0d] hover:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
                  >
                    <span className="font-bold text-white/90 text-sm pr-4">{faq.q}</span>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${activeFaq === idx ? "bg-[#FF6B35] text-black rotate-45" : "bg-white/5 text-white/40"}`}>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: activeFaq === idx ? "auto" : 0, opacity: activeFaq === idx ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section className="relative px-6 py-28 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/15 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 48px)" }} />

        <div className="relative mx-auto max-w-3xl text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-4xl mb-4">🎁</p>
            <h2
              className="text-[clamp(2.5rem,9vw,7rem)] font-black tracking-tight text-white leading-[0.9] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GIVE THEM
              <br />
              <span className="text-[#FF6B35]">A MEMORY.</span>
            </h2>
            <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
              Made in the Philippines. One tap. One song. One moment they{`'`}ll keep forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticBtn href="https://www.instagram.com/hellotactus/" external variant="primary">
                Order on Instagram
              </MagneticBtn>
              <MagneticBtn href="https://www.facebook.com/share/1H68VmrE9K/?mibextid=wwXIfr" external variant="ghost">
                Order on Facebook
              </MagneticBtn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="relative px-6 py-16 border-t border-white/5 bg-[#050505]">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <h2 className="text-3xl font-black tracking-[0.25em] text-white" style={{ fontFamily: "var(--font-display)" }}>
              TACTUS
            </h2>
            <p className="text-xs text-white/30 max-w-xs text-center md:text-left">
              Personalized gift keychains that hold memories. Designed and assembled in the Philippines.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <a href="mailto:hellotactus@gmail.com" className="text-sm text-white/50 hover:text-white transition-colors tracking-wide">
              hellotactus@gmail.com
            </a>
            <div className="flex gap-3">
              {[
                { label: "Facebook", href: "https://www.facebook.com/share/1H68VmrE9K/?mibextid=wwXIfr", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "Instagram", href: "https://www.instagram.com/hellotactus", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "TikTok", href: "https://www.tiktok.com/@hellotactus", d: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" },
              ].map((s) => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/4 text-white/40 hover:text-[#FF6B35] hover:border-[#FF6B35]/30 transition-colors duration-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-white/15 font-medium tracking-widest uppercase">© 2026 TACTUS</p>
        </div>
      </footer>
    </main>
  );
}
