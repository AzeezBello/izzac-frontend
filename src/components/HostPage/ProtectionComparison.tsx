import Link from "next/link";
import { hostWorkflow } from "../../lib/productContent";
import { Button } from "../ui/button";
import { Section } from "../layout/Section";
import { SectionHeading } from "../layout/SectionHeading";
import { InkPanel } from "../layout/InkPanel";
import { Eyebrow } from "../layout/Eyebrow";

const ProtectionComparison = () => {
  return (
    <Section tone="surface" rule="both">
      <div className="space-y-12">
        <SectionHeading
          eyebrow="How hosting works"
          title="Three stages, all live in the app today"
          lede="From protected listing creation to host-side booking visibility, every stage runs on the same account you ride with."
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard/bookings">Open bookings</Link>
            </Button>
          }
        />

        <ol className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {hostWorkflow.map((stage, stageIndex) => (
            <li key={stage.title} className="flex flex-col justify-between gap-6 py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <div className="space-y-3">
                <Eyebrow index={`0${stageIndex + 1}`}>Stage</Eyebrow>
                <h3 className="text-h2 text-foreground">{stage.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{stage.description}</p>
              </div>
              <ul className="divide-y divide-border/60 border-t border-border/70 text-sm text-foreground/90">
                {stage.items.map((item, itemIdx) => (
                  <li key={item} className="grid grid-cols-[2rem_1fr] gap-2 py-2.5">
                    <span className="font-mono text-2xs text-primary tabular-nums pt-0.5">0{itemIdx + 1}</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <InkPanel>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Eyebrow tone="signal">One account, two roles</Eyebrow>
              <h3 className="text-h1 text-ink-foreground">Host your fleet. Ride someone else&apos;s.</h3>
              <p className="text-[15px] leading-relaxed text-ink-muted">
                The same login powers garage management, host-side bookings and your own chauffeur or self-drive trips.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/signup?role=host">Create a host account</Link>
            </Button>
          </div>
        </InkPanel>
      </div>
    </Section>
  );
};

export default ProtectionComparison;
