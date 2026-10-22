import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Chauffeur, Airport VIP, SuperFlex B2B & Europcar Benchmark",
  description:
    "Compare Izzac Mobility against Europcar for Nigeria and Africa: vetted corporate chauffeurs, MOPOL escort, prepaid fuel, Naija Road Shield, and 22%-off monthly corporate subscriptions.",
  path: "/services",
  ogImage: "/images/feature1.webp",
  ogAlt: "Izzac Mobility Nigeria & Africa Products and Corporate Fleet Services",
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
