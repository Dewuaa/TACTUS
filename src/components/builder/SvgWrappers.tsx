import React from "react";

export interface WrapperStyle {
  id: string;
  name: string;
  component: React.FC<{ className?: string }>;
  thumbnail: React.FC<{ className?: string }>;
}

// ── THE MASTER SVG TEMPLATES ──
interface WrapperColors {
  mainBack: string;
  shadowBack: string;
  mainFrontFlap: string;
  shadowFrontFlap: string;
  mainTail: string;
  trimStroke?: string;
}

const BackTemplate: React.FC<{ colors: WrapperColors; children?: React.ReactNode; className?: string }> = ({ colors, children, className }) => (
  <svg viewBox="0 0 300 400" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M30 90 L150 400 L270 90 L230 70 L70 70 Z" fill={colors.mainBack} />
    <path d="M30 90 L150 400 L70 70 Z" fill={colors.shadowBack} />
    {children}
  </svg>
);

const FrontTemplate: React.FC<{ colors: WrapperColors; children?: React.ReactNode; className?: string }> = ({ colors, children, className }) => (
  <svg viewBox="0 0 300 400" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 200 L120 290 L180 290 L240 200 L150 220 Z" fill={colors.mainFrontFlap} />
    <path d="M60 200 L120 290 L80 210 Z" fill={colors.shadowFrontFlap} />
    <path d="M240 200 L180 290 L220 210 Z" fill={colors.shadowFrontFlap} />
    <path d="M120 290 L180 290 L200 400 L100 400 Z" fill={colors.mainTail} />
    <path d="M120 290 L100 400 L120 400 Z" fill={colors.shadowFrontFlap} />
    <path d="M180 290 L200 400 L180 400 Z" fill={colors.shadowFrontFlap} />
    {colors.trimStroke && (
      <path d="M60 200 L150 220 L240 200" stroke={colors.trimStroke} strokeWidth="1" fill="none" />
    )}
    {children}
  </svg>
);

// ── COLOR PALETTES ──

