"use client";

import { motion } from "framer-motion";
import { RefObject } from "react";

interface DraggableFlowerProps {
  id: string;
  emoji: string;
  constraintsRef: RefObject<HTMLDivElement | null>;
  initialX: number;
  initialY: number;
  rotation: number;
  onRemove: (id: string) => void;
}

export function DraggableFlower({
  id,
  emoji,
  constraintsRef,
  initialX,
  initialY,
  rotation,
  onRemove
}: DraggableFlowerProps) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      dragMomentum={false}
      initial={{ x: initialX, y: initialY - 50, scale: 0, rotate: rotation - 45, opacity: 0 }}
      animate={{ x: initialX, y: initialY, scale: 1, rotate: rotation, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileDrag={{ scale: 1.2, zIndex: 50, cursor: "grabbing" }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute text-5xl md:text-6xl cursor-grab select-none filter drop-shadow-md group flex flex-col items-center justify-center"
      style={{ touchAction: "none" }} // Prevents scrolling on mobile while dragging
    >
      <div className="relative">
        <span style={{ display: "inline-block", transform: "rotate(-15deg)" }}>{emoji}</span>
        
        {/* Delete button appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="absolute -top-4 -right-4 bg-white text-rose-500 rounded-full w-6 h-6 flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform md:block hidden text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
