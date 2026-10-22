import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground shadow-[0_1px_2px_rgba(15,23,19,0.02)]",
          "transition-[border-color,box-shadow,background-color] duration-150 ease-out-quart",
          "file:border-0 file:bg-secondary file:text-secondary-foreground file:text-xs file:font-medium file:px-3 file:py-1 file:mr-3 file:rounded-md",
          "placeholder:text-muted-foreground/75",
          "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
