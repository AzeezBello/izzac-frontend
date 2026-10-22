import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Rider Mobility Hub & Trip Overview",
  description:
    "Access your upcoming Nigerian and African trips, jump into the 32-vehicle catalogue, or transition into vehicle hosting from your rider dashboard.",
  path: "/dashboard/rider",
});

export default function RiderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
