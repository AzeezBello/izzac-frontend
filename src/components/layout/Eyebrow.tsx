import * as React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Mono index rendered before the label, e.g. "01". */
  index?: string;
  tone?: "default" | "primary" | "muted" | "signal";
}

const tones: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  default: "text-foreground",
  primary: "text-primary",
  muted: "text-muted-foreground",
  signal: "text-signal",
};

export function Eyebrow({ index, tone = "primary", className, children, ...props }: EyebrowProps) {
  return (
    <span className={cn("type-eyebrow inline-flex items-center gap-2.5", tones[tone], className)} {...props}>
      {index && (
        <>
          <span className="tabular-nums opacity-70">{index}</span>
          <span aria-hidden="true" className="h-px w-5 bg-current opacity-40" />
        </>
      )}
      <span>{children}</span>
    </span>
  );
}
