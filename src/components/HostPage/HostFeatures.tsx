import Link from "next/link";
import Image from "next/image";
import { hostFeatureCards } from "../../lib/productContent";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const bentoSpans = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
];

const HostFeatures = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Badge variant="emerald">Host on Izzac</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.035em] leading-[1.08]">
            Turn your car into a bookable listing with rider and host tools built in.
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-[58ch] leading-relaxed">
            The host experience is not a brochure flow. It connects directly to the app you already have:
            account creation, protected listing creation, photo uploads, garage management, and host-side booking visibility.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild size="lg">
              <Link href="/signup?role=host">Start hosting</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/add-car">Add a car</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-2.5 shadow-elevated">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/images/hero-bg.webp"
                alt="Host dashboard overview"
                width={900}
                height={900}
                className="w-full h-72 md:h-80 object-cover transition-transform duration-500 ease-out-expo hover:scale-[1.02]"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg border border-white/15 bg-[#0d1713]/85 px-3.5 py-2.5 text-xs text-stone-100 backdrop-blur-md">
                <span className="font-mono uppercase tracking-[0.14em] text-emerald-300">
                  Fleet telemetry
                </span>
                <span className="font-mono tabular-nums text-stone-200">
                  1 Account · Dual Role
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Taste-Skill: Asymmetric 12-column Bento grid instead of uniform symmetric cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-12">
        {hostFeatureCards.map((feature, index) => (
          <Card
            key={feature.title}
            className={`${bentoSpans[index % bentoSpans.length]} p-6 md:p-7 flex flex-col justify-between hover:border-stone-300 hover:shadow-elevated stagger-item`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{feature.eyebrow}</Badge>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground tracking-[-0.02em] pt-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[56ch]">
                {feature.description}
              </p>
            </div>
            <div className="pt-5">
              <Link
                href={feature.href}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-150 ease-out-quart hover:text-emerald-900"
              >
                <span>{feature.cta}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HostFeatures;
