import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://izzac.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Izzac Mobility";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogAlt?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  ogImage = "/images/og-image.png",
  ogAlt = "Izzac Mobility — Chauffeur, Self-Drive, Airport VIP & Corporate Car Rental",
}: PageSeoOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: cleanPath,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: cleanPath,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
