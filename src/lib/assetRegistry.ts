// Asset registry - simplified naming system
// Drop your Canva exports into /public/assets/bouquet/ with these filenames

export type AssetCategory = "templates" | "wrappers" | "flowers" | "fillers" | "accessories" | "seasonal" | "others";

export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  src: string;
  // Default dimensions on canvas
  defaultWidth: number;
  defaultHeight: number;
}

export const ASSET_CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: "templates", label: "Templates" },
  { id: "wrappers", label: "Wrappers" },
  { id: "flowers", label: "Flowers" },
  { id: "fillers", label: "Fillers" },
  { id: "accessories", label: "Accessories" },
  { id: "seasonal", label: "Seasonal" },
  { id: "others", label: "Others" },
];

// ────────────────────────────────────────────
// ASSETS — Update names and add/remove entries
// as you export more from Canva.
// ────────────────────────────────────────────
export const ASSETS: AssetDefinition[] = [
  // ── Wrappers ──
  // Just one PNG per wrapper. The wrapper sits behind flowers by default.
  {
    id: "wrapper-1",
    name: "Classic Cone",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-1.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },
  {
    id: "wrapper-2",
    name: "Kraft Paper",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-2.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },
  {
    id: "wrapper-3",
    name: "Pink Wrap",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-3.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },
  {
    id: "wrapper-4",
    name: "Gold Foil",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-4.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },
  {
    id: "wrapper-5",
    name: "Starlight",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-5.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },
  {
    id: "wrapper-6",
    name: "Lace",
    category: "wrappers",
    src: "/assets/bouquet/wrapper-6.png",
    defaultWidth: 220,
    defaultHeight: 300,
  },

  // ── Flowers ──
  {
    id: "flower-1",
    name: "Red Rose",
    category: "flowers",
    src: "/assets/bouquet/flower-1.png",
    defaultWidth: 80,
    defaultHeight: 140,
  },
  {
    id: "flower-2",
    name: "Pink Rose",
    category: "flowers",
    src: "/assets/bouquet/flower-2.png",
    defaultWidth: 80,
    defaultHeight: 140,
  },
  {
    id: "flower-3",
    name: "Sunflower",
    category: "flowers",
    src: "/assets/bouquet/flower-3.png",
    defaultWidth: 90,
    defaultHeight: 140,
  },
  {
    id: "flower-4",
    name: "Tulip",
    category: "flowers",
    src: "/assets/bouquet/flower-4.png",
    defaultWidth: 70,
    defaultHeight: 130,
  },
  {
    id: "flower-5",
    name: "Daisy",
    category: "flowers",
    src: "/assets/bouquet/flower-5.png",
    defaultWidth: 80,
    defaultHeight: 120,
  },
  {
    id: "flower-6",
    name: "Lily",
    category: "flowers",
    src: "/assets/bouquet/flower-6.png",
    defaultWidth: 90,
    defaultHeight: 140,
  },
  {
    id: "flower-7",
    name: "Lavender",
    category: "flowers",
    src: "/assets/bouquet/flower-7.png",
    defaultWidth: 60,
    defaultHeight: 140,
  },
  {
    id: "flower-8",
    name: "Peony",
    category: "flowers",
    src: "/assets/bouquet/flower-8.png",
    defaultWidth: 90,
    defaultHeight: 130,
  },

  // ── Fillers ──
  {
    id: "filler-1",
    name: "Baby's Breath",
    category: "fillers",
    src: "/assets/bouquet/filler-1.png",
    defaultWidth: 80,
    defaultHeight: 110,
  },
  {
    id: "filler-2",
    name: "Eucalyptus",
    category: "fillers",
    src: "/assets/bouquet/filler-2.png",
    defaultWidth: 70,
    defaultHeight: 130,
  },
  {
    id: "filler-3",
    name: "Fern",
    category: "fillers",
    src: "/assets/bouquet/filler-3.png",
    defaultWidth: 80,
    defaultHeight: 120,
  },
  {
    id: "filler-4",
    name: "Greenery",
    category: "fillers",
    src: "/assets/bouquet/filler-4.png",
    defaultWidth: 70,
    defaultHeight: 110,
  },

  // ── Accessories ──
  {
    id: "acc-1",
    name: "Pink Ribbon",
    category: "accessories",
    src: "/assets/bouquet/acc-1.png",
    defaultWidth: 100,
    defaultHeight: 70,
  },
  {
    id: "acc-2",
    name: "Gold Ribbon",
    category: "accessories",
    src: "/assets/bouquet/acc-2.png",
    defaultWidth: 100,
    defaultHeight: 70,
  },
  {
    id: "acc-3",
    name: "Gift Tag",
    category: "accessories",
    src: "/assets/bouquet/acc-3.png",
    defaultWidth: 60,
    defaultHeight: 80,
  },
  {
    id: "acc-4",
    name: "Butterfly",
    category: "accessories",
    src: "/assets/bouquet/acc-4.png",
    defaultWidth: 60,
    defaultHeight: 50,
  },
];

export function getAssetsByCategory(category: AssetCategory): AssetDefinition[] {
  return ASSETS.filter((a) => a.category === category);
}
