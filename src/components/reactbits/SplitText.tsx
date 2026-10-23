"use client";

import React, { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationDuration?: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function SplitText({
  text,
  className = "",
  delay = 35,
  animationDuration = 600,
  tag: Tag = "h1",
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    // @ts-expect-error Tag polymorphic element
    <Tag ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => {
        const letters = word.split("");
        // Calculate cumulative letter index for smooth staggering
        const wordOffset = words
          .slice(0, wordIndex)
          .reduce((acc, curr) => acc + curr.length + 1, 0);

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {letters.map((letter, letterIndex) => {
              const totalIndex = wordOffset + letterIndex;
              return (
                <span
                  key={letterIndex}
                  className="inline-block transition-[transform,opacity] will-change-transform"
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(0.4em)",
                    opacity: isVisible ? 1 : 0,
                    transitionDuration: `${animationDuration}ms`,
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: `${totalIndex * delay}ms`,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
