import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "AM Flexi Pack | Flexible Packaging & Custom Pouches",
  description:
    "AM Flexi Pack provides flexible packaging solutions including stand-up pouches, flat bottom pouches, center seal pouches, spout pouches and customized packaging solutions.",
  keywords: [
    "flexible packaging",
    "flexible packaging manufacturer",
    "pouch manufacturer",
    "custom pouches",
    "stand up pouches",
    "printed pouches",
    "food packaging pouches",
    "spice packaging",
    "coffee packaging",
    "flexible packaging solutions",
  ],
  openGraph: {
    title: "AM Flexi Pack | Flexible Packaging & Custom Pouches",
    description:
      "AM Flexi Pack provides flexible packaging solutions including stand-up pouches, flat bottom pouches, center seal pouches, spout pouches and customized packaging solutions.",
    type: "website",
    locale: "en_US",
    siteName: "AM Flexi Pack",
  },
  twitter: {
    card: "summary_large_image",
    title: "AM Flexi Pack | Flexible Packaging & Custom Pouches",
    description:
      "AM Flexi Pack provides flexible packaging solutions including stand-up pouches, flat bottom pouches, center seal pouches, spout pouches and customized packaging solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AM Flexi Pack",
    description: "AM Flexi Pack provides flexible packaging solutions including stand-up pouches, flat bottom pouches, center seal pouches, spout pouches and customized packaging solutions.",
    url: "[WEBSITE]",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "[PHONE]",
      contactType: "sales",
      availableLanguage: "English",
    },
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="[WEBSITE]" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
