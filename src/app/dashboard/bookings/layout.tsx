import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Your Rider & Host Bookings Ledger",
  description:
    "Review and manage your confirmed chauffeur, self-drive, and airport transfer reservations or track host-side bookings on your listed cars.",
  path: "/dashboard/bookings",
});

export default function BookingsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
