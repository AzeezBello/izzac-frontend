import { ReactNode } from "react";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Log In to Your Rider & Host Account",
  description:
    "Sign in to Izzac Mobility to manage your chauffeur and self-drive bookings, complete your driving test evaluation, and manage your host garage.",
  path: "/login",
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
