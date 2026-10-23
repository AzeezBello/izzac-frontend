import Link from "next/link";
import { Button } from "./ui/button";
import { Eyebrow } from "./layout/Eyebrow";
import { cn } from "@/lib/utils";

export type EmptyStateTip = {
  title: string;
  description: string;
};

type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type EmptyStateGuideProps = {
  eyebrow?: string;
  title: string;
  description: string;
  tips?: EmptyStateTip[];
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
};

const ActionButton = ({ action, variant }: { action: EmptyStateAction; variant: "default" | "outline" }) =>
  action.href ? (
    <Button asChild variant={variant}>
      <Link href={action.href}>{action.label}</Link>
    </Button>
  ) : (
    <Button type="button" variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );

const EmptyStateGuide = ({
  eyebrow = "Nothing here yet",
  title,
  description,
  tips,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateGuideProps) => {
  return (
    <div className={cn("col-span-full rounded-lg border border-dashed border-border bg-surface/60", className)}>
      <div className="flex flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between md:p-10">
        <div className="max-w-2xl space-y-3">
          <Eyebrow tone="muted">{eyebrow}</Eyebrow>
          <h2 className="text-h2 text-foreground">{title}</h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[58ch]">{description}</p>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {primaryAction && <ActionButton action={primaryAction} variant="default" />}
            {secondaryAction && <ActionButton action={secondaryAction} variant="outline" />}
          </div>
        )}
      </div>

      {tips && tips.length > 0 && (
        <ol className="grid grid-cols-1 border-t border-border/70 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-border/70">
          {tips.map((tip, idx) => (
            <li key={tip.title} className="space-y-1.5 px-7 py-5 md:px-10 md:py-6">
              <span className="font-mono text-2xs text-primary tabular-nums">0{idx + 1}</span>
              <h3 className="text-sm font-medium text-foreground">{tip.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{tip.description}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default EmptyStateGuide;
