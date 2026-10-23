import * as React from "react";
import { cn } from "@/lib/utils";

export interface LedgerProps extends React.HTMLAttributes<HTMLDivElement> {
  inverted?: boolean;
  /** Remove outer top/bottom rules. */
  flush?: boolean;
}

/** Vertical stack of rows separated by hairlines. */
export function Ledger({ inverted, flush, className, ...props }: LedgerProps) {
  return (
    <div
      className={cn(
        "divide-y",
        inverted ? "divide-white/10" : "divide-border/70",
        !flush && (inverted ? "border-y border-white/10" : "border-y border-border/70"),
        className
      )}
      {...props}
    />
  );
}

export interface LedgerRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  index?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-hand slot: price, badge, arrow. */
  aside?: React.ReactNode;
  inverted?: boolean;
  /** Dense rows for lists; `default` for editorial steps. */
  density?: "compact" | "default" | "relaxed";
}

const densityStyles = {
  compact: "py-3.5 gap-4",
  default: "py-6 gap-5 md:gap-8",
  relaxed: "py-8 md:py-10 gap-6 md:gap-10",
};

export function LedgerRow({ index, title, description, aside, inverted, density = "default", className, ...props }: LedgerRowProps) {
  return (
    <div className={cn("grid grid-cols-[auto_1fr] items-start sm:grid-cols-[auto_1fr_auto]", densityStyles[density], className)} {...props}>
      <span
        className={cn(
          "font-mono text-xs tabular-nums pt-1 w-8",
          inverted ? "text-signal" : "text-primary",
          !index && "w-0"
        )}
      >
        {index}
      </span>
      <div className="min-w-0 space-y-1.5">
        <h3 className={cn("text-base md:text-lg font-medium tracking-[-0.015em]", inverted ? "text-ink-foreground" : "text-foreground")}>{title}</h3>
        {description && (
          <p className={cn("text-sm leading-relaxed max-w-[64ch]", inverted ? "text-ink-muted" : "text-muted-foreground")}>{description}</p>
        )}
      </div>
      {aside && (
        <div className="col-start-2 shrink-0 text-left sm:col-start-auto sm:pl-2 sm:text-right -mt-2 sm:mt-0">{aside}</div>
      )}
    </div>
  );
}
