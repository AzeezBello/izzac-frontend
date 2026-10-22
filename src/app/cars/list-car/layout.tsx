import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "List Your Car for Chauffeur & Self-Drive Bookings",
  description:
    "Turn your idle sedan, SUV, or 4x4 pickup into recurring revenue across Lagos, Abuja, and Port Harcourt with Izzac's host onboarding workflow.",
  path: "/cars/list-car",
  ogImage: "/images/feature3.webp",
  ogAlt: "Host handing over vehicle key fob to an executive rider on Izzac",
});

export default function ListCarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
