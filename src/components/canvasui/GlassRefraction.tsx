"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassRefractionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  highlightColor?: string;
}

/**
 * Pointer-tracked specular highlight over a bordered surface. DOM stays live:
 * text remains selectable and links clickable beneath the overlay.
 */
export function GlassRefraction({
  children,
  className = "",
  intensity = 0.35,
  highlightColor = "rgba(255, 255, 255, 0.45)",
}: GlassRefractionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/70 bg-surface-elevated/80 backdrop-blur-xl",
        "transition-[box-shadow,border-color] duration-200 ease-out-quart",
        isHovered ? "shadow-elevated border-input" : "shadow-card",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? intensity : 0,
          background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, ${highlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
