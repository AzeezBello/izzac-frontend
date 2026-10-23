import Link from "next/link";
import { SITE_URL } from "../lib/seo";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  inverted?: boolean;
};

const Breadcrumbs = ({ items, className, inverted }: BreadcrumbsProps) => {
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("font-mono text-2xs uppercase tracking-[0.1em]", inverted ? "text-ink-muted" : "text-muted-foreground", className)}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-2">
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
              {idx > 0 && (
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className={cn("transition-colors duration-150", inverted ? "hover:text-ink-foreground" : "hover:text-foreground")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn("font-semibold", inverted ? "text-ink-foreground" : "text-foreground")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
