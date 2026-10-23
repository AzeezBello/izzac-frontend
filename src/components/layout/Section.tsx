import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical rhythm. */
  spacing?: "none" | "sm" | "default" | "lg";
  /** Background band. */
  tone?: "default" | "surface" | "ink";
  /** Hairline rules above / below. */
  rule?: "none" | "top" | "bottom" | "both";
  container?: ContainerProps["size"] | false;
}

const spacingStyles: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm: "py-10 md:py-14",
  default: "py-16 md:py-24",
  lg: "py-20 md:py-32",
};

const toneStyles: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "",
  surface: "bg-surface",
  ink: "bg-ink text-ink-foreground",
};

const ruleStyles: Record<NonNullable<SectionProps["rule"]>, string> = {
  none: "",
  top: "border-t border-border/70",
  bottom: "border-b border-border/70",
  both: "border-y border-border/70",
};

export function Section({
  spacing = "default",
  tone = "default",
  rule = "none",
  container = "wide",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacingStyles[spacing], toneStyles[tone], ruleStyles[rule], className)}
      {...props}
    >
      {container ? <Container size={container}>{children}</Container> : children}
    </section>
  );
}
