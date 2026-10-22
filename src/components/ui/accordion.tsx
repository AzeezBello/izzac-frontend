"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openValues: string[];
  toggleValue: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
} | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      type = "single",
      defaultValue,
      collapsible = true,
      children,
      ...props
    },
    ref
  ) => {
    const [openValues, setOpenValues] = React.useState<string[]>(() => {
      if (!defaultValue) return [];
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });

    const toggleValue = React.useCallback(
      (val: string) => {
        setOpenValues((prev) => {
          const exists = prev.includes(val);
          if (type === "single") {
            if (exists) return collapsible ? [] : prev;
            return [val];
          }
          return exists ? prev.filter((item) => item !== val) : [...prev, val];
        });
      },
      [type, collapsible]
    );

    return (
      <AccordionContext.Provider value={{ openValues, toggleValue }}>
        <div
          ref={ref}
          className={cn("divide-y divide-border/80", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(AccordionContext);
    const isOpen = Boolean(ctx?.openValues.includes(value));

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn("group", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
  const accordionCtx = React.useContext(AccordionContext);
  const itemCtx = React.useContext(AccordionItemContext);

  if (!accordionCtx || !itemCtx) {
    throw new Error("AccordionTrigger must be used inside AccordionItem");
  }

  const { value, isOpen } = itemCtx;

  return (
    <h3 className="flex">
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        onClick={(e) => {
          accordionCtx.toggleValue(value);
          onClick?.(e);
        }}
        className={cn(
          "flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-semibold tracking-[-0.015em] text-foreground",
          "transition-colors duration-150 ease-out-quart hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/80 bg-secondary/60 text-xs font-mono text-muted-foreground",
            "transition-[transform,background-color,color,border-color] duration-200 ease-out-quart",
            isOpen && "rotate-45 bg-primary text-primary-foreground border-primary"
          )}
        >
          +
        </span>
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const itemCtx = React.useContext(AccordionItemContext);
  if (!itemCtx) {
    throw new Error("AccordionContent must be used inside AccordionItem");
  }

  const { isOpen } = itemCtx;

  return (
    <div
      ref={ref}
      aria-hidden={!isOpen}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out-quart",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "pb-5 pt-0.5 text-sm leading-relaxed text-muted-foreground max-w-[65ch]",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
