---
name: scroll-world
description: >-
  Immersive scroll-scrubbed 3D cinematic landing page architecture (oso95/scroll-world).
  Orchestrates multi-scene camera flight paths, frame-scrubbed video/canvas timelines,
  and narrative chapter sequencing tied directly to page scroll position.
---

# Scroll World Skill (`oso95/scroll-world`)

The **Scroll World** skill guides the architecture of immersive, cinematic "fly-through" web experiences where user vertical scrolling acts as a precision time-scrubber through 3D environments or frame sequences.

---

## 1. Multi-Stage Scene Architecture

1. **Chapter Storyboarding**:
   - Divide the journey into 3–5 distinct visual narrative stages (e.g. *Stage 1: Skyline Fleet Aerial*, *Stage 2: Exterior Vehicle Silhouette*, *Stage 3: Interior Tactile Cockpit*, *Stage 4: Connected Telemetry Engine*).
2. **Three-Asset Continuity Pipeline**:
   - **Stills**: Key high-resolution benchmark frames at the apex of each stage.
   - **Dive-In Sequences**: Fluid camera fly-through sequences entering the scene.
   - **Connector Clips / Transitions**: Boundary frames engineered so adjacent scenes bridge without hard visual cuts.

---

## 2. Scroll-to-Time Scrubbing Runtime Engine

Rather than heavy WebGL 3D meshes when simple camera paths suffice, Scroll World binds canvas frame scrubbing to scroll delta:

```tsx
"use client";

import { useEffect, useRef } from "react";

interface ScrollWorldProps {
  frameCount: number;
  framePath: (index: number) => string;
  children?: React.ReactNode;
}

export function ScrollWorldCanvas({ frameCount, framePath, children }: ScrollWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Preload keyframes
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) renderFrame(0);
      };
      images.push(img);
    }

    const renderFrame = (index: number) => {
      const img = images[Math.min(index, frameCount - 1)];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1);
      const frameIndex = Math.floor(progress * (frameCount - 1));
      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frameCount, framePath]);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
      </div>
    </div>
  );
}
```

---

## 3. Interaction & Accessibility Safeguards
- **Reduced Motion**: When `prefers-reduced-motion: reduce` is active, collapse the multi-viewport scroll sequence into a clean static presentation card deck.
- **Pointer Events**: Ensure the canvas overlay has `pointer-events-none` so foreground interactive text, buttons, and telemetry remain fully clickable and selectable.
- **Smooth Scrubbing**: Leverage requestAnimationFrame or GSAP ScrollTrigger `scrub: 1` to prevent jitter on rapid trackpad scrolls.
