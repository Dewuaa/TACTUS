import React from "react";

export interface SvgFlowerStyle {
  id: string;
  name: string;
  category: "flowers" | "fillers" | "accessories";
  defaultWidth: number;
  defaultHeight: number;
  component: React.FC<{ className?: string }>;
  thumbnail: React.FC<{ className?: string }>;
}

// ══════════════════════════════════
// ── FLOWERS
// ══════════════════════════════════

const RedRose: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 250" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Stem */}
    <path d="M60 100 Q58 180 60 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    {/* Leaves */}
    <path d="M58 150 Q30 135 25 155 Q35 165 58 155" fill="#3a8a3a" />
    <path d="M62 180 Q90 165 95 185 Q85 195 62 185" fill="#3a8a3a" />
    {/* Outer petals */}
    <circle cx="60" cy="65" r="35" fill="#dc2626" />
    <path d="M35 50 Q60 25 85 50 Q90 65 60 80 Q30 65 35 50 Z" fill="#ef4444" />
    <path d="M30 65 Q60 45 90 65 Q85 80 60 90 Q35 80 30 65 Z" fill="#b91c1c" />
    {/* Inner spiral */}
    <path d="M50 55 Q60 45 70 55 Q65 65 55 60 Q50 55 55 50 Z" fill="#991b1b" opacity="0.6" />
    {/* Highlight */}
    <circle cx="50" cy="50" r="6" fill="#fca5a5" opacity="0.3" />
  </svg>
);

const PinkRose: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 250" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 100 Q58 180 60 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M58 150 Q30 135 25 155 Q35 165 58 155" fill="#3a8a3a" />
    <path d="M62 180 Q90 165 95 185 Q85 195 62 185" fill="#3a8a3a" />
    <circle cx="60" cy="65" r="35" fill="#f472b6" />
    <path d="M35 50 Q60 25 85 50 Q90 65 60 80 Q30 65 35 50 Z" fill="#f9a8d4" />
    <path d="M30 65 Q60 45 90 65 Q85 80 60 90 Q35 80 30 65 Z" fill="#ec4899" />
    <path d="M50 55 Q60 45 70 55 Q65 65 55 60 Q50 55 55 50 Z" fill="#be185d" opacity="0.5" />
    <circle cx="50" cy="50" r="6" fill="#fce7f3" opacity="0.4" />
  </svg>
);

const WhiteRoseFlower: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 250" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 100 Q58 180 60 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M58 150 Q30 135 25 155 Q35 165 58 155" fill="#3a8a3a" />
    <path d="M62 180 Q90 165 95 185 Q85 195 62 185" fill="#3a8a3a" />
    <circle cx="60" cy="65" r="35" fill="#f5f5f4" />
    <path d="M35 50 Q60 25 85 50 Q90 65 60 80 Q30 65 35 50 Z" fill="white" />
    <path d="M30 65 Q60 45 90 65 Q85 80 60 90 Q35 80 30 65 Z" fill="#e7e5e4" />
    <path d="M50 55 Q60 45 70 55 Q65 65 55 60 Q50 55 55 50 Z" fill="#d6d3d1" opacity="0.4" />
    <circle cx="55" cy="60" r="5" fill="#fef3c7" opacity="0.5" />
  </svg>
);

const Sunflower: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 140 260" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M70 100 Q68 190 70 250" stroke="#2d6a2d" strokeWidth="5" fill="none" />
    <path d="M68 140 Q35 120 28 145 Q40 160 68 145" fill="#3a8a3a" />
    <path d="M72 175 Q105 155 112 180 Q100 195 72 180" fill="#3a8a3a" />
    {/* Petals - arranged radially */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <ellipse key={angle} cx="70" cy="25" rx="8" ry="22" fill="#fbbf24"
        transform={`rotate(${angle}, 70, 60)`} />
    ))}
    {/* Center */}
    <circle cx="70" cy="60" r="18" fill="#78350f" />
    <circle cx="70" cy="60" r="14" fill="#92400e" />
    {/* Seed texture dots */}
    <circle cx="65" cy="55" r="1.5" fill="#713f12" />
    <circle cx="75" cy="55" r="1.5" fill="#713f12" />
    <circle cx="70" cy="63" r="1.5" fill="#713f12" />
    <circle cx="63" cy="63" r="1.5" fill="#713f12" />
    <circle cx="77" cy="63" r="1.5" fill="#713f12" />
  </svg>
);

