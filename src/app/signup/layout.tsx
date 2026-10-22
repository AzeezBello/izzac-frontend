import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Create Your Unified Rider & Host Account",
  description:
    "Join Izzac Mobility to book chauffeur-driven sedans, SUVs, and airport transfers, or list your own vehicles across Lagos, Abuja, and Port Harcourt.",
  path: "/signup",
});

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
