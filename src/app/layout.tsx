import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Trusted Locksmith | Vetted Local Locksmiths & Upfront Prices",
    template: "%s | Trusted Locksmith",
  },
  description:
    "Find vetted local locksmiths for home lockouts, rekeys, lock changes and smart-lock installation. See upfront standard prices before you request service.",
  applicationName: "Trusted Locksmith",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Trusted Locksmith",
    title: "Trusted Locksmith | Vetted local locksmiths. Upfront prices.",
    description:
      "Find a trusted locksmith near you with upfront standard prices for lockouts, rekeys, lock changes and smart-lock services.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Trusted Locksmith | Vetted local locksmiths. Upfront prices.",
    description:
      "Find a trusted locksmith near you with upfront standard prices for lockouts, rekeys, lock changes and smart-lock services.",
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlanetHike OÜ",
  url: siteUrl,
  brand: {
    "@type": "Brand",
    name: "Trusted Locksmith",
  },
  description:
    "PlanetHike OÜ operates Trusted Locksmith, a platform that helps customers find independent local locksmith providers with clearly scoped services and upfront standard pricing.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-ink text-parchment">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
