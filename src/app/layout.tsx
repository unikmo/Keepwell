import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Keepwell | Property access and protection platform",
    template: "%s | Keepwell",
  },
  description:
    "Request property-access services from independent local providers, keep trusted access details together, and build a clean service history for every property.",
  applicationName: "Keepwell",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keepwell",
    title: "Keepwell | Property access and protection platform",
    description:
      "Property access, service requests, trusted contacts and service history in one platform.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Keepwell | Property access and protection platform",
    description:
      "Property access, service requests, trusted contacts and service history in one platform.",
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Keepwell",
  url: siteUrl,
  description:
    "A property-access platform connecting customers with independent local service providers and organizing property access information.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}>
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
