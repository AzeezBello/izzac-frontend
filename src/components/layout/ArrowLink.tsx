import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

export interface ArrowLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: LinkProps["href"];
  tone?: "primary" | "foreground" | "inverse" | "signal";
  size?: "sm" | "default";
  /** `arrow` = →, `external` = ↗ */
  glyph?: "arrow" | "external";
}

const tones = {
  primary: "text-primary hover:text-primary-hover",
  foreground: "text-foreground hover:text-primary",
  inverse: "text-ink-foreground hover:text-white",
  signal: "text-signal hover:text-white",
};

export function ArrowLink({ href, tone = "primary", size = "default", glyph = "arrow", className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/arrow inline-flex items-center gap-1.5 font-medium transition-colors duration-150 ease-out-quart",
        size === "sm" ? "text-[13px]" : "text-sm",
        tones[tone],
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-200 ease-out-quart group-hover/arrow:translate-x-0.5"
      >
        {glyph === "arrow" ? "→" : "↗"}
      </span>
    </Link>
  );
}
