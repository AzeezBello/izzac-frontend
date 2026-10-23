import * as React from "react";
import { cn } from "@/lib/utils";

export interface OptionCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "title" | "size"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-hand meta: price, badge. */
  meta?: React.ReactNode;
  kind?: "radio" | "checkbox";
  size?: "sm" | "default";
  containerClassName?: string;
}

/** Radio / checkbox rendered as a selectable surface. */
export const OptionCard = React.forwardRef<HTMLInputElement, OptionCardProps>(
  ({ title, description, meta, kind = "radio", size = "default", containerClassName, className, disabled, ...props }, ref) => (
    <label
      className={cn(
        "option-card flex cursor-pointer items-start gap-3 rounded-md",
        size === "sm" ? "px-3 py-2.5" : "p-3.5",
        disabled && "cursor-not-allowed",
        containerClassName
      )}
    >
      <input
        ref={ref}
        type={kind}
        disabled={disabled}
        className={cn("option-control mt-[3px] h-4 w-4 shrink-0", kind === "checkbox" && "rounded-sm", className)}
        {...props}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className={cn("font-medium text-foreground leading-snug", size === "sm" ? "text-[13px]" : "text-sm")}>{title}</span>
          {meta && <span className="shrink-0 font-mono text-xs font-semibold text-primary tabular-nums">{meta}</span>}
        </span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span>}
      </span>
    </label>
  )
);
OptionCard.displayName = "OptionCard";
