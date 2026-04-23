"use client";

import { CanvasItem } from "@/lib/editorState";
import { Layers, Trash2, Copy } from "lucide-react";
import { SVG_WRAPPERS } from "@/components/builder/SvgWrappers";
import { SVG_FLOWERS } from "@/components/builder/SvgFlowers";
import { ComponentType, SVGProps } from "react";

interface LayerPanelProps {
  items: CanvasItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

// Resolve the SVG thumbnail for a given canvas item
function getItemThumbnail(item: CanvasItem): ComponentType<SVGProps<SVGSVGElement>> | null {
  const wrapper = SVG_WRAPPERS.find((w) => w.id === item.assetId);
  if (wrapper) return wrapper.thumbnail;
  const flower = SVG_FLOWERS.find((f) => f.id === item.assetId);
  if (flower) return flower.thumbnail;
  return null;
}

export function LayerPanel({
  items,
  selectedId,
  onSelect,
  onRemove,
  onDuplicate,
}: LayerPanelProps) {
  // Display items in reverse order (top layer first)
  const sortedItems = [...items].reverse();

  return (
    <div className="builder-glass-strong rounded-2xl flex flex-col overflow-hidden float-in w-60">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-semibold text-neutral-700">Layers</span>
        </div>
        {/* Layer count badge */}
        <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 rounded-full px-2 py-0.5">
          {items.length}
        </span>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto max-h-[50vh]">
        {sortedItems.length === 0 && (
          <div className="px-4 py-10 text-center">
            <div className="text-3xl mb-2 opacity-40">🎨</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No layers yet.<br />
              Add items from the panel below!
            </p>
          </div>
        )}

        {sortedItems.map((item) => {
          const Thumb = getItemThumbnail(item);
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`layer-row flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${
                selectedId === item.id ? "selected" : ""
              }`}
            >
              {/* SVG Thumbnail */}
              <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-100">
                {Thumb ? (
                  <Thumb className="w-7 h-7" />
                ) : (
                  <div className="w-full h-full bg-neutral-100 rounded" />
                )}
              </div>

              {/* Name */}
              <span className="text-xs text-neutral-600 font-medium truncate flex-1">
                {item.name}
              </span>

              {/* Action buttons — visible on hover */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDuplicate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(item.id);
                    }}
                    className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3 text-neutral-400" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
