import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Host Fleet Management Dashboard",
  description:
    "Monitor your hosted vehicles, daily NGN rates, and reservation activity across Lagos, Abuja, and Port Harcourt.",
  path: "/dashboard/host",
});

export default function HostDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
