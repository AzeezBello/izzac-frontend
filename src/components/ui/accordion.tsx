"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openValues: string[];
  toggleValue: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean } | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", defaultValue, collapsible = true, children, ...props }, ref) => {
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
        <div ref={ref} className={cn("ledger", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(AccordionContext);
    const isOpen = Boolean(ctx?.openValues.includes(value));
    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div ref={ref} data-state={isOpen ? "open" : "closed"} className={cn("group", className)} {...props}>
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional mono index rendered before the label, e.g. "01". */
  index?: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, index, onClick, ...props }, ref) => {
    const accordionCtx = React.useContext(AccordionContext);
    const itemCtx = React.useContext(AccordionItemContext);
    if (!accordionCtx || !itemCtx) throw new Error("AccordionTrigger must be used inside AccordionItem");
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
            "flex flex-1 items-center gap-4 py-5 text-left text-base font-medium tracking-[-0.01em] text-foreground",
            "transition-colors duration-150 ease-out-quart hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
            className
          )}
          {...props}
        >
          {index && (
            <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">{index}</span>
          )}
          <span className="flex-1">{children}</span>
          <span
            aria-hidden="true"
            className={cn(
              "relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground",
              "transition-[transform,background-color,color,border-color] duration-200 ease-out-quart",
              isOpen && "rotate-45 border-foreground bg-foreground text-background"
            )}
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 1.5v9M1.5 6h9" />
            </svg>
          </span>
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const itemCtx = React.useContext(AccordionItemContext);
    if (!itemCtx) throw new Error("AccordionContent must be used inside AccordionItem");
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
          <div className={cn("pb-6 pl-11 pr-12 text-[15px] leading-relaxed text-muted-foreground max-w-[68ch]", className)}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
