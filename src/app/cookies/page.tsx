import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";
import { CookiePreferences } from "@/components/CookiePreferences";

export const metadata: Metadata = {
  title: "Cookie Preferences — Trusted Locksmith",
  description: "What cookies Trusted Locksmith uses and how to control them.",
  alternates: { canonical: "/cookies" },
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <LegalDoc title="Cookie Preferences" lastUpdated="August 16, 2026">
      <LegalSection title="How we use cookies">
        <p>
          Trusted Locksmith, operated by PlanetHike OÜ, uses a small number of essential cookies to keep the site and app working — mainly
          to keep you signed in between visits. We may use limited analytics cookies to
          understand overall product usage; these never include your Digital Access contents or
          private service details.
        </p>
      </LegalSection>

      <CookiePreferences />

      <LegalSection title="More detail">
        <p>
          For the full breakdown of what we collect and why, see our{" "}
          <a href="/privacy" className="text-brass hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
