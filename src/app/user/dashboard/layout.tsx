import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "User Trips & Account Workspace",
  description:
    "Manage your Izzac Mobility reservations, chauffeur bookings, and vehicle listings from one unified account workspace.",
  path: "/user/dashboard",
});

export default function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
