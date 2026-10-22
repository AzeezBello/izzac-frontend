import Link from "next/link";
import { hostWorkflow } from "../../lib/productContent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const ProtectionComparison = () => {
  return (
    <section className="border-y border-border/80 bg-secondary/35 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div className="space-y-3">
            <Badge variant="emerald">Host workflow</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              How hosting works across the actual app
            </h2>
            <p className="text-muted-foreground max-w-[60ch] leading-relaxed">
              These are the live capabilities hosts can use today, from protected listing creation to host-side bookings visibility.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/bookings">Open bookings workspace →</Link>
          </Button>
        </div>

        {/* Impeccable: Architectural hairline ledger without card-in-card nesting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl border border-border/90 bg-card shadow-surface divide-y lg:divide-y-0 lg:divide-x divide-border/80 overflow-hidden">
          {hostWorkflow.map((stage, stageIndex) => (
            <div key={stage.title} className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary tabular-nums">
                    Stage 0{stageIndex + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                </div>
                <h3 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                  {stage.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <ul className="mt-6 pt-5 border-t border-border/70 divide-y divide-border/60 text-sm text-foreground/90">
                {stage.items.map((item, itemIdx) => (
                  <li
                    key={item}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-[11px] text-primary font-semibold pt-0.5 tabular-nums">
                      0{itemIdx + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-10 mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-emerald-950 shadow-elevated">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="dark">Unified Account Architecture</Badge>
            <h3 className="text-2xl font-bold tracking-[-0.025em] pt-1">
              Use one account across the full platform
            </h3>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Hosts can still browse and book cars as riders, while the same account powers garage management and host-side bookings.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/signup?role=host">Create a host account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProtectionComparison;
