"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "../layout/Container";
import { SectionHeading } from "../layout/SectionHeading";
import { Stat } from "../layout/Stat";
import { Card } from "../ui/card";
import { cn, pad } from "@/lib/utils";

interface Chapter {
  id: string;
  stageNumber: string;
  title: string;
  tagline: string;
  telemetry: { label: string; value: string }[];
  description: string;
  highlightMetric: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "allocation",
    stageNumber: "01",
    title: "Fleet intake & hub allocation",
    tagline: "Instant dispatch across Lagos, Abuja, Port Harcourt and Kano.",
    telemetry: [
      { label: "Dispatch latency", value: "< 4.2 min" },
      { label: "Hub availability", value: "98.4%" },
    ],
    description:
      "The moment a host opens calendar slots, the vehicle is positioned to a hub and routed into live availability.",
    highlightMetric: "4 hubs",
  },
  {
    id: "verification",
    stageNumber: "02",
    title: "Chauffeur accreditation & self-drive verification",
    tagline: "Dual-track driver vetting with identity and safety records.",
    telemetry: [
      { label: "Identity check", value: "NIN / BVN" },
      { label: "Safety evaluation", value: "99.1% pass" },
    ],
    description:
      "Riders clear identity and the driving test; chauffeurs clear behavioural and airport protocol checks.",
    highlightMetric: "100% verified",
  },
  {
    id: "telemetry",
    stageNumber: "03",
    title: "Live GPS mesh & odometer sync",
    tagline: "Sub-second satellite telemetry on every trip milestone.",
    telemetry: [
      { label: "GPS refresh", value: "10 Hz" },
      { label: "Geo-fence precision", value: "± 2.5 m" },
    ],
    description:
      "Fuel, tyre pressure and boundary alerts are recorded continuously without exposing passenger data.",
    highlightMetric: "Sub-second",
  },
  {
    id: "settlement",
    stageNumber: "04",
    title: "Settlement & comprehensive cover",
    tagline: "Host escrow released on key handover, backed by NIID motor cover.",
    telemetry: [
      { label: "Payout clearance", value: "On handover" },
      { label: "Underwriting", value: "Collision + theft" },
    ],
    description:
      "Every trip sits under fleet underwriting. Host earnings settle through the ledger the moment keys change hands.",
    highlightMetric: "Automated escrow",
  },
];

export function ScrollWorldStage() {
  const [activeStage, setActiveStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height - window.innerHeight;
      if (containerHeight <= 0) return;
      const progress = Math.min(Math.max(-rect.top / containerHeight, 0), 1);
      const stageIndex = Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1);
      setActiveStage(stageIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = CHAPTERS[activeStage];

  return (
    <div ref={containerRef} className="border-y border-border/70 bg-surface py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="How a trip runs"
          index="04"
          title="Four stages, one verified loop."
          lede="From hub allocation to settlement, every booking passes through the same checks."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <ol className="ledger lg:sticky lg:top-[calc(var(--header-height)+2rem)]" aria-label="Stages">
              {CHAPTERS.map((chapter, index) => {
                const isActive = index === activeStage;
                return (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => setActiveStage(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group grid w-full grid-cols-[2.5rem_1fr] items-start gap-4 py-5 text-left",
                        "transition-[opacity,transform] duration-200 ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
                        isActive ? "opacity-100" : "opacity-55 hover:opacity-85"
                      )}
                    >
                      <span
                        className={cn(
                          "pt-1 font-mono text-xs tabular-nums",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {chapter.stageNumber}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-lg font-medium tracking-[-0.015em] text-foreground">
                          {chapter.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {chapter.tagline}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <Card tone="surface" className="bg-surface-elevated p-7 md:p-10" aria-live="polite">
              <div className="flex items-center justify-between border-b border-border/70 pb-5">
                <span className="type-eyebrow text-primary">Stage {current.stageNumber} · {current.highlightMetric}</span>
                <span className="font-mono text-2xs text-muted-foreground tabular-nums">
                  {pad(activeStage + 1)} / {pad(CHAPTERS.length)}
                </span>
              </div>

              <div key={current.id} className="animate-enter-subtle">
                <h3 className="mt-7 text-h2 text-foreground">{current.title}</h3>
                <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted-foreground">{current.description}</p>

                <div className="mt-8 grid grid-cols-2 gap-8 border-t border-border/70 pt-6">
                  {current.telemetry.map((item) => (
                    <Stat key={item.label} label={item.label} value={item.value} tone="primary" />
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-1" aria-hidden="true">
                {CHAPTERS.map((chapter, index) => (
                  <span
                    key={chapter.id}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300",
                      index <= activeStage ? "bg-primary" : "bg-border"
                    )}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ScrollWorldStage;
