import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";
import { CookiePreferences } from "@/components/CookiePreferences";

export const metadata: Metadata = {
  title: "Cookie Preferences — Digital Sentinel",
  description: "What cookies Digital Sentinel uses and how to control them.",
  alternates: { canonical: "/legal/cookies" },
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <LegalDoc title="Cookie Preferences" lastUpdated="July 30, 2026">
      <LegalSection title="How we use cookies">
        <p>
          We use a small number of essential cookies to keep the site and app working — mainly
          to keep you signed in between visits. We may use limited analytics cookies to
          understand overall product usage; these never include your vault contents or
          dispatch details.
        </p>
      </LegalSection>

      <CookiePreferences />

      <LegalSection title="More detail">
        <p>
          For the full breakdown of what we collect and why, see our{" "}
          <a href="/legal/privacy" className="text-brass hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