const Tulip: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 250" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 100 Q48 180 50 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M48 160 Q20 145 18 170 Q30 180 48 165" fill="#3a8a3a" />
    {/* Tulip petals - cup shape */}
    <path d="M25 85 Q30 30 50 20 Q70 30 75 85 Q50 95 25 85 Z" fill="#f43f5e" />
    <path d="M25 85 Q30 30 50 20" fill="#e11d48" />
    {/* Inner petal */}
    <path d="M35 80 Q40 40 50 30 Q60 40 65 80 Q50 88 35 80 Z" fill="#fb7185" opacity="0.5" />
    {/* Highlight */}
    <path d="M38 60 Q45 40 50 35" stroke="#fda4af" strokeWidth="2" fill="none" opacity="0.4" />
  </svg>
);

const PurpleTulip: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 250" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 100 Q48 180 50 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M52 155 Q80 140 82 165 Q70 175 52 160" fill="#3a8a3a" />
    <path d="M25 85 Q30 30 50 20 Q70 30 75 85 Q50 95 25 85 Z" fill="#8b5cf6" />
    <path d="M25 85 Q30 30 50 20" fill="#7c3aed" />
    <path d="M35 80 Q40 40 50 30 Q60 40 65 80 Q50 88 35 80 Z" fill="#a78bfa" opacity="0.5" />
  </svg>
);

const Daisy: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 90 Q58 170 60 230" stroke="#2d6a2d" strokeWidth="3" fill="none" />
    <path d="M58 130 Q35 118 30 138 Q40 148 58 135" fill="#3a8a3a" />
    {/* Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse key={angle} cx="60" cy="30" rx="7" ry="20" fill="white" stroke="#e5e7eb" strokeWidth="0.5"
        transform={`rotate(${angle}, 60, 55)`} />
    ))}
    {/* Center */}
    <circle cx="60" cy="55" r="12" fill="#fbbf24" />
    <circle cx="60" cy="55" r="8" fill="#f59e0b" />
  </svg>
);

const Lily: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 130 260" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M65 110 Q63 190 65 250" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M63 155 Q35 140 30 160 Q42 172 63 160" fill="#3a8a3a" />
    {/* Lily petals - pointed/star */}
    <path d="M65 15 Q55 40 30 60 Q55 55 65 75 Q75 55 100 60 Q75 40 65 15 Z" fill="#fda4af" />
    <path d="M65 15 Q55 40 30 60 Q55 55 65 75 Z" fill="#fb7185" />
    {/* Bottom petals */}
    <path d="M65 75 Q45 65 25 85 Q50 80 65 100 Q80 80 105 85 Q85 65 65 75 Z" fill="#f9a8d4" />
    {/* Center stamen dots */}
    <circle cx="55" cy="60" r="2" fill="#92400e" />
    <circle cx="75" cy="60" r="2" fill="#92400e" />
    <circle cx="65" cy="50" r="2" fill="#92400e" />
    {/* Spots */}
    <circle cx="50" cy="45" r="1.5" fill="#be185d" opacity="0.4" />
    <circle cx="80" cy="45" r="1.5" fill="#be185d" opacity="0.4" />
  </svg>
);

const Lavender: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 260" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M40 90 Q38 180 40 250" stroke="#2d6a2d" strokeWidth="3" fill="none" />
    <path d="M38 160 Q20 150 18 168 Q28 175 38 165" fill="#3a8a3a" />
    {/* Lavender buds - stacked */}
    {[0, 10, 20, 30, 40, 50, 60].map((offset) => (
      <React.Fragment key={offset}>
        <ellipse cx={37 + (offset % 2) * 6} cy={25 + offset} rx="8" ry="5" fill="#a78bfa" />
      </React.Fragment>
    ))}
    {/* Top bud */}
    <ellipse cx="40" cy="18" rx="5" ry="6" fill="#8b5cf6" />
  </svg>
);

