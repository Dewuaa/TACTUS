"use client";

import {
  Home,
  Save,
  FlipHorizontal,
  FlipVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Share2,
  Circle,
} from "lucide-react";
import { CanvasItem } from "@/lib/editorState";

interface EditorToolbarProps {
  selectedItem: CanvasItem | null;
  onFlipX: () => void;
  onFlipY: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSave: () => void;
  onShare: () => void;
  onDownload?: () => void;
}

export function EditorToolbar({
  selectedItem,
  onFlipX,
  onFlipY,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSave,
  onShare,
  onDownload,
}: EditorToolbarProps) {
  const hasSelection = selectedItem !== null;

  return (
    <div className="builder-glass-strong rounded-full flex items-center gap-1 px-2 py-1.5 float-in">
      {/* Navigation group */}
      <button className="toolbar-btn" title="Home">
        <Home className="w-[18px] h-[18px]" />
      </button>
      <button onClick={onSave} className="toolbar-btn" title="Save">
        <Save className="w-[18px] h-[18px]" />
      </button>

      <div className="toolbar-divider" />

      {/* Flip tools */}
      <button
        onClick={onFlipX}
        disabled={!hasSelection}
        className="toolbar-btn"
        title="Flip Horizontal"
      >
        <FlipHorizontal className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={onFlipY}
        disabled={!hasSelection}
        className="toolbar-btn"
        title="Flip Vertical"
      >
        <FlipVertical className="w-[18px] h-[18px]" />
      </button>

      <div className="toolbar-divider" />

      {/* Layer ordering */}
      <button
        onClick={onMoveUp}
        disabled={!hasSelection}
        className="toolbar-btn"
        title="Bring Forward"
      >
        <ArrowUp className="w-[18px] h-[18px]" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={!hasSelection}
        className="toolbar-btn"
        title="Send Backward"
      >
        <ArrowDown className="w-[18px] h-[18px]" />
      </button>

      {/* Download */}
      <button onClick={onDownload} className="toolbar-btn" title="Download">
        <Download className="w-[18px] h-[18px]" />
      </button>

      <div className="toolbar-divider" />

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={!hasSelection}
        className="toolbar-btn danger"
        title="Delete"
      >
        <Trash2 className="w-[18px] h-[18px]" />
      </button>

      <div className="toolbar-divider" />

      {/* Contextual status */}
      <div className="px-3 text-xs text-neutral-400 font-medium select-none whitespace-nowrap hidden md:block min-w-[120px] text-center">
        {hasSelection ? (
          <span className="text-neutral-600">{selectedItem.name}</span>
        ) : (
          "Select item to edit"
        )}
      </div>

      {/* Background color indicator */}
      <button className="toolbar-btn" title="Canvas Color">
        <Circle className="w-5 h-5 text-neutral-300 fill-white" strokeWidth={1.5} />
      </button>

      {/* Share button — gradient */}
      <button
        onClick={onShare}
        className="share-gradient text-white text-sm font-semibold rounded-full px-5 py-2 flex items-center gap-2 ml-1"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    </div>
  );
}
