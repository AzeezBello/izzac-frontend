import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "../Breadcrumbs";
import { hostFeatureCards } from "../../lib/productContent";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Container } from "../layout/Container";
import { Eyebrow } from "../layout/Eyebrow";
import { ArrowLink } from "../layout/ArrowLink";
import { StatStrip, Stat } from "../layout/Stat";
import { cn } from "@/lib/utils";

const bentoSpans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

const HostFeatures = () => {
  return (
    <Container className="space-y-16 pb-16 pt-8 md:space-y-24 md:pb-24 md:pt-12">
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: "Host" }]} />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-7 lg:col-span-7">
            <Eyebrow>Host on Izzac</Eyebrow>
            <h1 className="text-display text-foreground">
              Your car, booked by vetted riders. Paid like a fleet.
            </h1>
            <p className="type-lede max-w-[54ch]">
              Publish a sedan, SUV or 4x4 once. Izzac handles guest vetting, chauffeur trials, insurance and SuperFlex
              corporate pricing, and you manage everything from one account.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup?role=host">Start hosting</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/add-car">Add a car</Link>
              </Button>
            </div>
            <StatStrip columns={3} className="max-w-xl">
              <Stat size="sm" label="Weekly rate" value="−10%" detail="Applied automatically" />
              <Stat size="sm" label="SuperFlex" value="−22%" tone="primary" detail="30+ day corporate bookings" />
              <Stat size="sm" label="Guest gate" value="80%" detail="Driving test pass mark" />
            </StatStrip>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-secondary">
              <Image
                src="/images/feature1.webp"
                alt="Curated host fleet of luxury vehicles inside a contemporary stone pavilion"
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-md bg-ink/85 px-4 py-3 text-xs text-ink-foreground backdrop-blur-md">
                <span className="type-eyebrow text-signal">One account</span>
                <span className="font-mono tabular-nums text-ink-muted">Rider + host</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="text-h1 text-foreground">Built into the app, not a brochure</h2>
          </div>
          <ArrowLink href="/cars/list-car">See the listing flow</ArrowLink>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          {hostFeatureCards.map((feature, index) => (
            <Card
              key={feature.title}
              tone="surface"
              className={cn("flex flex-col justify-between p-6 md:p-8", bentoSpans[index % bentoSpans.length])}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Eyebrow tone="muted">{feature.eyebrow}</Eyebrow>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">0{index + 1}</span>
                </div>
                <h3 className="text-h2 text-foreground">{feature.title}</h3>
                <p className="max-w-[54ch] text-[15px] leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
              <div className="pt-6">
                <ArrowLink href={feature.href}>{feature.cta}</ArrowLink>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default HostFeatures;
