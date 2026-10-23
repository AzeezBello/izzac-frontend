import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type LoaderProps = {
  label?: string;
  className?: string;
  /** `page` renders a full editorial skeleton; `inline` a compact block. */
  variant?: "page" | "inline";
};

const Loader = ({ label = "Loading", className, variant = "page" }: LoaderProps) => {
  if (variant === "inline") {
    return (
      <div role="status" aria-live="polite" className={cn("flex items-center gap-3 py-6 font-mono text-xs text-muted-foreground", className)}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        {label}…
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className={cn("space-y-8", className)}>
      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        {label}…
      </div>
      <div className="space-y-3">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-[28rem] max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-px border-y border-border/70 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 py-5 pr-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
