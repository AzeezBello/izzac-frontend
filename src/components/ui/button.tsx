import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "ink"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "inverse";

export type ButtonSize = "sm" | "default" | "lg" | "icon" | "icon-sm";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(13,23,19,0.14),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-primary-hover active:bg-primary-active",
  ink:
    "bg-ink text-ink-foreground shadow-[0_1px_2px_rgba(13,23,19,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[hsl(155_24%_13%)]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  outline:
    "border border-border bg-surface-elevated text-foreground shadow-subtle hover:border-input hover:bg-surface",
  ghost: "text-foreground/85 hover:bg-secondary/70 hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground shadow-subtle hover:bg-red-700",
  link:
    "h-auto p-0 text-primary underline-offset-4 hover:underline rounded-none",
  inverse:
    "border border-white/15 bg-white/[0.06] text-ink-foreground hover:bg-white/[0.12] hover:border-white/25",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-md gap-1.5",
  default: "h-11 px-5 text-sm rounded-md",
  lg: "h-12 px-6 text-[15px] rounded-md",
  icon: "h-11 w-11 rounded-md",
  "icon-sm": "h-9 w-9 rounded-md",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none tracking-[-0.005em]",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out-quart",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && "active:scale-[0.98]",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, children, ...props },
    ref
  ) => {
    const classes = buttonVariants({ variant, size, className });

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
