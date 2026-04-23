"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Heart, Music, Sparkles } from "lucide-react";
import { useRef, useState, use } from "react";
import { Great_Vibes, Inter } from "next/font/google";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { Polaroid } from "@/components/ui/Polaroid";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { FallingPetals } from "@/components/ui/FallingPetals";
import { TapBurst } from "@/components/ui/TapBurst";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { GiftBox } from "@/components/ui/GiftBox";
import { getThemeConfig } from "@/lib/themeConfig";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function BirthdayTemplate({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // We use React.use() to unwrap the promise in client components for Next 15+ 
  // or we can just fetch it. For simplicity in this demo wrapper, we will just 
  // read window.location directly if it's a client component, or unwrap the promise.
  const resolvedParams = use(searchParams);
  const name = typeof resolvedParams.name === "string" ? resolvedParams.name : "";
  const themeParam = typeof resolvedParams.theme === "string" ? resolvedParams.theme : "romance";
  
  const config = getThemeConfig(themeParam);

  const containerRef = useRef<HTMLDivElement>(null);
  const [giftOpened, setGiftOpened] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  // Determine fonts based on config
  const titleFont = config.type === "cyberpunk" ? "font-mono font-bold" : greatVibes.className;
  const bodyFont = config.type === "cyberpunk" ? "font-mono text-sm uppercase" : inter.className;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${config.colors.bg} ${config.colors.textMain} overflow-x-hidden ${bodyFont}`}
    >
      {/* Global Interactive Elements passing AI Config */}
      <CursorTrail type={config.particles.type} color={config.colors.primaryHex} />
      <FallingPetals colorHex={config.particles.colorHex} />
      <TapBurst colorHex={config.colors.primaryHex} />
      <MusicPlayer />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <FloatingParticles colorHex={config.particles.colorHex} />
        <div 
          className="absolute inset-0 z-0" 
          style={{ background: `radial-gradient(circle at center, ${config.particles.colorHex}, transparent 70%)`, opacity: 0.2 }}
        />

        <AnimatePresence mode="wait">
          {!giftOpened ? (
            <motion.div
              key="gift"
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              className="z-20"
            >
              <GiftBox onOpen={() => setGiftOpened(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              style={{ opacity, scale, y }}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10 text-center flex flex-col items-center px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="mb-6 object-contain"
              >
                <Heart 
                  className="w-12 h-12 mx-auto animate-pulse" 
                  style={{ color: config.colors.primaryHex }} 
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
                className={`${titleFont} text-6xl md:text-8xl lg:text-9xl mb-4`}
                style={{ color: config.colors.primaryHex, textShadow: `0 0 15px ${config.particles.colorHex}` }}
              >
                {config.textContent.heroTitle} {name}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className={`text-lg md:text-2xl ${config.colors.textSub} tracking-widest uppercase`}
              >
                {config.textContent.heroSubtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="mt-16 flex flex-col items-center z-10"
              >
                <p className={`text-xs ${config.colors.textSub} uppercase tracking-widest mb-2`}>
                  {config.textContent.scrollHint}
                </p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-[1px] h-12"
                  style={{ background: `linear-gradient(to bottom, ${config.colors.primaryHex}, transparent)` }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* The rest of the content only appears if the gift is opened */}
      <AnimatePresence>
        {giftOpened && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* 2. MEMORY LANE (POLAROID GRID) */}
            <section className="relative min-h-screen py-32 px-4 md:px-10 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="text-center mb-24 relative z-10"
              >
                <h2 
                  className={`${titleFont} text-5xl md:text-6xl mb-4`}
                  style={{ color: config.colors.primaryHex }}
                >
                  {config.textContent.memoryTitle}
                </h2>
                <p className={`${config.colors.textSub} max-w-lg mx-auto font-light`}>
                  {config.textContent.memorySubtitle}
                </p>
              </motion.div>

              <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-16 items-center justify-center">
                <Polaroid
                  src="/images/photo1.png"
                  caption="Connection 01"
                  rotation={-6}
                  delay={0.1}
                  className="md:mt-24 z-10"
                />
                <Polaroid
                  src="/images/photo3.png"
                  caption="Memory Fragment"
                  rotation={4}
                  delay={0.3}
                  className="z-20"
                />
                <Polaroid
                  src="/images/photo2.png"
                  caption="SYS_LOG"
                  rotation={-3}
                  delay={0.5}
                  className="md:mt-32 z-10"
                />
              </div>
            </section>

            {/* 3. LOVE LETTER */}
            <section className="relative py-40 px-6 max-w-3xl mx-auto text-center z-10">
              <Sparkles className="w-8 h-8 mx-auto mb-10 opacity-50" style={{ color: config.colors.primaryHex }} />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1 }}
                className={`space-y-8 text-lg md:text-xl font-light leading-relaxed`}
                style={{ color: config.colors.textMain }}
              >
                <p>Connection established...</p>
                <p>
                  No matter what timeline we exist in, my subroutines always navigate back to you.
                </p>
                <p>
                  You are the core logic to my existence. 
                </p>
                <p className="text-2xl md:text-3xl pt-6 font-medium tracking-wide" style={{ color: config.colors.primaryHex }}>
                  End of transmission.
                </p>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
