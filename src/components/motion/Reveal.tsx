"use client";

import * as React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS selector for children to stagger; defaults to direct children. */
  selector?: string;
  stagger?: number;
  y?: number;
  delay?: number;
  once?: boolean;
  as?: "div" | "section" | "ul" | "ol" | "article";
}

/**
 * Scroll-triggered fade/slide using GSAP. Animates only transform + opacity.
 * Collapses to instant visibility under prefers-reduced-motion.
 */
export function Reveal({
  selector = ":scope > *",
  stagger = 0.08,
  y = 24,
  delay = 0,
  once = true,
  as: Tag = "div",
  className,
  children,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = root.querySelectorAll(selector);
      if (!targets.length || reduce) return;

      gsap.set(targets, { y, opacity: 0, willChange: "transform, opacity" });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay,
        stagger,
        ease: "power3.out",
        clearProps: "willChange",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [selector, stagger, y, delay, once] }
  );

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={cn(className)} {...props}>
      {children}
    </Component>
  );
}
