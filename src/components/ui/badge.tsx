import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "emerald"
  | "amber"
  | "destructive"
  | "dark"
  | "signal";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-foreground/80",
  outline: "border-border bg-surface-elevated/90 text-foreground",
  emerald: "border-primary/15 bg-primary-soft text-primary",
  amber: "border-amber-600/20 bg-amber-50 text-amber-800",
  destructive: "border-red-500/20 bg-red-50 text-red-800",
  dark: "border-white/12 bg-white/[0.08] text-ink-foreground",
  signal: "border-signal/30 bg-signal/15 text-signal",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

function Badge({ className, variant = "secondary", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-2xs font-semibold uppercase tracking-[0.1em] whitespace-nowrap leading-none",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
