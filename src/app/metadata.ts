import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://izzac.vercel.app"
  ),
  title: "Izzac | Browse, Book, and Host Cars",
  description:
    "Izzac is a peer-to-peer car-sharing platform for browsing executive listings, booking trips, creating host listings, and managing rider and host dashboards.",
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
    title: "Izzac | Peer-to-Peer Mobility",
    description:
      "Browse, book, host, and manage executive vehicles from one unified Izzac account.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Izzac — Peer-to-Peer Mobility across Lagos, Abuja, and Port Harcourt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Izzac | Peer-to-Peer Mobility",
    description:
      "Browse, book, host, and manage executive vehicles from one unified Izzac account.",
    images: ["/images/og-image.png"],
  },
};
