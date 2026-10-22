import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Become a Host & Commercial Fleet Partner in Nigeria",
  description:
    "Share your vehicle or commercial fleet on Izzac with chauffeur-inclusive or verified self-drive options, Naija Road Shield protection, and unified garage management.",
  path: "/host",
  ogImage: "/images/feature1.webp",
  ogAlt: "Curated host fleet of luxury vehicles inside a contemporary Lagos pavilion",
});

export default function HostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
