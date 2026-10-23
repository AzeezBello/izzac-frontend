import * as React from "react";
import { cn } from "@/lib/utils";
import Breadcrumbs, { type BreadcrumbItem } from "../Breadcrumbs";
import { Eyebrow } from "./Eyebrow";

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Optional strip rendered under the header (tabs, filters, stats). */
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

/** Operate-mode page header: breadcrumb, eyebrow, H1, lede, actions. */
export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
  compact = false,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-6", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3 max-w-[52rem]">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className={cn(compact ? "text-h2" : "text-h1", "text-foreground")}>{title}</h1>
          {description && <p className="type-lede max-w-[64ch] text-[15px] md:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
