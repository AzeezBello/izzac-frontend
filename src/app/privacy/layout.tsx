import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy & Cookie Policy (NDPA 2023 & GDPR)",
  description:
    "How Izzac Mobility collects, encrypts, and retains FRSC driver's licence credentials, NIN records, NIID motor insurance certificates, vehicle telemetry, and browser cookies.",
  path: "/privacy",
  ogImage: "/images/og-image.png",
  ogAlt: "Izzac Mobility Privacy & Cookie Policy",
});

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
