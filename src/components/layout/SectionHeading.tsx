import * as React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export interface SectionHeadingProps {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Right-aligned action (button / link) on desktop. */
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  inverted?: boolean;
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lede,
  action,
  as: Tag = "h2",
  size = "h1",
  align = "left",
  className,
  inverted = false,
}: SectionHeadingProps) {
  const sizeClass =
    size === "display" ? "text-display" : size === "h1" ? "text-h1" : "text-h2";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className
      )}
    >
      <div className={cn("space-y-4", align === "center" ? "max-w-3xl" : "max-w-[46rem]")}>
        {eyebrow && (
          <Eyebrow index={index} tone={inverted ? "signal" : "primary"}>
            {eyebrow}
          </Eyebrow>
        )}
        <Tag className={cn(sizeClass, inverted ? "text-ink-foreground" : "text-foreground")}>{title}</Tag>
        {lede && (
          <p className={cn("type-lede max-w-[60ch]", inverted && "text-ink-muted", align === "center" && "mx-auto")}>
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1">{action}</div>}
    </div>
  );
}
