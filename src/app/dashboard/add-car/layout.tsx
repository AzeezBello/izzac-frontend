import { ReactNode } from "react";
import { buildPageMetadata } from "../../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Publish a New Vehicle Listing",
  description:
    "Add your sedan, SUV, or 4x4 pickup to the Izzac fleet with daily pricing, city hub location, drive mode preferences, and motor insurance.",
  path: "/dashboard/add-car",
});

export default function AddCarLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
