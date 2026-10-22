"use client";

import React, { useId, useState } from "react";
import { cn } from "@/lib/utils";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
};

/**
 * Accessible tooltip with a directional pointer arrow that points directly at its trigger button.
 * Supports pointer hover, keyboard focus, and Escape dismissal (WCAG 1.4.13).
 */
export const Tooltip = ({
  content,
  children,
  position = "bottom",
  className,
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }}
    >
      {children}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-emerald-900/40 bg-[#0d1713] px-2.5 py-1.5 font-mono text-[11px] font-medium text-stone-100 shadow-elevated transition-[opacity,transform] duration-150 ease-out-quart",
          position === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          open
            ? "opacity-100 translate-y-0"
            : position === "bottom"
            ? "opacity-0 -translate-y-1"
            : "opacity-0 translate-y-1"
        )}
      >
        {/* Pointer Arrow pointing directly to the button */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[#0d1713] border-emerald-900/40",
            position === "bottom"
              ? "-top-1 border-l border-t"
              : "-bottom-1 border-r border-b"
          )}
        />
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
