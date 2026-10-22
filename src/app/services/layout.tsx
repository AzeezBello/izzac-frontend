import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Chauffeur, Self-Drive Evaluation, Motor Insurance & SuperFlex B2B",
  description:
    "Compare Izzac Mobility against Europcar: mandatory Chauffeur-Driven Trial before Self-Drive Driving Test Evaluation, verified motor insurance, prepaid fuel, and 22%-off monthly corporate subscriptions.",
  path: "/services",
  ogImage: "/images/feature1.webp",
  ogAlt: "Izzac Mobility Products, Motor Insurance, and Corporate Fleet Services",
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
