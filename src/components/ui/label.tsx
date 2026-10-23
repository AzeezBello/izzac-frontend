import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  hint?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, hint, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "flex items-baseline justify-between gap-3 text-[13px] font-medium text-foreground leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {hint && (
        <span className="font-mono text-2xs font-normal text-muted-foreground tabular-nums">
          {hint}
        </span>
      )}
    </label>
  )
);
Label.displayName = "Label";

export { Label };
