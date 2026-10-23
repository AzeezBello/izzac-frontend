import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "default" | "primary" | "signal";
  size?: "sm" | "default" | "lg";
  inverted?: boolean;
}

const valueSizes = {
  sm: "text-lg",
  default: "text-2xl md:text-[1.75rem]",
  lg: "text-3xl md:text-4xl",
};

/** Single telemetry figure: mono label, tabular value, optional detail. */
export function Stat({ label, value, detail, tone = "default", size = "default", inverted, className, ...props }: StatProps) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)} {...props}>
      <p className={cn("type-eyebrow", inverted ? "text-ink-muted" : "text-muted-foreground")}>{label}</p>
      <p
        className={cn(
          "font-mono font-semibold tabular-nums tracking-tight leading-none",
          valueSizes[size],
          tone === "primary" && "text-primary",
          tone === "signal" && "text-signal",
          tone === "default" && (inverted ? "text-ink-foreground" : "text-foreground")
        )}
      >
        {value}
      </p>
      {detail && (
        <p className={cn("text-xs leading-relaxed", inverted ? "text-ink-muted" : "text-muted-foreground")}>{detail}</p>
      )}
    </div>
  );
}

export interface StatStripProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5;
  inverted?: boolean;
  /** `rule` draws hairlines between cells; `card` wraps the strip in a bordered surface. */
  variant?: "rule" | "card";
}

const columnStyles: Record<NonNullable<StatStripProps["columns"]>, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

/** Hairline-divided grid of <Stat/>. No cards-in-cards. */
export function StatStrip({ columns = 4, inverted, variant = "rule", className, children, ...props }: StatStripProps) {
  const divider = inverted ? "divide-white/10 border-white/10" : "divide-border/70 border-border/70";
  return (
    <div
      className={cn(
        "grid",
        columnStyles[columns],
        variant === "rule"
          ? cn("border-y [&>*]:py-5 [&>*]:px-4 md:[&>*]:px-6 [&>*:first-child]:pl-0", divider)
          : cn("rounded-lg border bg-surface-elevated [&>*]:p-5 md:[&>*]:p-6", inverted ? "border-white/10 bg-white/[0.03]" : "border-border/80"),
        "gap-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
