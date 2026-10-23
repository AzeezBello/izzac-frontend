import * as React from "react";
import { cn } from "@/lib/utils";

export interface InkPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Draw the subtle dot grid. */
  grid?: boolean;
  padding?: "none" | "sm" | "default" | "lg";
}

const paddings = {
  none: "",
  sm: "p-5 md:p-6",
  default: "p-6 md:p-8 lg:p-10",
  lg: "p-8 md:p-12 lg:p-16",
};

/** The single dark emphasis surface per page. Keep to one per view. */
export function InkPanel({ grid = true, padding = "default", className, children, ...props }: InkPanelProps) {
  return (
    <div className={cn("ink-panel shadow-ink", grid && "ink-grid", paddings[padding], className)} {...props}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
