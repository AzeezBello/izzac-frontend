import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type EmptyStateTip = {
  title: string;
  description: string;
};

type EmptyStateGuideProps = {
  eyebrow?: string;
  title: string;
  description: string;
  tips: EmptyStateTip[];
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

const EmptyStateGuide = ({
  eyebrow = "Getting Started Guide",
  title,
  description,
  tips,
  primaryAction,
  secondaryAction,
}: EmptyStateGuideProps) => {
  return (
    <div className="col-span-full rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border/80 bg-secondary/35 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <Badge variant="emerald">{eyebrow}</Badge>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-[-0.025em]">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {primaryAction &&
            (primaryAction.href ? (
              <Button asChild size="default">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                type="button"
                size="default"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild variant="outline" size="default">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      </div>

      {/* 3-Step Actionable Tips Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
        {tips.map((tip, idx) => (
          <div key={tip.title} className="p-5 md:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary tabular-nums">
                Tip 0{idx + 1}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {tip.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyStateGuide;
