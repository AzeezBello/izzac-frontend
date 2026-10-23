"use client";

import React, { useRef, useState } from "react";

interface GlassRefractionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  highlightColor?: string;
}

export function GlassRefraction({
  children,
  className = "",
  intensity = 0.35,
  highlightColor = "rgba(255, 255, 255, 0.4)",
}: GlassRefractionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xl transition-[border-color,box-shadow] duration-200 ${className}`}
      style={{
        boxShadow: isHovered
          ? "0 12px 32px -8px rgba(13, 23, 19, 0.08), 0 4px 12px -2px rgba(13, 23, 19, 0.03)"
          : "0 2px 8px -2px rgba(13, 23, 19, 0.04)",
      }}
    >
      {/* Specular refraction overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? intensity : 0,
          background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, ${highlightColor}, transparent 70%)`,
        }}
      />
      {/* Subtle specular rim border highlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl border transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          borderColor: "rgba(255, 255, 255, 0.25)",
        }}
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
