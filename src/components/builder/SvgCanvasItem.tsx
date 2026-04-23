"use client";

import { useRef, useState, useCallback } from "react";
import { CanvasItem } from "@/lib/editorState";

interface SvgCanvasItemProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasItem>) => void;
  canvasRect: DOMRect | null;
  SvgComponent: React.FC<{ className?: string }>;
  "data-item-id"?: string;
}

export function SvgCanvasItem({
  item,
  isSelected,
  onSelect,
  onUpdate,
  canvasRect,
  SvgComponent,
  "data-item-id": dataItemId,
}: SvgCanvasItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isResizing || isRotating) return;
      e.stopPropagation();
      onSelect(item.id);
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - item.x, y: e.clientY - item.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [item.id, item.x, item.y, onSelect, isResizing, isRotating]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      onUpdate(item.id, { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    },
    [isDragging, item.id, onUpdate]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent, corner: string) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
      const startX = e.clientX;
      const startW = item.width;
      const startH = item.height;
      const startItemX = item.x;
      const startItemY = item.y;
      const aspect = startW / startH;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        let newW = corner.includes("right") ? Math.max(60, startW + dx) : Math.max(60, startW - dx);
        let newH = newW / aspect;
        let newX = corner.includes("left") ? startItemX + (startW - newW) : startItemX;
        let newY = corner.includes("top") ? startItemY + (startH - newH) : startItemY;
        onUpdate(item.id, { width: newW, height: newH, x: newX, y: newY });
      };
      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item, onUpdate]
  );

  const handleRotateStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsRotating(true);
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      const onMove = (ev: PointerEvent) => {
        if (!canvasRect) return;
        const angle = Math.atan2(ev.clientY - canvasRect.top - centerY, ev.clientX - canvasRect.left - centerX);
        onUpdate(item.id, { rotation: Math.round((angle * 180) / Math.PI + 90) });
      };
      const onUp = () => {
        setIsRotating(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [item, onUpdate, canvasRect]
  );

  const transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg) scaleX(${item.flipX ? -1 : 1}) scaleY(${item.flipY ? -1 : 1})`;

  return (
    <div
      data-item-id={dataItemId}
      className={`absolute top-0 left-0 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        transform,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex + (isDragging ? 1000 : 0),
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Render the SVG component */}
      <SvgComponent className="w-full h-full pointer-events-none" />

      {/* Selection outline + handles */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-sky-500 pointer-events-none rounded-sm" />
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner) => {
            const isTop = corner.includes("top");
            const isLeft = corner.includes("left");
            return (
              <div
                key={corner}
                className="absolute w-3 h-3 bg-white border-2 border-sky-500 rounded-sm cursor-nwse-resize z-10"
                style={{
                  top: isTop ? -6 : undefined,
                  bottom: isTop ? undefined : -6,
                  left: isLeft ? -6 : undefined,
                  right: isLeft ? undefined : -6,
                }}
                onPointerDown={(e) => handleResizeStart(e, corner)}
              />
            );
          })}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-sky-500 rounded-full cursor-alias z-10 flex items-center justify-center"
            onPointerDown={handleRotateStart}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-sky-500">
              <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <div className="absolute -top-8 left-1/2 w-[2px] h-6 bg-sky-500 -translate-x-1/2" />
        </>
      )}
    </div>
  );
}