const Peony: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 140 260" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M70 110 Q68 190 70 250" stroke="#2d6a2d" strokeWidth="5" fill="none" />
    <path d="M68 150 Q38 135 32 158 Q45 170 68 155" fill="#3a8a3a" />
    <path d="M72 180 Q102 165 108 188 Q95 200 72 185" fill="#3a8a3a" />
    {/* Outer ruffled petals */}
    <circle cx="70" cy="65" r="40" fill="#fda4af" />
    <path d="M35 45 Q55 20 70 25 Q85 20 105 45 Q110 65 95 80 Q70 95 45 80 Q30 65 35 45 Z" fill="#f9a8d4" />
    <path d="M40 55 Q60 30 70 35 Q80 30 100 55 Q105 70 90 80 Q70 90 50 80 Q35 70 40 55 Z" fill="#fbcfe8" />
    {/* Inner petals */}
    <path d="M50 50 Q65 35 70 40 Q75 35 90 50 Q92 65 80 72 Q70 78 60 72 Q48 65 50 50 Z" fill="#fce7f3" />
    {/* Center */}
    <circle cx="70" cy="58" r="8" fill="#fbbf24" opacity="0.5" />
  </svg>
);

const Carnation: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 250" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 100 Q58 180 60 240" stroke="#2d6a2d" strokeWidth="4" fill="none" />
    <path d="M58 140 Q32 128 28 148 Q38 158 58 145" fill="#3a8a3a" />
    {/* Ruffled petals */}
    <path d="M30 55 Q35 30 50 25 Q55 20 60 25 Q65 20 70 25 Q85 30 90 55 Q88 68 75 78 Q60 85 45 78 Q32 68 30 55 Z" fill="#fb7185" />
    <path d="M35 50 Q40 28 55 25 Q60 22 65 25 Q80 28 85 50 Q82 62 72 70 Q60 76 48 70 Q36 62 35 50 Z" fill="#fda4af" />
    <path d="M42 48 Q48 32 57 30 Q60 28 63 30 Q72 32 78 48 Q76 58 68 63 Q60 67 52 63 Q44 58 42 48 Z" fill="#fecdd3" />
    {/* Calyx */}
    <path d="M50 78 Q60 85 70 78 L68 95 Q60 100 52 95 Z" fill="#2d6a2d" />
  </svg>
);

// ══════════════════════════════════
// ── FILLERS
// ══════════════════════════════════

const BabysBreath: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 220" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 80 Q58 160 60 210" stroke="#5a8a5a" strokeWidth="2" fill="none" />
    {/* Branching stems */}
    <path d="M60 90 Q40 70 30 50" stroke="#5a8a5a" strokeWidth="1.5" fill="none" />
    <path d="M60 85 Q75 60 90 45" stroke="#5a8a5a" strokeWidth="1.5" fill="none" />
    <path d="M60 100 Q45 85 35 75" stroke="#5a8a5a" strokeWidth="1" fill="none" />
    <path d="M60 95 Q80 80 85 65" stroke="#5a8a5a" strokeWidth="1" fill="none" />
    <path d="M60 110 Q50 95 40 90" stroke="#5a8a5a" strokeWidth="1" fill="none" />
    {/* Tiny white flowers */}
    {[[30, 50], [35, 75], [40, 90], [90, 45], [85, 65], [50, 60], [75, 55], [65, 42], [45, 55]].map(([x, y], i) => (
      <React.Fragment key={i}>
        <circle cx={x} cy={y} r="4" fill="white" />
        <circle cx={x} cy={y} r="2" fill="#fef9c3" />
      </React.Fragment>
    ))}
  </svg>
);

const Eucalyptus: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M40 30 Q38 140 40 230" stroke="#4a7a4a" strokeWidth="2" fill="none" />
    {/* Paired leaves going down */}
    {[40, 70, 100, 130, 160, 190].map((y, i) => (
      <React.Fragment key={i}>
        <ellipse cx={i % 2 === 0 ? 28 : 52} cy={y} rx="14" ry="8" fill="#86efac"
          transform={`rotate(${i % 2 === 0 ? -20 : 20}, ${i % 2 === 0 ? 28 : 52}, ${y})`} />
      </React.Fragment>
    ))}
  </svg>
);

