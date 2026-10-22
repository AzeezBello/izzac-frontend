import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Browse 32+ Chauffeur & Self-Drive Vehicles in Lagos, Abuja & PH",
  description:
    "Explore Izzac's curated 32-vehicle Nigerian and African fleet: executive sedans, luxury SUVs, crossovers, EVs, and Hilux 4x4 pickups with live NGN/USD rates.",
  path: "/cars",
});

export default function CarsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
