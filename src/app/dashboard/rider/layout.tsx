import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Rider Mobility & Self-Drive Driving Test Evaluation Hub",
  description:
    "Complete your Chauffeur-Driven Trial, take the 5-question Driving Test Evaluation to unlock Self-Drive, and review your insured bookings.",
  path: "/dashboard/rider",
});

export default function RiderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
