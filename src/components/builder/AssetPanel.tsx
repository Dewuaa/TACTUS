"use client";

import { useState, useRef } from "react";
import { AssetCategory, ASSET_CATEGORIES } from "@/lib/assetRegistry";
import { SVG_WRAPPERS } from "@/components/builder/SvgWrappers";
import { SVG_FLOWERS, SvgFlowerStyle } from "@/components/builder/SvgFlowers";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AssetPanelProps {
  onAddSvgWrapper: (wrapperId: string, name: string) => void;
  onAddSvgFlower: (flower: SvgFlowerStyle) => void;
}

export function AssetPanel({ onAddSvgWrapper, onAddSvgFlower }: AssetPanelProps) {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("wrappers");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter SVG flowers by active category
  const svgItems = SVG_FLOWERS.filter((f) => f.category === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -240 : 240;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Check if active category has items
  const hasWrappers = activeCategory === "wrappers";
  const hasItems = hasWrappers ? SVG_WRAPPERS.length > 0 : svgItems.length > 0;

  return (
    <div className="builder-glass-strong rounded-t-2xl flex flex-col float-in">
      {/* Category Tabs — Pill style */}
      <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto scrollbar-none">
        {ASSET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`category-pill px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
              activeCategory === cat.id
                ? "active"
                : "text-neutral-500"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Asset Grid with scroll */}
      <div className="relative">
        {/* Left scroll button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all border border-neutral-100"
        >
          <ChevronLeft className="w-4 h-4 text-neutral-500" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto py-4 px-12 scrollbar-none"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* SVG Wrappers */}
          {hasWrappers &&
            SVG_WRAPPERS.map((wrapper) => (
              <button
                key={wrapper.id}
                onClick={() => onAddSvgWrapper(wrapper.id, wrapper.name)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="asset-card w-[72px] h-[88px] bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-neutral-100 p-1.5">
                  <wrapper.thumbnail className="w-full h-full" />
                </div>
                <span className="text-[10px] text-neutral-500 font-medium max-w-[76px] truncate text-center leading-tight">
                  {wrapper.name}
                </span>
              </button>
            ))}

          {/* SVG Flowers / Fillers / Accessories */}
          {!hasWrappers &&
            svgItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onAddSvgFlower(item)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="asset-card w-[72px] h-[88px] bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-neutral-100 p-2">
                  <item.thumbnail className="w-full h-full" />
                </div>
                <span className="text-[10px] text-neutral-500 font-medium max-w-[76px] truncate text-center leading-tight">
                  {item.name}
                </span>
              </button>
            ))}

          {/* Empty state for categories with no items */}
          {!hasItems && (
            <div className="flex-1 flex items-center justify-center py-4 w-full min-w-[200px]">
              <p className="text-sm text-neutral-400 font-medium">
                Coming soon ✨
              </p>
            </div>
          )}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all border border-neutral-100"
        >
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </button>
      </div>
    </div>
  );
}
