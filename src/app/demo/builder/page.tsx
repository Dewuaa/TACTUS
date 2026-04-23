"use client";

import { useReducer, useRef, useState, useCallback, useEffect } from "react";
import { editorReducer, CanvasItem, EditorState } from "@/lib/editorState";
import { SvgCanvasItem } from "@/components/builder/SvgCanvasItem";
import { LayerPanel } from "@/components/builder/LayerPanel";
import { EditorToolbar } from "@/components/builder/EditorToolbar";
import { AssetPanel } from "@/components/builder/AssetPanel";
import { SVG_WRAPPERS } from "@/components/builder/SvgWrappers";
import { SVG_FLOWERS, SvgFlowerStyle } from "@/components/builder/SvgFlowers";
import { Search, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "tactus-bouquet-draft";

type ToastMessage = {
  id: number;
  text: string;
  type: "success" | "error";
};

function loadDraft(): EditorState {
  if (typeof window === "undefined") return { items: [], selectedId: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EditorState;
      if (Array.isArray(parsed.items)) return { ...parsed, selectedId: null };
    }
  } catch { /* corrupted data, ignore */ }
  return { items: [], selectedId: null };
}

export default function BuilderPage() {
  const [state, dispatch] = useReducer(editorReducer, undefined, loadDraft);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);
  const nextZIndex = useRef(1);

  const toastId = useRef(0);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  // Measure canvas position for coordinate calculations
  const updateCanvasRect = useCallback(() => {
    if (canvasRef.current) {
      setCanvasRect(canvasRef.current.getBoundingClientRect());
    }
  }, []);

  // Keep canvas rect updated on resize
  useEffect(() => {
    updateCanvasRect();
    window.addEventListener("resize", updateCanvasRect);
    return () => window.removeEventListener("resize", updateCanvasRect);
  }, [updateCanvasRect]);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        if (state.selectedId) {
          dispatch({ type: "REMOVE_ITEM", id: state.selectedId });
        }
      }
      if (e.key === "Escape") {
        dispatch({ type: "SELECT_ITEM", id: null });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedId]);

  // ─── Add SVG Wrapper to Canvas ───
  const handleAddSvgWrapper = useCallback(
    (wrapperId: string, name: string) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const wrapperW = 220;
      const wrapperH = 300;
      const centerX = (rect.width - wrapperW) / 2;
      const centerY = (rect.height - wrapperH) / 2 + 30;

      const newItem: CanvasItem = {
        id: `${wrapperId}-${Date.now()}`,
        assetId: wrapperId,
        name,
        src: "__svg__",
        category: "wrappers",
        x: centerX,
        y: centerY,
        width: wrapperW,
        height: wrapperH,
        rotation: 0,
        flipX: false,
        flipY: false,
        zIndex: 0,
      };

      dispatch({ type: "ADD_ITEM", item: newItem });
    },
    []
  );

  // ─── Add SVG Flower/Filler/Accessory to Canvas ───
  const handleAddSvgFlower = useCallback(
    (flower: SvgFlowerStyle) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();

      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 40;
      const centerX = (rect.width - flower.defaultWidth) / 2 + offsetX;
      const centerY = (rect.height - flower.defaultHeight) / 2 + offsetY - 30;

      const newItem: CanvasItem = {
        id: `${flower.id}-${Date.now()}`,
        assetId: flower.id,
        name: flower.name,
        src: "__svg__",
        category: flower.category,
        x: centerX,
        y: centerY,
        width: flower.defaultWidth,
        height: flower.defaultHeight,
        rotation: 0,
        flipX: false,
        flipY: false,
        zIndex: nextZIndex.current++,
      };

      dispatch({ type: "ADD_ITEM", item: newItem });
    },
    []
  );

  // ─── Duplicate Selected ───
  const handleDuplicate = useCallback(() => {
    if (!state.selectedId) return;
    const item = state.items.find((i) => i.id === state.selectedId);
    if (!item) return;

    const newItem: CanvasItem = {
      ...item,
      id: `${item.assetId}-${Date.now()}`,
      x: item.x + 20,
      y: item.y + 20,
      zIndex: nextZIndex.current++,
    };
    dispatch({ type: "ADD_ITEM", item: newItem });
  }, [state.selectedId, state.items]);

  // ─── Duplicate by ID (for layer panel) ───
  const handleDuplicateById = useCallback((id: string) => {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    const newItem: CanvasItem = {
      ...item,
      id: `${item.assetId}-${Date.now()}`,
      x: item.x + 20,
      y: item.y + 20,
      zIndex: nextZIndex.current++,
    };
    dispatch({ type: "ADD_ITEM", item: newItem });
  }, [state.items]);

  // ─── Selection ───
  const handleSelect = useCallback((id: string) => {
    dispatch({ type: "SELECT_ITEM", id });
  }, []);

  const handleDeselect = useCallback(() => {
    dispatch({ type: "SELECT_ITEM", id: null });
  }, []);

  // ─── Item Updates ───
  const handleUpdate = useCallback((id: string, updates: Partial<CanvasItem>) => {
    dispatch({ type: "UPDATE_ITEM", id, updates });
  }, []);

  // ─── Toolbar Actions ───
  const selectedItem = state.items.find((i) => i.id === state.selectedId) ?? null;

  const handleFlipX = useCallback(() => {
    if (state.selectedId) {
      const item = state.items.find((i) => i.id === state.selectedId);
      if (item) dispatch({ type: "UPDATE_ITEM", id: state.selectedId, updates: { flipX: !item.flipX } });
    }
  }, [state.selectedId, state.items]);

  const handleFlipY = useCallback(() => {
    if (state.selectedId) {
      const item = state.items.find((i) => i.id === state.selectedId);
      if (item) dispatch({ type: "UPDATE_ITEM", id: state.selectedId, updates: { flipY: !item.flipY } });
    }
  }, [state.selectedId, state.items]);

  const handleMoveUp = useCallback(() => {
    if (state.selectedId) dispatch({ type: "MOVE_LAYER_UP", id: state.selectedId });
  }, [state.selectedId]);

  const handleMoveDown = useCallback(() => {
    if (state.selectedId) dispatch({ type: "MOVE_LAYER_DOWN", id: state.selectedId });
  }, [state.selectedId]);

  const handleDelete = useCallback(() => {
    if (state.selectedId) dispatch({ type: "REMOVE_ITEM", id: state.selectedId });
  }, [state.selectedId]);

  const handleRemoveById = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  }, []);

  const handleClearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
    nextZIndex.current = 1;
  }, []);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, selectedId: null }));
      showToast("Draft saved!");
    } catch {
      showToast("Failed to save draft", "error");
    }
  }, [state.items, showToast]);

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: "My TACTUS Bouquet",
      text: "Check out the bouquet I built on TACTUS! 💐",
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Couldn't share or copy link", "error");
    }
  }, [showToast]);

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;

    // Temporarily deselect to hide selection handles
    const prevSelected = state.selectedId;
    dispatch({ type: "SELECT_ITEM", id: null });

    // Wait a frame for the deselection to render
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    try {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      // Use an offscreen canvas to render the DOM content
      const offscreen = document.createElement("canvas");
      const scale = 2; // 2x for retina
      offscreen.width = rect.width * scale;
      offscreen.height = rect.height * scale;
      const ctx = offscreen.getContext("2d")!;
      ctx.scale(scale, scale);

      // Draw background
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw dot grid
      ctx.fillStyle = "#d4d4d4";
      for (let x = 0; x < rect.width; x += 20) {
        for (let y = 0; y < rect.height; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render each SVG item
      const sortedForExport = [...state.items].sort((a, b) => a.zIndex - b.zIndex);
      for (const item of sortedForExport) {
        const wrapper = SVG_WRAPPERS.find((w) => w.id === item.assetId);
        const flower = SVG_FLOWERS.find((f) => f.id === item.assetId);
        const SvgEl = wrapper?.component ?? flower?.component;
        if (!SvgEl) continue;

        // Find the rendered DOM element by item ID and grab its SVG
        const domItem = canvas.querySelector(`[data-item-id="${item.id}"]`);
        const svgEl = domItem?.querySelector("svg");
        if (!svgEl) continue;

        const svgClone = svgEl.cloneNode(true) as SVGElement;
        svgClone.setAttribute("width", String(item.width));
        svgClone.setAttribute("height", String(item.height));

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        });

        ctx.save();
        const cx = item.x + item.width / 2;
        const cy = item.y + item.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);
        ctx.drawImage(img, -item.width / 2, -item.height / 2, item.width, item.height);
        ctx.restore();

        URL.revokeObjectURL(url);
      }

      // Download
      const dataUrl = offscreen.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `tactus-bouquet-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Downloaded!");
    } catch (err) {
      console.error("Download failed:", err);
      showToast("Download failed", "error");
    } finally {
      // Restore selection
      if (prevSelected) dispatch({ type: "SELECT_ITEM", id: prevSelected });
    }
  }, [state.items, state.selectedId, showToast]);

  // Sort items by zIndex for rendering
  const sortedItems = [...state.items].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="builder-root h-screen flex flex-col overflow-hidden font-sans"
      style={{ background: "linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%)" }}
    >
      {/* ═══ Floating Top Bar Area ═══ */}
      <div className="relative z-30 flex items-center justify-between px-4 py-3">
        {/* Left: Floating Logo Pill */}
        <div className="builder-glass-strong rounded-2xl flex items-center gap-2.5 px-4 py-2 float-in">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)" }}
          >
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-neutral-800 font-semibold text-sm tracking-wide">
            the<span className="text-pink-500">Bouquet</span>
          </span>
        </div>

        {/* Center: Floating Toolbar */}
        <EditorToolbar
          selectedItem={selectedItem}
          onFlipX={handleFlipX}
          onFlipY={handleFlipY}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onDelete={handleDelete}
          onSave={handleSave}
          onShare={handleShare}
          onDownload={handleDownload}
        />

        {/* Right: spacer to balance layout */}
        <div className="w-[120px]" />
      </div>

      {/* ═══ Main Canvas + Floating Panels ═══ */}
      <div className="flex-1 relative overflow-hidden">
        {/* Canvas — full area */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
          <div
            ref={canvasRef}
            className="relative canvas-dotgrid rounded-xl overflow-hidden"
            style={{
              width: "100%",
              maxWidth: 560,
              aspectRatio: "3/4",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
            onClick={handleDeselect}
          >
            {/* Canvas items */}
            {sortedItems.map((item) => {
              if (item.src === "__svg__") {
                const wrapper = SVG_WRAPPERS.find((w) => w.id === item.assetId);
                const flower = SVG_FLOWERS.find((f) => f.id === item.assetId);
                const SvgComp = wrapper?.component ?? flower?.component;
                if (!SvgComp) return null;
                return (
                  <SvgCanvasItem
                    data-item-id={item.id}
                    key={item.id}
                    item={item}
                    isSelected={state.selectedId === item.id}
                    onSelect={handleSelect}
                    onUpdate={handleUpdate}
                    canvasRect={canvasRect}
                    SvgComponent={SvgComp}
                  />
                );
              }
              return null;
            })}

            {/* Empty state */}
            {state.items.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300 pointer-events-none">
                <div className="text-6xl mb-4 opacity-25">💐</div>
                <p className="text-sm font-medium text-neutral-400">Your canvas is empty</p>
                <p className="text-xs mt-1.5 text-neutral-400/80">
                  Pick a wrapper from below to start building!
                </p>
              </div>
            )}

            {/* Floating zoom button — bottom-right of canvas */}
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all border border-neutral-100 z-20"
              title="Download as PNG"
            >
              <Search className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Floating Layer Panel — right side */}
        <div className="absolute top-4 right-4 z-20 hidden md:block">
          <LayerPanel
            items={state.items}
            selectedId={state.selectedId}
            onSelect={handleSelect}
            onRemove={handleRemoveById}
            onDuplicate={handleDuplicateById}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
          />
        </div>

        {/* Clear All — floating badge if items exist */}
        {state.items.length > 0 && (
          <div className="absolute top-4 left-4 z-20 hidden md:block float-in">
            <button
              onClick={handleClearAll}
              className="builder-glass rounded-full px-4 py-1.5 text-xs font-medium text-neutral-500 hover:text-red-500 transition-colors"
            >
              Clear All ({state.items.length})
            </button>
          </div>
        )}
      </div>

      {/* ═══ Floating Bottom Asset Panel ═══ */}
      <div className="relative z-20 px-3 pb-2">
        <AssetPanel onAddSvgWrapper={handleAddSvgWrapper} onAddSvgFlower={handleAddSvgFlower} />
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg pointer-events-auto ${
                t.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {t.type === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
