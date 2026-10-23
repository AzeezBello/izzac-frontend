"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

/** Canvas spark burst on click. Pointer-events pass through to children. */
export function ClickSpark({
  sparkColor = "hsl(161 72% 35%)",
  sparkSize = 8,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 400,
  children,
  className = "",
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  const draw = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;
        const progress = elapsed / duration;
        const ease = 1 - (1 - progress) * (1 - progress);
        const distance = ease * sparkRadius;
        const px = spark.x + Math.cos(spark.angle) * distance;
        const py = spark.y + Math.sin(spark.angle) * distance;

        ctx.save();
        ctx.fillStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.arc(px, py, (sparkSize / 2) * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      if (sparksRef.current.length > 0) requestAnimationFrame(draw);
    },
    [duration, sparkColor, sparkRadius, sparkSize]
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i * 2 * Math.PI) / sparkCount + (Math.random() - 0.5) * 0.3;
      sparksRef.current.push({ x, y, angle, startTime: now });
    }
    requestAnimationFrame(draw);
  };

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div ref={containerRef} onClick={handleClick} className={cn("relative inline-block", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" />
      {children}
    </div>
  );
}
