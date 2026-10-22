import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Host Garage & Fleet Inventory Workspace",
  description:
    "Manage your listed vehicles, daily NGN rates, and host fleet availability across Lagos, Abuja, and Port Harcourt from your Izzac garage dashboard.",
  path: "/dashboard",
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
