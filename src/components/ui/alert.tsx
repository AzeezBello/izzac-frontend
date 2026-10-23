import * as React from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "default" | "destructive" | "emerald" | "info" | "warning";

const alertVariants: Record<AlertVariant, string> = {
  default: "border-border/80 bg-surface text-foreground",
  destructive: "border-red-600/20 bg-red-50 text-red-900",
  emerald: "border-primary/20 bg-primary-soft/70 text-primary",
  info: "border-border/80 bg-surface-elevated text-foreground",
  warning: "border-amber-600/25 bg-amber-50 text-amber-900",
};

const dotVariants: Record<AlertVariant, string> = {
  default: "bg-muted-foreground",
  destructive: "bg-red-600",
  emerald: "bg-primary",
  info: "bg-primary",
  warning: "bg-amber-600",
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative flex w-full gap-3 rounded-md border px-4 py-3 text-sm animate-enter-subtle",
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", dotVariants[variant])}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-0.5 font-semibold leading-snug", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm leading-relaxed opacity-90", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
