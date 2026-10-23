"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs />");
  return ctx;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, defaultValue = "", onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const activeValue = value !== undefined ? value : internalValue;

    const handleChange = React.useCallback(
      (next: string) => {
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
      },
      [value, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: handleChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `segmented` = pill switcher, `underline` = editorial rule tabs */
  variant?: "segmented" | "underline";
}

const TabsListContext = React.createContext<"segmented" | "underline">("segmented");

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "segmented", ...props }, ref) => (
    <TabsListContext.Provider value={variant}>
      <div
        ref={ref}
        role="tablist"
        className={cn(
          variant === "segmented"
            ? "inline-flex h-10 items-center rounded-md border border-border/80 bg-secondary/70 p-1 text-muted-foreground"
            : "flex items-center gap-6 border-b border-border/80",
          className
        )}
        {...props}
      />
    </TabsListContext.Provider>
  )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabsContext();
    const variant = React.useContext(TabsListContext);
    const isActive = activeValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={(e) => {
          onValueChange(value);
          onClick?.(e);
        }}
        className={cn(
          "whitespace-nowrap select-none text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-[background-color,color,box-shadow,border-color] duration-150 ease-out-quart",
          variant === "segmented"
            ? cn(
                "inline-flex h-8 items-center justify-center rounded-sm px-3.5 active:scale-[0.98]",
                isActive
                  ? "bg-surface-elevated text-foreground shadow-surface"
                  : "text-muted-foreground hover:text-foreground"
              )
            : cn(
                "-mb-px border-b-2 pb-3 pt-1",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              ),
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: activeValue } = useTabsContext();
    if (activeValue !== value) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn("mt-5 animate-enter-subtle focus-visible:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
