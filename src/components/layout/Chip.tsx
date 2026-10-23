"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number | string;
  tone?: "default" | "ink";
}

/** Filter pill. Press feedback, aria-pressed, optional count. */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ active = false, count, tone = "default", className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium select-none",
        "transition-[background-color,border-color,color,transform] duration-150 ease-out-quart active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? tone === "ink"
            ? "border-ink bg-ink text-ink-foreground"
            : "border-primary bg-primary text-primary-foreground"
          : "border-border bg-surface-elevated text-foreground/80 hover:border-input hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className={cn("font-mono text-2xs tabular-nums", active ? "opacity-80" : "text-muted-foreground")}>
          {count}
        </span>
      )}
    </button>
  )
);
Chip.displayName = "Chip";

export function ChipGroup({ label, className, children }: { label?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap", className)}>
      {label && <span className="type-eyebrow text-muted-foreground mr-1 shrink-0">{label}</span>}
      {children}
    </div>
  );
}