const Fern: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20 Q48 140 50 230" stroke="#3a7a3a" strokeWidth="2" fill="none" />
    {/* Fern leaflets */}
    {[30, 50, 70, 90, 110, 130, 150, 170, 190].map((y, i) => (
      <React.Fragment key={i}>
        <path d={`M50 ${y} Q${i % 2 === 0 ? 25 : 75} ${y - 8} ${i % 2 === 0 ? 20 : 80} ${y}`}
          stroke="#4ade80" strokeWidth="1.5" fill="#4ade80" opacity="0.6" />
      </React.Fragment>
    ))}
  </svg>
);

// ══════════════════════════════════
// ── ACCESSORIES
// ══════════════════════════════════

const PinkBow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Left loop */}
    <path d="M60 40 Q30 10 15 35 Q10 55 40 50 Z" fill="#f472b6" />
    <path d="M60 40 Q30 10 15 35" fill="#ec4899" />
    {/* Right loop */}
    <path d="M60 40 Q90 10 105 35 Q110 55 80 50 Z" fill="#f472b6" />
    <path d="M60 40 Q90 10 105 35" fill="#f9a8d4" />
    {/* Center knot */}
    <circle cx="60" cy="40" r="8" fill="#be185d" />
    {/* Tails */}
    <path d="M55 48 L40 75 L55 65 Z" fill="#ec4899" />
    <path d="M65 48 L80 75 L65 65 Z" fill="#f472b6" />
  </svg>
);

const GoldBow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 80" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M60 40 Q30 10 15 35 Q10 55 40 50 Z" fill="#fbbf24" />
    <path d="M60 40 Q30 10 15 35" fill="#f59e0b" />
    <path d="M60 40 Q90 10 105 35 Q110 55 80 50 Z" fill="#fbbf24" />
    <path d="M60 40 Q90 10 105 35" fill="#fde68a" />
    <circle cx="60" cy="40" r="8" fill="#d97706" />
    <path d="M55 48 L40 75 L55 65 Z" fill="#f59e0b" />
    <path d="M65 48 L80 75 L65 65 Z" fill="#fbbf24" />
  </svg>
);

const Butterfly: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Left wing */}
    <path d="M50 40 Q25 10 10 25 Q5 45 25 50 Q35 55 50 40 Z" fill="#a78bfa" />
    <path d="M50 40 Q30 50 20 60 Q15 70 35 65 Q45 58 50 40 Z" fill="#c4b5fd" />
    {/* Right wing */}
    <path d="M50 40 Q75 10 90 25 Q95 45 75 50 Q65 55 50 40 Z" fill="#8b5cf6" />
    <path d="M50 40 Q70 50 80 60 Q85 70 65 65 Q55 58 50 40 Z" fill="#a78bfa" />
    {/* Body */}
    <ellipse cx="50" cy="40" rx="3" ry="12" fill="#1c1917" />
    {/* Antennae */}
    <path d="M49 28 Q42 18 38 15" stroke="#1c1917" strokeWidth="1" fill="none" />
    <path d="M51 28 Q58 18 62 15" stroke="#1c1917" strokeWidth="1" fill="none" />
    <circle cx="38" cy="15" r="2" fill="#1c1917" />
    <circle cx="62" cy="15" r="2" fill="#1c1917" />
    {/* Wing spots */}
    <circle cx="30" cy="30" r="4" fill="#ddd6fe" opacity="0.5" />
    <circle cx="70" cy="30" r="4" fill="#ddd6fe" opacity="0.5" />
  </svg>
);

