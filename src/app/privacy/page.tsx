"use client";

import Link from "next/link";
import { useCookieConsent } from "../../context/CookieConsentContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  Container,
  Eyebrow,
  InkPanel,
  Ledger,
  LedgerRow,
  PageHeader,
  Section,
  SectionHeading,
  Stat,
  StatStrip,
} from "../../components/layout";
import { pad } from "@/lib/utils";

const PRIVACY_SECTIONS = [
  {
    title: "Data controller & regulatory framework",
    summary: "Izzac Mobility · NDPA 2023 (Nigeria) & GDPR alignment",
    detail:
      "Izzac Mobility operates across Lagos, Abuja, Port Harcourt, Kano, Ibadan and Enugu in compliance with the Nigeria Data Protection Act (NDPA) 2023 overseen by the Nigeria Data Protection Commission (NDPC), as well as GDPR principles for international corporate travellers.",
  },
  {
    title: "Identity & self-drive qualification records (FRSC & NIN)",
    summary: "Processed strictly for rider vetting and statutory compliance",
    detail:
      "When you apply for Verified Self-Drive clearance, we collect your FRSC Driver's Licence number, 11-digit National Identification Number (NIN), driving experience, Chauffeur-Driven Trial completion record, and Driving Test score. Your NIN is masked in all UI surfaces (showing only the last 4 digits) and encrypted at rest.",
  },
  {
    title: "NAICOM / NIID motor insurance & booking data",
    summary: "Verifiable digital insurance certificate on every trip",
    detail:
      "To issue a live Nigerian Insurance Industry Database (NIID) motor insurance certificate (Statutory Third-Party, Comprehensive Motor Shield, or Zero-Excess All-Risk), we share only the required booking dates, vehicle registration and rider identity reference with our NAICOM-licensed underwriters (AXA Mansard, Leadway Assurance, AIICO).",
  },
  {
    title: "Host fleet listings, payouts & road telemetry",
    summary: "Transparent accounting and vehicle security",
    detail:
      "For vehicle hosts, we process vehicle ownership documentation, inspection photos, reservation ledgers, and NGN payout settlement details. Active fleet vehicles utilize GPS geofencing and road-safety telemetry solely for theft prevention, emergency roadside response, and interstate corridor compliance.",
  },
  {
    title: "Data retention, encryption & security controls",
    summary: "TLS 1.3 in transit · AES-256 at rest · Role-based access",
    detail:
      "All API traffic uses HTTPS/TLS 1.3 and JWT token authentication. Booking and insurance records are retained for the statutory period required under Nigerian tax and motor insurance regulations, after which personal identifiers are anonymized or purged upon verified request.",
  },
  {
    title: "Your data subject rights & DPO contact",
    summary: "Access, rectification, erasure, portability & consent withdrawal",
    detail:
      "You have the right to request a copy of your personal data, correct inaccurate KYC fields, withdraw non-essential cookie consent at any time, or request account deletion. Contact our Data Protection Officer at privacy@izzac.app.",
  },
];

const COOKIE_TABLE = [
  {
    name: "izzac_cookie_consent",
    category: "Strictly Necessary",
    storage: "Cookie & localStorage",
    duration: "12 months",
    purpose: "Stores your granular cookie consent state (essential, functional, analytics, marketing) so the banner does not reappear on every page load.",
  },
  {
    name: "accessToken / refreshToken",
    category: "Strictly Necessary",
    storage: "localStorage",
    duration: "Session / 7 days",
    purpose: "Authenticates your dual-role Rider & Host session, protects booking mutations, and authorizes driving evaluation submissions.",
  },
  {
    name: "izzac_self_drive_qualification_v1",
    category: "Strictly Necessary",
    storage: "localStorage",
    duration: "Persistent",
    purpose: "Caches your 3-stage Self-Drive Clearance Certificate status (Chauffeur Trial, Driving Test score, NIID readiness) for instant checkout validation.",
  },
  {
    name: "izzac_currency / izzac_onboarding_completed_v1",
    category: "Functional",
    storage: "localStorage",
    duration: "12 months",
    purpose: "Remembers your preferred display currency (NGN, USD, GHS, KES) and whether you have completed or dismissed the logged-in member onboarding guide.",
  },
  {
    name: "izzac_analytics",
    category: "Performance & Telemetry",
    storage: "Cookie (Optional)",
    duration: "90 days",
    purpose: "Measures anonymous Core Web Vitals (LCP, INP) and aggregate vehicle demand across Nigerian city hubs. Disabled by default until you opt in.",
  },
  {
    name: "izzac_marketing",
    category: "Corporate & Host Updates",
    storage: "Cookie (Optional)",
    duration: "90 days",
    purpose: "Tracks opt-in interest for B2B SuperFlex corporate fleet offers and host yield campaigns. Disabled by default until you opt in.",
  },
];

