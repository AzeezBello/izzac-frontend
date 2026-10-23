import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const inputStyles =
  "flex h-11 w-full rounded-md border border-input bg-surface-elevated px-3.5 py-2 text-sm text-foreground shadow-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-150 ease-out-quart " +
  "placeholder:text-muted-foreground/70 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-medium file:text-foreground";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(inputStyles, className)} ref={ref} {...props} />
  )
);
Input.displayName = "Input";

export { Input };
