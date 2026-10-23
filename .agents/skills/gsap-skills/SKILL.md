---
name: gsap-skills
description: >-
  Official GreenSock Animation Platform (GSAP) skill for high-performance web animations
  (greensock/gsap-skills). Guides React/Next.js useGSAP integration, ScrollTrigger,
  timeline sequencing, GPU hardware acceleration, and cleanup management.
---

# GSAP Animation Skills (`greensock/gsap-skills`)

Official GreenSock knowledge base for authoring smooth, 60fps web animations, timelines, and scroll interactions in modern frameworks.

---

## 1. Core GSAP Concepts & Rules

- **Tween Methods**: `gsap.to()`, `gsap.from()`, `gsap.fromTo()`, and `gsap.timeline()`.
- **Position Parameter**: Sequence tweens precisely in timelines using `"<"`, `">"`, `"+=0.2"`, or absolute timestamps.
- **Performant Properties**: Animate **only** compositor-friendly properties: `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `opacity`.
  - ❌ **Never** animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly (causes layout thrashing / reflow).
- **CSS Transition Conflict Ban**: Never apply CSS `transition` (or Tailwind `transition-all`) to properties being animated by GSAP.

---

## 2. React & Next.js Integration: `@gsap/react` (`useGSAP`)

Always use the official `useGSAP()` hook for React and Next.js applications:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins globally once on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scoped selector: automatically prefixes query with containerRef.current
      gsap.from(".hero-headline", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-card", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hero-card-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef } // Crucial: scopes animations & automatically cleans up on unmount!
  );

  return (
    <section ref={containerRef} className="relative">
      <h1 className="hero-headline">Editorial Mobility</h1>
      <div className="hero-card-grid">...</div>
    </section>
  );
}
```

---

## 3. ScrollTrigger Patterns & Rules

1. **Scrubbed Animations**:
   - Use `scrub: 1` (or `scrub: true`) to tie timeline progression directly to the user's scroll distance.
2. **Pinning Elements**:
   - Use `pin: true` and specify explicit `end` triggers (e.g. `end: "+=2000"` or `end: "bottom top"`).
   - Use `pinSpacing: true` or `false` intentionally depending on whether subsequent content should wait or slide beneath.
3. **Dynamic / Async Content**:
   - Call `ScrollTrigger.refresh()` after DOM layout shifts, images load, or route changes.
4. **Reduced Motion**:
   - Check `gsap.matchMedia()` or `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable or simplify tweens.
