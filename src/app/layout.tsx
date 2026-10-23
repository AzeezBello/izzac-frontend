import "../styles/globals.css";
import localFont from "next/font/local";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { CurrencyProvider } from "../context/CurrencyContext";
import { OnboardingProvider } from "../context/OnboardingContext";
import { SITE_NAME, SITE_URL } from "../lib/seo";
export { metadata } from "./metadata";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AutoRental",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo-mark.svg`,
      image: `${SITE_URL}/images/og-image.png`,
      description:
        "Executive chauffeur service, evaluated self-drive car rental, airport VIP meet & greet (LOS, ABV, PHC), verified motor insurance, and Corporate SuperFlex fleet subscriptions.",
      priceRange: "₦68,000 - ₦650,000",
      currenciesAccepted: "NGN, USD, GHS, KES",
      areaServed: [
        { "@type": "City", name: "Lagos" },
        { "@type": "City", name: "Abuja" },
        { "@type": "City", name: "Port Harcourt" },
        { "@type": "City", name: "Kano" },
        { "@type": "City", name: "Ibadan" },
        { "@type": "City", name: "Enugu" },
        { "@type": "City", name: "Accra" },
        { "@type": "City", name: "Nairobi" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <AuthProvider>
          <CurrencyProvider>
            <OnboardingProvider>
              <Header />
              <main id="main" className="flex-1">{children}</main>
              <Footer />
            </OnboardingProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
