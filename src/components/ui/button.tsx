import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "editorial";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(15,23,19,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] hover:bg-[#0f523d] active:scale-[0.98]",
  secondary:
    "bg-secondary text-secondary-foreground border border-border/70 shadow-surface hover:bg-stone-200/80 active:scale-[0.98]",
  outline:
    "border border-border bg-card/90 text-foreground shadow-surface hover:bg-secondary/80 hover:border-stone-300 active:scale-[0.98]",
  ghost:
    "text-foreground/80 hover:bg-secondary/80 hover:text-foreground active:scale-[0.98]",
  destructive:
    "bg-destructive text-destructive-foreground shadow-surface hover:bg-red-700 active:scale-[0.98]",
  link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
  editorial:
    "bg-foreground text-background shadow-[0_1px_2px_rgba(15,23,19,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-stone-800 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2 text-sm rounded-lg",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-11 px-6 text-sm rounded-lg",
  icon: "h-10 w-10 rounded-lg",
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
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out-quart",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-55",
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
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
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
