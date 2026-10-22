import { Skeleton } from "./ui/skeleton";

const Loader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-6"
    >
      <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
        <span>Loading workspace...</span>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  );
};

export default Loader;
