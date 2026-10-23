"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useAuth } from "../../../context/AuthContext";
import { hostFeatureCards, hostJourney } from "../../../lib/productContent";
import { Button } from "../../../components/ui/button";
import { Container } from "../../../components/layout/Container";
import { Section } from "../../../components/layout/Section";
import { Eyebrow } from "../../../components/layout/Eyebrow";
import { SectionHeading } from "../../../components/layout/SectionHeading";
import { Ledger, LedgerRow } from "../../../components/layout/Ledger";
import { ArrowLink } from "../../../components/layout/ArrowLink";
import { InkPanel } from "../../../components/layout/InkPanel";

const ListCarPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const primaryHref = !isLoading && isAuthenticated ? "/dashboard/add-car" : "/signup?role=host";
  const primaryLabel = !isLoading && isAuthenticated ? "Go to add car" : "Create a host account";

  return (
    <div className="bg-background">
      <Container className="space-y-8 pb-16 pt-8 md:pb-24 md:pt-12">
        <Breadcrumbs items={[{ label: "Fleet", href: "/cars" }, { label: "List a car" }]} />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-7 lg:col-span-7">
            <Eyebrow>List a car</Eyebrow>
            <h1 className="text-display text-foreground">From parked to published in one sitting.</h1>
            <p className="type-lede max-w-[56ch]">
              This is the public door into hosting: what the listing form asks for, how the garage works and where
              host-side bookings show up, before you enter the protected add-car flow.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/host">Explore hosting</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-secondary">
              <Image
                src="/images/feature3.webp"
                alt="Host handing over vehicle key fob to an executive rider"
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-md bg-ink/85 px-4 py-3 text-xs text-ink-foreground backdrop-blur-md">
                <span className="type-eyebrow text-signal">Direct handover</span>
                <span className="font-mono tabular-nums text-ink-muted">Instant publishing</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Section rule="top" spacing="sm">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Host tools" title="Everything a listing needs" size="h2" />
          </div>
          <Ledger className="lg:col-span-8">
            {hostFeatureCards.map((feature, index) => (
              <LedgerRow
                key={feature.title}
                index={`0${index + 1}`}
                title={feature.title}
                description={feature.description}
                aside={<ArrowLink href={feature.href} size="sm">{feature.cta}</ArrowLink>}
              />
            ))}
          </Ledger>
        </div>
      </Section>

      <Section spacing="sm">
        <InkPanel>
          <div className="space-y-8">
            <SectionHeading inverted eyebrow="Host journey" title="What happens after you decide to list" size="h2" />
            <ol className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
              {hostJourney.map((step, index) => (
                <li key={step.title} className="space-y-2 py-5 md:px-6 md:py-2 md:first:pl-0 md:last:pr-0">
                  <span className="font-mono text-2xs uppercase tracking-[0.12em] text-signal tabular-nums">Step 0{index + 1}</span>
                  <h3 className="text-h3 text-ink-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </InkPanel>
      </Section>

      <Section rule="top" spacing="sm" className="pb-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-h1 text-foreground">Ready to move from interest to inventory?</h2>
            <p className="type-lede text-[15px]">
              Signed in? Go straight to the add-car page. If not, create a host account first and then publish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/bookings">See host bookings</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ListCarPage;