const PrivacyPolicyPage = () => {
  const {
    preferences,
    hasConsented,
    openCookieSettings,
    acceptAllCookies,
    rejectNonEssentialCookies,
  } = useCookieConsent();

  const statusLabel = !hasConsented
    ? "Awaiting choice"
    : preferences.functional && preferences.analytics && preferences.marketing
    ? "All categories enabled"
    : !preferences.functional && !preferences.analytics && !preferences.marketing
    ? "Strictly necessary only"
    : "Custom preferences";

  return (
    <div className="bg-background">
      <Container className="py-10 md:py-14">
        <PageHeader
          breadcrumbs={[{ label: "Privacy & Cookie Policy" }]}
          eyebrow="Legal & Data Protection · Effective October 2026"
          title="Privacy & cookie policy"
          description="How Izzac Mobility collects, verifies, encrypts and retains rider identity credentials (FRSC driver's licence, NIN), NAICOM/NIID motor insurance certificates, host fleet telemetry and browser cookies."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={openCookieSettings}>
                Manage cookie preferences
              </Button>
              <Button asChild variant="outline">
                <Link href="/cars">Browse fleet</Link>
              </Button>
            </div>
          }
        />

        <StatStrip columns={4} className="mt-10">
          <Stat label="Primary statute" value="NDPA 2023" detail="Nigeria Data Protection Act & GDPR aligned" />
          <Stat label="Identity masking" value="NIN ••••" detail="Masked to last 4 digits across UI surfaces" />
          <Stat label="Insurance ledger" value="NIID" tone="primary" detail="NAICOM-licensed underwriter verification" />
          <Stat label="Cookie posture" value="Opt-in" detail="Zero non-essential cookies before consent" />
        </StatStrip>
      </Container>

      {/* Live Cookie Consent Console */}
      <Section rule="top" tone="surface" spacing="sm">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <Eyebrow index="01">Live consent status</Eyebrow>
              <Badge variant={hasConsented ? "emerald" : "amber"} dot>
                {statusLabel}
              </Badge>
            </div>
            <h2 className="text-h2 text-foreground">Your current browser cookie settings</h2>
            <p className="max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
              You can inspect, customize, or revoke non-essential cookies at any time. Revoking consent immediately deletes optional cookies from your browser.
            </p>
            {preferences.updatedAt && (
              <p className="font-mono text-2xs text-muted-foreground tabular-nums">
                Last updated: {new Date(preferences.updatedAt).toUTCString()}
              </p>
            )}
          </div>

          <Card className="p-5 lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 border-b border-border/70 pb-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Essential</span>
                <span className="font-semibold text-primary">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Functional</span>
                <span className="font-semibold text-foreground">{preferences.functional ? "On" : "Off"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Telemetry</span>
                <span className="font-semibold text-foreground">{preferences.analytics ? "On" : "Off"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">B2B Updates</span>
                <span className="font-semibold text-foreground">{preferences.marketing ? "On" : "Off"}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" size="sm" onClick={rejectNonEssentialCookies}>
                Reject non-essential
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={openCookieSettings}>
                  Customize
                </Button>
                <Button type="button" size="sm" onClick={acceptAllCookies}>
                  Accept all
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Privacy Policy Ledger */}
      <Section rule="top">
        <SectionHeading
          eyebrow="Data protection architecture"
          index="02"
          title="How we handle personal, KYC & mobility data."
          lede="Every piece of data collected on Izzac Mobility serves a specific operational or regulatory purpose."
        />

        <Ledger className="mt-10">
          {PRIVACY_SECTIONS.map((item, idx) => (
            <LedgerRow
              key={item.title}
              index={pad(idx + 1)}
              title={item.title}
              description={item.detail}
              aside={
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {item.summary}
                </span>
              }
            />
          ))}
        </Ledger>
      </Section>

      {/* Cookie & Storage Inventory */}
      <Section rule="top" tone="surface">
        <SectionHeading
          eyebrow="Cookie & storage inventory"
          index="03"
          title="Cookies and local storage keys we use."
          lede="Strictly necessary keys guarantee secure authentication and insurance issuance; all other categories require explicit opt-in."
          action={
            <Button type="button" variant="outline" size="sm" onClick={openCookieSettings}>
              Configure categories
            </Button>
          }
        />

        <div className="comparison-table-wrapper mt-10 rounded-xl border border-border bg-surface-elevated">
          <table className="comparison-table text-left text-sm">
            <caption className="sr-only">Izzac Mobility cookie and browser storage inventory</caption>
            <thead>
              <tr className="border-b border-border bg-surface font-mono text-2xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-5 py-3.5">Key / Cookie name</th>
                <th scope="col" className="px-5 py-3.5">Category & storage</th>
                <th scope="col" className="px-5 py-3.5">Retention</th>
                <th scope="col" className="px-5 py-3.5">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {COOKIE_TABLE.map((row) => (
                <tr key={row.name} className="align-top">
                  <th scope="row" className="px-5 py-4 font-mono text-xs font-semibold text-foreground">
                    {row.name}
                  </th>
                  <td className="px-5 py-4 font-mono text-xs text-primary">
                    {row.category} · <span className="text-muted-foreground">{row.storage}</span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground tabular-nums">
                    {row.duration}
                  </td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* DPO & Contact Callout */}
      <Section>
        <InkPanel padding="lg">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-3">
              <Eyebrow index="04" tone="signal">
                Data Protection Officer · NDPA & GDPR
              </Eyebrow>
              <h2 className="text-h1 text-ink-foreground">
                Questions about your privacy, KYC records or cookie preferences?
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">
                Reach our Data Protection Officer at <span className="font-mono text-white">privacy@izzac.app</span> for data access exports, NIN/FRSC record updates, or consent inquiries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button type="button" onClick={openCookieSettings}>
                Open cookie settings
              </Button>
              <Button asChild variant="inverse">
                <a href="mailto:privacy@izzac.app">Email privacy@izzac.app</a>
              </Button>
            </div>
          </div>
        </InkPanel>
      </Section>
    </div>
  );
};

export default PrivacyPolicyPage;
