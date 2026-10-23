"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge } from "../ui/badge";

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
    title: "Autonomous Fleet Intake & Hub Allocation",
    tagline: "Instant dispatch across Lagos, Abuja, Port Harcourt, and Kano hubs.",
    telemetry: [
      { label: "Dispatch Latency", value: "< 4.2 mins" },
      { label: "Active Hub Availability", value: "98.4%" },
    ],
    description:
      "Every vehicle undergoes automated sensor sync, hub positioning, and dynamic availability routing the instant a host unlocks calendar slots.",
    highlightMetric: "4 Hubs Integrated",
  },
  {
    id: "verification",
    stageNumber: "02",
    title: "Chauffeur Accreditation & Self-Drive Verification",
    tagline: "Dual-track driver vetting with biometric & safety records.",
    telemetry: [
      { label: "Identity Verification", value: "NIN / BVN Verified" },
      { label: "Safety Evaluation Score", value: "99.1% Pass" },
    ],
    description:
      "Riders undergo real-time biometric and driver scoring, while verified executive chauffeurs clear behavioral and airport security protocol.",
    highlightMetric: "100% Verified Drivers",
  },
  {
    id: "telemetry",
    stageNumber: "03",
    title: "Live GPS Mesh & Odometer Sync",
    tagline: "Sub-second satellite telemetry tracking every trip milestone.",
    telemetry: [
      { label: "GPS Refresh Rate", value: "1.0s / 10Hz" },
      { label: "Geo-Fencing Precision", value: "± 2.5m" },
    ],
    description:
      "Continuous vehicle diagnostics record fuel levels, tire pressure, and boundary alerts without compromising passenger confidentiality.",
    highlightMetric: "Sub-Second Telemetry",
  },
  {
    id: "settlement",
    stageNumber: "04",
    title: "Algorithmic Settlement & Comprehensive Coverage",
    tagline: "Immediate host escrow release backed by verified comprehensive motor cover.",
    telemetry: [
      { label: "Payout Clearance", value: "Immediate on Key Handover" },
      { label: "Underwriting Coverage", value: "Full Collision & Theft" },
    ],
    description:
      "Trips are secured under institutional fleet underwriting. Host earnings transfer instantly via automated ledger settlement upon key handoff.",
    highlightMetric: "Automated Escrow",
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
      const stageIndex = Math.min(
        Math.floor(progress * CHAPTERS.length),
        CHAPTERS.length - 1
      );
      setActiveStage(stageIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentChapter = CHAPTERS[activeStage];

  return (
    <div ref={containerRef} className="relative py-16 md:py-24 border-t border-b border-border/60 bg-surface/50">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Header Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Scroll World Architecture · Cinematic Narrative
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] text-foreground">
              The 4 Stages of Verified Mobility
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Interactive system walkthrough tracing vehicle allocation, safety clearance, and instantaneous settlement.
          </p>
        </div>

        {/* Asymmetric Bento Split (7:5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chapter Selector & Timeline Ledger (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {CHAPTERS.map((chapter, index) => {
              const isActive = index === activeStage;
              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveStage(index)}
                  className={`w-full text-left p-5 rounded-xl border transition-[background-color,border-color,transform] duration-200 ${
                    isActive
                      ? "bg-card border-primary/40 shadow-sm translate-x-1"
                      : "bg-background/60 border-border/60 hover:bg-card/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      STAGE {chapter.stageNumber}
                    </span>
                    <Badge variant={isActive ? "emerald" : "secondary"}>
                      {chapter.highlightMetric}
                    </Badge>
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-1">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {chapter.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Telemetry & Narrative Cockpit (7 cols) */}
          <div className="lg:col-span-7 bg-foreground text-background rounded-2xl p-8 md:p-10 shadow-elevated relative overflow-hidden">
            {/* Background ambient grid pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  ACTIVE CHAPTER · STAGE {currentChapter.stageNumber}
                </span>
                <span className="font-mono text-xs text-stone-400 tabular-nums">
                  SYSTEM READY · 200 OK
                </span>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-white mb-3">
                  {currentChapter.title}
                </h3>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-xl">
                  {currentChapter.description}
                </p>
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                {currentChapter.telemetry.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-stone-400 font-mono mb-1 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-lg md:text-xl font-mono font-semibold text-emerald-400 tabular-nums">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