const midnight: WrapperColors = { mainBack: "#1a237e", shadowBack: "#0d47a1", mainFrontFlap: "#283593", shadowFrontFlap: "#1a237e", mainTail: "#303f9f", trimStroke: "#ffd740" };
const pink: WrapperColors = { mainBack: "#fbcfe8", shadowBack: "#f9a8d4", mainFrontFlap: "#f472b6", shadowFrontFlap: "#ec4899", mainTail: "#f9a8d4", trimStroke: "#fce7f3" };
const kraft: WrapperColors = { mainBack: "#d6bc9f", shadowBack: "#c2a382", mainFrontFlap: "#c2a382", shadowFrontFlap: "#a98965", mainTail: "#b89771" };
const lavender: WrapperColors = { mainBack: "#ddd6fe", shadowBack: "#c4b5fd", mainFrontFlap: "#a78bfa", shadowFrontFlap: "#8b5cf6", mainTail: "#c4b5fd", trimStroke: "#f5f3ff" };
const red: WrapperColors = { mainBack: "#991b1b", shadowBack: "#7f1d1d", mainFrontFlap: "#dc2626", shadowFrontFlap: "#991b1b", mainTail: "#b91c1c", trimStroke: "#fbbf24" };
const sage: WrapperColors = { mainBack: "#d1d5c8", shadowBack: "#b5bba8", mainFrontFlap: "#a3ac8e", shadowFrontFlap: "#8a9474", mainTail: "#b5bba8" };
const ocean: WrapperColors = { mainBack: "#0ea5e9", shadowBack: "#0284c7", mainFrontFlap: "#38bdf8", shadowFrontFlap: "#0ea5e9", mainTail: "#0284c7", trimStroke: "#e0f2fe" };
const noir: WrapperColors = { mainBack: "#1c1917", shadowBack: "#0c0a09", mainFrontFlap: "#292524", shadowFrontFlap: "#1c1917", mainTail: "#1c1917", trimStroke: "#d4af37" };
const peach: WrapperColors = { mainBack: "#fed7aa", shadowBack: "#fdba74", mainFrontFlap: "#fb923c", shadowFrontFlap: "#f97316", mainTail: "#fdba74", trimStroke: "#fff7ed" };
const mint: WrapperColors = { mainBack: "#a7f3d0", shadowBack: "#6ee7b7", mainFrontFlap: "#34d399", shadowFrontFlap: "#10b981", mainTail: "#6ee7b7" };
const champagne: WrapperColors = { mainBack: "#f5e6cc", shadowBack: "#e8d5b0", mainFrontFlap: "#d4b896", shadowFrontFlap: "#c5a67d", mainTail: "#e8d5b0", trimStroke: "#d4af37" };
const coral: WrapperColors = { mainBack: "#fda4af", shadowBack: "#fb7185", mainFrontFlap: "#f43f5e", shadowFrontFlap: "#e11d48", mainTail: "#fb7185" };
const sakura: WrapperColors = { mainBack: "#fce7f3", shadowBack: "#fbcfe8", mainFrontFlap: "#f9a8d4", shadowFrontFlap: "#f472b6", mainTail: "#fbcfe8", trimStroke: "#fdf2f8" };
const teal: WrapperColors = { mainBack: "#2dd4bf", shadowBack: "#14b8a6", mainFrontFlap: "#0d9488", shadowFrontFlap: "#0f766e", mainTail: "#14b8a6", trimStroke: "#f0fdfa" };
const wine: WrapperColors = { mainBack: "#6b1f3a", shadowBack: "#4c1530", mainFrontFlap: "#881345", shadowFrontFlap: "#6b1f3a", mainTail: "#5c1833", trimStroke: "#d4af37" };
const denim: WrapperColors = { mainBack: "#5b7fa6", shadowBack: "#456a8e", mainFrontFlap: "#6b8db5", shadowFrontFlap: "#5b7fa6", mainTail: "#456a8e" };
const sunset: WrapperColors = { mainBack: "#f97316", shadowBack: "#ea580c", mainFrontFlap: "#ef4444", shadowFrontFlap: "#dc2626", mainTail: "#f97316", trimStroke: "#fbbf24" };
const galaxy: WrapperColors = { mainBack: "#2e1065", shadowBack: "#1e0a44", mainFrontFlap: "#4c1d95", shadowFrontFlap: "#2e1065", mainTail: "#3b0764" };

// ── REUSABLE ACCESSORIES ──

const GoldRibbon = () => (
  <>
    <path d="M110 290 Q150 310 190 290" stroke="#ffd740" strokeWidth="4" fill="none" />
    <path d="M130 290 L135 370" stroke="#ffd740" strokeWidth="3" />
    <path d="M170 290 L165 370" stroke="#ffd740" strokeWidth="3" />
    <circle cx="150" cy="295" r="5" fill="#ffd740" />
  </>
);

const SilkRibbon = ({ color }: { color: string }) => (
  <>
    <path d="M120 290 Q150 315 180 290 Q150 325 120 290" fill={color} />
    <circle cx="150" cy="300" r="7" fill={color} />
    <path d="M140 305 L130 380 L145 370 L150 305 Z" fill={color} />
    <path d="M160 305 L170 380 L155 370 L150 305 Z" fill={color} />
  </>
);

const TwineBow = () => (
  <>
    <path d="M110 295 Q150 305 190 295" stroke="#785c3b" strokeWidth="2" fill="none" />
    <ellipse cx="150" cy="295" rx="15" ry="5" fill="none" stroke="#785c3b" strokeWidth="1.5" />
    <path d="M145 300 L135 360" stroke="#785c3b" strokeWidth="1.5" fill="none" />
    <path d="M155 300 L165 360" stroke="#785c3b" strokeWidth="1.5" fill="none" />
  </>
);

