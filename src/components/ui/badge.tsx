import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "emerald"
  | "destructive"
  | "dark";

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground",
  secondary:
    "border-border/70 bg-secondary text-secondary-foreground",
  outline:
    "border-border bg-card/80 text-foreground",
  emerald:
    "border-emerald-800/15 bg-emerald-950/[0.06] text-emerald-900",
  destructive:
    "border-red-500/20 bg-red-500/10 text-red-800",
  dark:
    "border-white/15 bg-white/10 text-stone-100",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] whitespace-nowrap",
        "transition-colors duration-150 ease-out-quart",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
