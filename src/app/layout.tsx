import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mykeepwell.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Keepwell | Locksmith Prices, Lockouts, Rekeys & Digital Access",
    template: "%s | Keepwell",
  },
  description:
    "See upfront standard prices for home lockouts, rekeys, lock changes and smart-lock installation before you request an independent local provider.",
  applicationName: "Keepwell",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keepwell",
    title: "Keepwell | Property access without the pricing scramble",
    description:
      "Upfront standard prices for locksmith services, plus Digital Access for codes, spare keys and trusted people.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Keepwell | Property access without the pricing scramble",
    description:
      "Upfront standard prices for locksmith services, plus Digital Access for codes, spare keys and trusted people.",
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
