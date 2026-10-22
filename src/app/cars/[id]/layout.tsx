import type { Metadata } from "next";
import { ReactNode } from "react";
import { getCatalogueCarById } from "../../../lib/carCatalogue";
import { buildPageMetadata, SITE_URL } from "../../../lib/seo";

type Props = {
  params: Promise<{ id: string }>;
  children: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  const car = getCatalogueCarById(numericId);

  if (!car) {
    return buildPageMetadata({
      title: `Vehicle Dossier #${id} — Chauffeur & Self-Drive Rental`,
      description:
        "Inspect full vehicle specifications, daily rates, chauffeur availability, road protection, and motor insurance options on Izzac Mobility.",
      path: `/cars/${id}`,
    });
  }

  return buildPageMetadata({
    title: `Rent ${car.year} ${car.make} ${car.model} in ${car.location}`,
    description: `${car.description} Book ${car.make} ${car.model} with vetted corporate chauffeur or evaluated self-drive from ₦${car.price_per_day.toLocaleString("en-NG")}/day in ${car.location}.`,
    path: `/cars/${car.id}`,
    ogImage: car.image,
    ogAlt: `${car.year} ${car.make} ${car.model} available in ${car.location} on Izzac Mobility`,
  });
}

export default async function CarDetailLayout({ params, children }: Props) {
  const { id } = await params;
  const car = getCatalogueCarById(Number(id));

  const jsonLd = car
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${car.year} ${car.make} ${car.model}`,
        description: car.description,
        image: `${SITE_URL}${car.image}`,
        brand: {
          "@type": "Brand",
          name: car.make,
        },
        category: car.category || "Vehicle Rental",
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/cars/${car.id}`,
          priceCurrency: "NGN",
          price: car.price_per_day,
          availability: "https://schema.org/InStock",
          areaServed: car.location,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