const GiftTag: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 110" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Tag body */}
    <path d="M15 25 L65 25 L65 100 L40 90 L15 100 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
    {/* Hole */}
    <circle cx="40" cy="15" r="5" fill="white" stroke="#d97706" strokeWidth="1" />
    {/* String */}
    <path d="M40 10 Q45 0 50 5" stroke="#785c3b" strokeWidth="1.5" fill="none" />
    {/* Heart */}
    <path d="M40 55 C40 50, 33 46, 32 52 C31 58, 40 64, 40 64 C40 64, 49 58, 48 52 C47 46, 40 50, 40 55 Z" fill="#f43f5e" />
    {/* Lines */}
    <line x1="25" y1="72" x2="55" y2="72" stroke="#d97706" strokeWidth="0.5" opacity="0.3" />
    <line x1="25" y1="78" x2="55" y2="78" stroke="#d97706" strokeWidth="0.5" opacity="0.3" />
    <line x1="25" y1="84" x2="45" y2="84" stroke="#d97706" strokeWidth="0.5" opacity="0.3" />
  </svg>
);


// ── EXPORT ──

export const SVG_FLOWERS: SvgFlowerStyle[] = [
  // Flowers
  { id: "svg-red-rose", name: "Red Rose", category: "flowers", defaultWidth: 80, defaultHeight: 160, component: RedRose, thumbnail: RedRose },
  { id: "svg-pink-rose", name: "Pink Rose", category: "flowers", defaultWidth: 80, defaultHeight: 160, component: PinkRose, thumbnail: PinkRose },
  { id: "svg-white-rose", name: "White Rose", category: "flowers", defaultWidth: 80, defaultHeight: 160, component: WhiteRoseFlower, thumbnail: WhiteRoseFlower },
  { id: "svg-sunflower", name: "Sunflower", category: "flowers", defaultWidth: 90, defaultHeight: 170, component: Sunflower, thumbnail: Sunflower },
  { id: "svg-tulip", name: "Red Tulip", category: "flowers", defaultWidth: 65, defaultHeight: 160, component: Tulip, thumbnail: Tulip },
  { id: "svg-purple-tulip", name: "Purple Tulip", category: "flowers", defaultWidth: 65, defaultHeight: 160, component: PurpleTulip, thumbnail: PurpleTulip },
  { id: "svg-daisy", name: "Daisy", category: "flowers", defaultWidth: 80, defaultHeight: 150, component: Daisy, thumbnail: Daisy },
  { id: "svg-lily", name: "Pink Lily", category: "flowers", defaultWidth: 85, defaultHeight: 170, component: Lily, thumbnail: Lily },
  { id: "svg-lavender", name: "Lavender", category: "flowers", defaultWidth: 55, defaultHeight: 170, component: Lavender, thumbnail: Lavender },
  { id: "svg-peony", name: "Peony", category: "flowers", defaultWidth: 90, defaultHeight: 170, component: Peony, thumbnail: Peony },
  { id: "svg-carnation", name: "Carnation", category: "flowers", defaultWidth: 80, defaultHeight: 160, component: Carnation, thumbnail: Carnation },

  // Fillers
  { id: "svg-babysbreath", name: "Baby's Breath", category: "fillers", defaultWidth: 80, defaultHeight: 140, component: BabysBreath, thumbnail: BabysBreath },
  { id: "svg-eucalyptus", name: "Eucalyptus", category: "fillers", defaultWidth: 55, defaultHeight: 160, component: Eucalyptus, thumbnail: Eucalyptus },
  { id: "svg-fern", name: "Fern", category: "fillers", defaultWidth: 70, defaultHeight: 160, component: Fern, thumbnail: Fern },

  // Accessories
  { id: "svg-pink-bow", name: "Pink Bow", category: "accessories", defaultWidth: 80, defaultHeight: 55, component: PinkBow, thumbnail: PinkBow },
  { id: "svg-gold-bow", name: "Gold Bow", category: "accessories", defaultWidth: 80, defaultHeight: 55, component: GoldBow, thumbnail: GoldBow },
  { id: "svg-butterfly", name: "Butterfly", category: "accessories", defaultWidth: 65, defaultHeight: 50, component: Butterfly, thumbnail: Butterfly },
  { id: "svg-gift-tag", name: "Gift Tag", category: "accessories", defaultWidth: 50, defaultHeight: 70, component: GiftTag, thumbnail: GiftTag },
];
