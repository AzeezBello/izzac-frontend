"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Delay between words in ms. */
  delay?: number;
  animationDuration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

/**
 * Word-level reveal on first intersection. Animates transform + opacity only;
 * collapses to static text under prefers-reduced-motion.
 */
export function SplitText({ text, className = "", delay = 45, animationDuration = 700, tag: Tag = "h1" }: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    // @ts-expect-error polymorphic tag ref
    <Tag ref={containerRef} className={cn("inline-block", className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] mr-[0.25em] align-top">
          <span
            className="inline-block will-change-transform"
            style={
              reduceMotion
                ? undefined
                : {
                    transform: isVisible ? "translateY(0)" : "translateY(110%)",
                    opacity: isVisible ? 1 : 0,
                    transition: `transform ${animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms, opacity ${Math.round(
                      animationDuration * 0.6
                    )}ms ease-out ${i * delay}ms`,
                  }
            }
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
