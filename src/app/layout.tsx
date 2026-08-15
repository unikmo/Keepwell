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
    default: "Keepwell | Fixed-Price Lockout, Rekey & Property Access",
    template: "%s | Keepwell",
  },
  description:
    "See the standard price before you request home lockout, rekey, lock change or smart-lock service. Keep Digital Access backup details ready for the next access problem.",
  applicationName: "Keepwell",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keepwell",
    title: "Keepwell | Property access without the pricing scramble",
    description:
      "Fixed standard prices for home access services, plus Digital Access for codes, spare keys and trusted people.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Keepwell | Property access without the pricing scramble",
    description:
      "Fixed standard prices for home access services, plus Digital Access for codes, spare keys and trusted people.",
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Keepwell",
  url: siteUrl,
  description:
    "Keepwell helps customers organize property access and request clearly scoped home lockout, rekey, lock change and smart-lock services from independent local providers.",
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