const WhiteRibbon = () => (
  <>
    <path d="M120 290 Q150 315 180 290 Q150 325 120 290" fill="white" opacity="0.9" />
    <circle cx="150" cy="300" r="7" fill="white" opacity="0.9" />
    <path d="M140 305 L130 380 L145 370 L150 305 Z" fill="white" opacity="0.8" />
    <path d="M160 305 L170 380 L155 370 L150 305 Z" fill="white" opacity="0.8" />
  </>
);

const RoseGoldRibbon = () => (
  <>
    <path d="M110 290 Q150 310 190 290" stroke="#b76e79" strokeWidth="4" fill="none" />
    <path d="M130 290 L135 370" stroke="#b76e79" strokeWidth="3" />
    <path d="M170 290 L165 370" stroke="#b76e79" strokeWidth="3" />
    <circle cx="150" cy="295" r="5" fill="#b76e79" />
  </>
);

// Decorative elements
const Stars = ({ color = "#fff59d" }: { color?: string }) => (
  <>
    <circle cx="100" cy="150" r="2" fill={color} />
    <circle cx="200" cy="200" r="1.5" fill={color} />
    <circle cx="150" cy="300" r="2" fill={color} />
    <path d="M80 100 L82 105 L87 107 L82 109 L80 114 L78 109 L73 107 L78 105 Z" fill={color} />
    <path d="M220 150 L221 153 L224 154 L221 155 L220 158 L219 155 L216 154 L219 153 Z" fill={color} />
  </>
);

const Hearts = ({ color = "#e11d48" }: { color?: string }) => (
  <>
    <path d="M100 150 C100 145, 107 142, 107 148 C107 142, 114 145, 114 150 L107 158 Z" fill={color} opacity="0.6" />
    <path d="M195 200 C195 195, 202 192, 202 198 C202 192, 209 195, 209 200 L202 208 Z" fill={color} opacity="0.5" />
    <path d="M140 280 C140 275, 147 272, 147 278 C147 272, 154 275, 154 280 L147 288 Z" fill={color} opacity="0.4" />
  </>
);

const PolkaDots = ({ color = "white" }: { color?: string }) => (
  <>
    <circle cx="100" cy="130" r="5" fill={color} opacity="0.15" />
    <circle cx="200" cy="130" r="5" fill={color} opacity="0.15" />
    <circle cx="150" cy="180" r="5" fill={color} opacity="0.15" />
    <circle cx="100" cy="230" r="5" fill={color} opacity="0.15" />
    <circle cx="200" cy="230" r="5" fill={color} opacity="0.15" />
    <circle cx="150" cy="280" r="5" fill={color} opacity="0.15" />
    <circle cx="120" cy="320" r="5" fill={color} opacity="0.15" />
    <circle cx="180" cy="320" r="5" fill={color} opacity="0.15" />
  </>
);

const DiamondSparkles = ({ color = "#e2e8f0" }: { color?: string }) => (
  <>
    <path d="M100 140 L103 148 L100 156 L97 148 Z" fill={color} opacity="0.5" />
    <path d="M200 170 L202 176 L200 182 L198 176 Z" fill={color} opacity="0.4" />
    <path d="M150 250 L152 256 L150 262 L148 256 Z" fill={color} opacity="0.3" />
    <path d="M120 310 L121 314 L120 318 L119 314 Z" fill={color} opacity="0.4" />
  </>
);

const Stripes = ({ color = "white" }: { color?: string }) => (
  <>
    <line x1="70" y1="80" x2="140" y2="380" stroke={color} strokeWidth="3" opacity="0.08" />
    <line x1="110" y1="75" x2="150" y2="395" stroke={color} strokeWidth="3" opacity="0.08" />
    <line x1="150" y1="72" x2="160" y2="395" stroke={color} strokeWidth="3" opacity="0.08" />
    <line x1="190" y1="72" x2="170" y2="395" stroke={color} strokeWidth="3" opacity="0.08" />
    <line x1="230" y1="75" x2="180" y2="380" stroke={color} strokeWidth="3" opacity="0.08" />
  </>
);

