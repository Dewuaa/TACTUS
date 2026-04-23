export type ThemeType = "romance" | "cyberpunk";

export interface ThemeConfig {
  type: ThemeType;
  colors: {
    primary: string; // e.g., 'rose-500', 'green-500'
    primaryHex: string; // for inline styles
    primaryText: string; // e.g., 'text-rose-500', 'text-green-500'
    gradientFrom: string;
    gradientTo: string;
    bg: string; // 'bg-neutral-950'
    textMain: string;
    textSub: string;
  };
  particles: {
    type: "hearts" | "matrix" | "stars";
    colorHex: string;
  };
  typography: {
    titleFontClass: string;
    letterFontClass: string;
  };
  textContent: {
    heroTitle: string;
    heroSubtitle: string;
    scrollHint: string;
    memoryTitle: string;
    memorySubtitle: string;
  };
}

export const ROMANCE_CONFIG: ThemeConfig = {
  type: "romance",
  colors: {
    primary: "rose-500",
    primaryHex: "#f43f5e",
    primaryText: "text-rose-500",
    gradientFrom: "from-rose-200",
    gradientTo: "to-rose-200",
    bg: "bg-neutral-950",
    textMain: "text-rose-50",
    textSub: "text-rose-200/60",
  },
  particles: {
    type: "hearts",
    colorHex: "rgba(244, 63, 94, 0.5)",
  },
  typography: {
    titleFontClass: "font-serif tracking-widest", // We will apply Great Vibes in the page
    letterFontClass: "font-sans font-light",
  },
  textContent: {
    heroTitle: "Happy Birthday",
    heroSubtitle: "My Everything",
    scrollHint: "Scroll to Open",
    memoryTitle: "A Million Memories",
    memorySubtitle: "Every moment with you feels like a dream. Here are a few of my favorites.",
  },
};

export const CYBERPUNK_CONFIG: ThemeConfig = {
  type: "cyberpunk",
  colors: {
    primary: "green-500",
    primaryHex: "#22c55e",
    primaryText: "text-green-500",
    gradientFrom: "from-green-400",
    gradientTo: "to-emerald-200",
    bg: "bg-black",
    textMain: "text-green-50",
    textSub: "text-green-400/60",
  },
  particles: {
    type: "matrix",
    colorHex: "rgba(34, 197, 94, 0.7)",
  },
  typography: {
    titleFontClass: "font-mono font-bold uppercase tracking-tighter",
    letterFontClass: "font-mono text-sm uppercase tracking-widest",
  },
  textContent: {
    heroTitle: "LEVEL UP",
    heroSubtitle: "SYSTEM INITIALIZED",
    scrollHint: "INITIALIZE UPLINK",
    memoryTitle: "DATABANKS RECOVERED",
    memorySubtitle: "Restoring corrupted memory fragments from the mainframe.",
  },
};

export function getThemeConfig(themeName: string): ThemeConfig {
  if (themeName === "cyberpunk") return CYBERPUNK_CONFIG;
  return ROMANCE_CONFIG;
}
