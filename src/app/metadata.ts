import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chauffeur, Self-Drive & Corporate Car Rental in Nigeria | Izzac Mobility",
    template: `%s`,
  },
  description:
    "Book vetted chauffeur-driven sedans, luxury SUVs, Hilux 4x4 pickups, airport VIP transfers (LOS, ABV, PHC), and 22%-off monthly corporate fleets across Nigeria and Africa.",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/logo-mark.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Chauffeur, Self-Drive & Corporate Car Rental in Nigeria | Izzac Mobility",
    description:
      "Book vetted chauffeur-driven sedans, luxury SUVs, Hilux 4x4 pickups, airport VIP transfers (LOS, ABV, PHC), and monthly corporate fleets across Lagos, Abuja, and Port Harcourt.",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_NG",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Izzac Mobility — Executive SUV and sedan fleet across Lagos, Abuja, and Port Harcourt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chauffeur, Self-Drive & Corporate Car Rental in Nigeria | Izzac Mobility",
    description:
      "Browse 32+ executive vehicles, configure chauffeur or self-drive mode, add Naija Road Shield, and book online across Nigeria.",
    images: ["/images/og-image.png"],
  },
};