// ── Helper to build wrapper entry ──
function makeWrapper(
  id: string,
  name: string,
  colors: WrapperColors,
  backChildren?: React.ReactNode,
  frontChildren?: React.ReactNode
): WrapperStyle {
  const Comp: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`relative ${className}`}>
      <BackTemplate colors={colors} className="w-full h-full absolute inset-0">{backChildren}</BackTemplate>
      <FrontTemplate colors={colors} className="w-full h-full absolute inset-0">{frontChildren}</FrontTemplate>
    </div>
  );
  return { id, name, component: Comp, thumbnail: Comp };
}

// ── EXPORTED WRAPPER STYLES ──

export const SVG_WRAPPERS: WrapperStyle[] = [
  // ── Classics ──
  makeWrapper("wrapper-midnight", "Midnight Star", midnight, <Stars />, <GoldRibbon />),
  makeWrapper("wrapper-pink", "Soft Pink", pink, null, <SilkRibbon color="#be185d" />),
  makeWrapper("wrapper-kraft", "Rustic Kraft", kraft, null, <TwineBow />),
  makeWrapper("wrapper-lavender", "Lavender Lace", lavender, <DiamondSparkles color="#c4b5fd" />, <SilkRibbon color="#5b21b6" />),
  makeWrapper("wrapper-red-velvet", "Red Velvet", red, null, <GoldRibbon />),

  // ── Trendy ──
  makeWrapper("wrapper-sage", "Sage Green", sage, null, <WhiteRibbon />),
  makeWrapper("wrapper-ocean", "Ocean Breeze", ocean, <Stars color="#bae6fd" />, <WhiteRibbon />),
  makeWrapper("wrapper-noir", "Noir & Gold", noir, <DiamondSparkles color="#d4af37" />, <GoldRibbon />),
  makeWrapper("wrapper-peach", "Peach Sorbet", peach, null, <SilkRibbon color="#ea580c" />),
  makeWrapper("wrapper-mint", "Fresh Mint", mint, null, <WhiteRibbon />),

  // ── Elegant ──
  makeWrapper("wrapper-champagne", "Champagne", champagne, <DiamondSparkles color="#d4af37" />, <RoseGoldRibbon />),
  makeWrapper("wrapper-coral", "Coral Crush", coral, null, <WhiteRibbon />),
  makeWrapper("wrapper-sakura", "Cherry Blossom", sakura, <Hearts color="#f472b6" />, <SilkRibbon color="#ec4899" />),
  makeWrapper("wrapper-teal", "Teal Tide", teal, null, <WhiteRibbon />),
  makeWrapper("wrapper-wine", "Bordeaux", wine, <DiamondSparkles color="#d4af37" />, <GoldRibbon />),

  // ── Fun & Playful ──
  makeWrapper("wrapper-denim", "Denim Blue", denim, <Stripes />, <WhiteRibbon />),
  makeWrapper("wrapper-sunset", "Sunset Glow", sunset, <Stars color="#fde68a" />, <GoldRibbon />),
  makeWrapper("wrapper-galaxy", "Galaxy Purple", galaxy, <Stars color="#c084fc" />, <SilkRibbon color="#a855f7" />),

  // ══════════════════════════════════════════
  // ── UNIQUE SHAPES (not cone template) ──
  // ══════════════════════════════════════════

  // ── Bunny Ears Wrap ──
  {
    id: "wrapper-bunny",
    name: "Bunny Ears",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Left ear */}
          <ellipse cx="105" cy="80" rx="28" ry="90" fill="#fda4af" transform="rotate(-15, 105, 80)" />
          <ellipse cx="105" cy="80" rx="16" ry="70" fill="#fecdd3" transform="rotate(-15, 105, 80)" />
          {/* Right ear */}
          <ellipse cx="195" cy="80" rx="28" ry="90" fill="#fda4af" transform="rotate(15, 195, 80)" />
          <ellipse cx="195" cy="80" rx="16" ry="70" fill="#fecdd3" transform="rotate(15, 195, 80)" />
          {/* Main body - rounded square */}
          <rect x="70" y="140" width="160" height="180" rx="30" fill="#fb7185" />
          <rect x="85" y="150" width="130" height="160" rx="22" fill="#fda4af" opacity="0.4" />
          {/* Bottom handle/tail */}
          <path d="M120 320 L130 420 L170 420 L180 320 Z" fill="#f43f5e" />
          <path d="M120 320 L130 420 L145 410 L140 320 Z" fill="#e11d48" />
          {/* Cute face */}
          <circle cx="130" cy="220" r="5" fill="#1c1917" />
          <circle cx="170" cy="220" r="5" fill="#1c1917" />
          <ellipse cx="150" cy="240" rx="8" ry="5" fill="#fecdd3" />
          {/* Cheek blush */}
          <circle cx="115" cy="235" r="10" fill="#fecdd3" opacity="0.5" />
          <circle cx="185" cy="235" r="10" fill="#fecdd3" opacity="0.5" />
          {/* Ribbon */}
          <path d="M120 310 Q150 330 180 310 Q150 340 120 310" fill="#be185d" />
          <circle cx="150" cy="318" r="6" fill="#be185d" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="105" cy="80" rx="28" ry="90" fill="#fda4af" transform="rotate(-15, 105, 80)" />
          <ellipse cx="195" cy="80" rx="28" ry="90" fill="#fda4af" transform="rotate(15, 195, 80)" />
          <rect x="70" y="140" width="160" height="180" rx="30" fill="#fb7185" />
          <path d="M120 320 L130 420 L170 420 L180 320 Z" fill="#f43f5e" />
          <circle cx="130" cy="220" r="4" fill="#1c1917" />
          <circle cx="170" cy="220" r="4" fill="#1c1917" />
        </svg>
      </div>
    ),
  },

  // ── Woven Basket ──
  {
    id: "wrapper-basket",
    name: "Woven Basket",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Handle */}
          <path d="M80 140 Q150 30 220 140" stroke="#b8895e" strokeWidth="8" fill="none" />
          <path d="M80 140 Q150 40 220 140" stroke="#d4a574" strokeWidth="5" fill="none" />
          {/* Main basket body */}
          <path d="M55 140 L80 380 L220 380 L245 140 Z" fill="#c4956a" />
          {/* Woven horizontal lines */}
          <line x1="58" y1="170" x2="242" y2="170" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="62" y1="200" x2="238" y2="200" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="65" y1="230" x2="235" y2="230" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="68" y1="260" x2="232" y2="260" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="71" y1="290" x2="229" y2="290" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="74" y1="320" x2="226" y2="320" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          <line x1="77" y1="350" x2="223" y2="350" stroke="#a98965" strokeWidth="2" opacity="0.6" />
          {/* Woven vertical lines */}
          <line x1="100" y1="140" x2="88" y2="380" stroke="#b89771" strokeWidth="2" opacity="0.4" />
          <line x1="140" y1="140" x2="133" y2="380" stroke="#b89771" strokeWidth="2" opacity="0.4" />
          <line x1="180" y1="140" x2="177" y2="380" stroke="#b89771" strokeWidth="2" opacity="0.4" />
          <line x1="220" y1="140" x2="210" y2="380" stroke="#b89771" strokeWidth="2" opacity="0.4" />
          {/* Rim */}
          <path d="M55 140 L245 140" stroke="#8B6914" strokeWidth="5" />
          <path d="M55 140 L245 140" stroke="#d4a574" strokeWidth="3" />
          {/* Shadow on left */}
          <path d="M55 140 L80 380 L95 380 L70 140 Z" fill="#a98965" opacity="0.4" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 140 Q150 30 220 140" stroke="#b8895e" strokeWidth="8" fill="none" />
          <path d="M55 140 L80 380 L220 380 L245 140 Z" fill="#c4956a" />
          <line x1="58" y1="180" x2="242" y2="180" stroke="#a98965" strokeWidth="2" opacity="0.5" />
          <line x1="65" y1="230" x2="235" y2="230" stroke="#a98965" strokeWidth="2" opacity="0.5" />
          <line x1="71" y1="280" x2="229" y2="280" stroke="#a98965" strokeWidth="2" opacity="0.5" />
          <line x1="77" y1="330" x2="223" y2="330" stroke="#a98965" strokeWidth="2" opacity="0.5" />
          <path d="M55 140 L245 140" stroke="#d4a574" strokeWidth="4" />
        </svg>
      </div>
    ),
  },

  // ── Wide Fan Wrap ──
  {
    id: "wrapper-fan",
    name: "Wide Fan",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 340 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Back fan shape - wider spread */}
          <path d="M10 120 L170 400 L330 120 Q300 80 170 90 Q40 80 10 120 Z" fill="#e0e7ff" />
          <path d="M10 120 L170 400 Q40 80 10 120 Z" fill="#c7d2fe" />
          {/* Pleats */}
          <line x1="60" y1="100" x2="155" y2="380" stroke="#a5b4fc" strokeWidth="1" opacity="0.3" />
          <line x1="120" y1="90" x2="162" y2="390" stroke="#a5b4fc" strokeWidth="1" opacity="0.3" />
          <line x1="220" y1="90" x2="178" y2="390" stroke="#a5b4fc" strokeWidth="1" opacity="0.3" />
          <line x1="280" y1="100" x2="185" y2="380" stroke="#a5b4fc" strokeWidth="1" opacity="0.3" />
          {/* Top edge trim */}
          <path d="M10 120 Q40 80 170 90 Q300 80 330 120" stroke="#818cf8" strokeWidth="2" fill="none" />
          {/* Ribbon at waist */}
          <path d="M130 250 Q170 270 210 250 Q170 280 130 250" fill="#6366f1" />
          <circle cx="170" cy="260" r="6" fill="#6366f1" />
          <path d="M160 265 L150 340 L165 330 L170 265 Z" fill="#6366f1" opacity="0.8" />
          <path d="M180 265 L190 340 L175 330 L170 265 Z" fill="#6366f1" opacity="0.8" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 340 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 120 L170 400 L330 120 Q300 80 170 90 Q40 80 10 120 Z" fill="#e0e7ff" />
          <path d="M10 120 L170 400 Q40 80 10 120 Z" fill="#c7d2fe" />
          <path d="M10 120 Q40 80 170 90 Q300 80 330 120" stroke="#818cf8" strokeWidth="2" fill="none" />
        </svg>
      </div>
    ),
  },

  // ── Heart Wrap ──
  {
    id: "wrapper-heart",
    name: "Heart Wrap",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Heart shape body */}
          <path d="M150 100 C150 60, 80 20, 50 80 C20 140, 50 200, 150 260 C250 200, 280 140, 250 80 C220 20, 150 60, 150 100 Z" fill="#f43f5e" />
          <path d="M150 100 C150 60, 80 20, 50 80 C20 140, 50 200, 150 260 Z" fill="#e11d48" />
          {/* Inner highlight */}
          <path d="M130 95 C130 70, 90 45, 70 85 C55 115, 75 150, 130 190" fill="#fb7185" opacity="0.4" />
          {/* Stem/handle */}
          <path d="M125 250 L130 400 L170 400 L175 250 Z" fill="#be185d" />
          <path d="M125 250 L130 400 L145 395 L140 250 Z" fill="#9f1239" />
          {/* Gold bow */}
          <path d="M120 260 Q150 280 180 260 Q150 290 120 260" fill="#fbbf24" />
          <circle cx="150" cy="268" r="5" fill="#fbbf24" />
          <path d="M142 273 L135 330" stroke="#fbbf24" strokeWidth="2" />
          <path d="M158 273 L165 330" stroke="#fbbf24" strokeWidth="2" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 100 C150 60, 80 20, 50 80 C20 140, 50 200, 150 260 C250 200, 280 140, 250 80 C220 20, 150 60, 150 100 Z" fill="#f43f5e" />
          <path d="M125 250 L130 400 L170 400 L175 250 Z" fill="#be185d" />
        </svg>
      </div>
    ),
  },

  // ── Furoshiki (Japanese Fabric Wrap) ──
  {
    id: "wrapper-furoshiki",
    name: "Furoshiki",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 320 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Back fabric drape */}
          <path d="M40 130 Q60 100 100 110 L160 110 Q200 100 280 130 L260 350 Q160 370 60 350 Z" fill="#7c3aed" />
          {/* Left fabric ear */}
          <path d="M40 130 Q10 80 30 40 Q50 20 80 50 L100 110 Z" fill="#8b5cf6" />
          <path d="M40 130 Q10 80 30 40 Q35 25 50 40 L60 110 Z" fill="#6d28d9" />
          {/* Right fabric ear */}
          <path d="M280 130 Q310 80 290 40 Q270 20 240 50 L220 110 Z" fill="#8b5cf6" />
          <path d="M280 130 Q310 80 290 40 Q285 25 270 40 L260 110 Z" fill="#6d28d9" />
          {/* Knot at top */}
          <ellipse cx="160" cy="115" rx="25" ry="12" fill="#a78bfa" />
          <circle cx="160" cy="112" r="8" fill="#7c3aed" />
          {/* Fabric pattern - small circles */}
          <circle cx="100" cy="200" r="4" fill="#a78bfa" opacity="0.3" />
          <circle cx="200" cy="180" r="4" fill="#a78bfa" opacity="0.3" />
          <circle cx="140" cy="280" r="4" fill="#a78bfa" opacity="0.3" />
          <circle cx="220" cy="260" r="4" fill="#a78bfa" opacity="0.3" />
          <circle cx="80" cy="300" r="4" fill="#a78bfa" opacity="0.3" />
          <circle cx="180" cy="320" r="4" fill="#a78bfa" opacity="0.3" />
          {/* Left shadow */}
          <path d="M40 130 L60 350 L80 350 L70 130 Z" fill="#6d28d9" opacity="0.3" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 320 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 130 Q60 100 100 110 L160 110 Q200 100 280 130 L260 350 Q160 370 60 350 Z" fill="#7c3aed" />
          <path d="M40 130 Q10 80 30 40 Q50 20 80 50 L100 110 Z" fill="#8b5cf6" />
          <path d="M280 130 Q310 80 290 40 Q270 20 240 50 L220 110 Z" fill="#8b5cf6" />
          <ellipse cx="160" cy="115" rx="25" ry="12" fill="#a78bfa" />
        </svg>
      </div>
    ),
  },

  // ── Crescent Moon ──
  {
    id: "wrapper-crescent",
    name: "Moon Cradle",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main crescent */}
          <path d="M60 200 Q30 100 100 50 Q170 0 230 60 Q280 120 260 220 Q250 280 200 330 Q150 370 100 340 Q60 310 60 200 Z" fill="#fbbf24" />
          {/* Inner cut to make crescent */}
          <circle cx="190" cy="160" r="110" fill="white" />
          {/* Re-overlay for depth */}
          <path d="M60 200 Q30 100 100 50 Q140 25 170 35" fill="#f59e0b" opacity="0.3" />
          {/* Stars around */}
          <path d="M240 80 L242 86 L248 88 L242 90 L240 96 L238 90 L232 88 L238 86 Z" fill="#fbbf24" />
          <circle cx="260" cy="130" r="2" fill="#fbbf24" />
          <circle cx="250" cy="60" r="1.5" fill="#fbbf24" />
          <path d="M90 330 L92 335 L97 336 L92 337 L90 342 L88 337 L83 336 L88 335 Z" fill="#fbbf24" opacity="0.6" />
          {/* Handle/stem */}
          <path d="M110 330 L125 395 L155 395 L150 340 Z" fill="#d97706" />
          <path d="M110 330 L125 395 L135 390 L125 330 Z" fill="#b45309" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 200 Q30 100 100 50 Q170 0 230 60 Q280 120 260 220 Q250 280 200 330 Q150 370 100 340 Q60 310 60 200 Z" fill="#fbbf24" />
          <circle cx="190" cy="160" r="110" fill="white" />
          <path d="M110 330 L125 395 L155 395 L150 340 Z" fill="#d97706" />
        </svg>
      </div>
    ),
  },

  // ── Round Pot / Vase ──
  {
    id: "wrapper-vase",
    name: "Round Vase",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main round body */}
          <ellipse cx="150" cy="250" rx="110" ry="120" fill="#86efac" />
          <ellipse cx="130" cy="240" rx="90" ry="100" fill="#4ade80" opacity="0.3" />
          {/* Neck */}
          <rect x="115" y="120" width="70" height="40" rx="5" fill="#22c55e" />
          {/* Rim */}
          <ellipse cx="150" cy="122" rx="45" ry="10" fill="#16a34a" />
          <ellipse cx="150" cy="122" rx="35" ry="7" fill="#4ade80" />
          {/* Decorative band */}
          <path d="M55 250 Q150 270 245 250" stroke="#16a34a" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M60 280 Q150 300 240 280" stroke="#16a34a" strokeWidth="2" fill="none" opacity="0.3" />
          {/* Leaf pattern */}
          <path d="M90 220 Q100 200 110 220 Q100 215 90 220 Z" fill="#16a34a" opacity="0.3" />
          <path d="M190 200 Q200 180 210 200 Q200 195 190 200 Z" fill="#16a34a" opacity="0.3" />
          {/* Base shadow */}
          <ellipse cx="150" cy="365" rx="80" ry="8" fill="#15803d" opacity="0.2" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="150" cy="250" rx="110" ry="120" fill="#86efac" />
          <rect x="115" y="120" width="70" height="40" rx="5" fill="#22c55e" />
          <ellipse cx="150" cy="122" rx="45" ry="10" fill="#16a34a" />
        </svg>
      </div>
    ),
  },

  // ── Envelope / Letter Wrap ──
  {
    id: "wrapper-envelope",
    name: "Love Letter",
    component: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 380" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main envelope body */}
          <rect x="40" y="120" width="220" height="240" rx="8" fill="#fef3c7" />
          <rect x="40" y="120" width="220" height="240" rx="8" stroke="#d97706" strokeWidth="1.5" fill="none" />
          {/* Top flap */}
          <path d="M40 120 L150 40 L260 120 Z" fill="#fde68a" />
          <path d="M40 120 L150 40 L260 120 Z" stroke="#d97706" strokeWidth="1.5" fill="none" />
          {/* Inner flap shadow */}
          <path d="M40 120 L150 200 L260 120" fill="#fbbf24" opacity="0.3" />
          {/* Heart seal */}
          <path d="M150 185 C150 175, 135 165, 130 180 C125 195, 150 210, 150 210 C150 210, 175 195, 170 180 C165 165, 150 175, 150 185 Z" fill="#ef4444" />
          {/* Decorative dots */}
          <circle cx="70" cy="300" r="3" fill="#f59e0b" opacity="0.3" />
          <circle cx="230" cy="300" r="3" fill="#f59e0b" opacity="0.3" />
          <circle cx="70" cy="330" r="3" fill="#f59e0b" opacity="0.3" />
          <circle cx="230" cy="330" r="3" fill="#f59e0b" opacity="0.3" />
        </svg>
      </div>
    ),
    thumbnail: ({ className }) => (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 300 380" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="120" width="220" height="240" rx="8" fill="#fef3c7" />
          <path d="M40 120 L150 40 L260 120 Z" fill="#fde68a" />
          <path d="M150 185 C150 175, 135 165, 130 180 C125 195, 150 210, 150 210 C150 210, 175 195, 170 180 C165 165, 150 175, 150 185 Z" fill="#ef4444" />
        </svg>
      </div>
    ),
  },
];
