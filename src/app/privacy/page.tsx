import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy — Keepwell",
  description: "How Keepwell handles account, property-access, marketplace, and provider information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" lastUpdated="August 10, 2026">
      <LegalSection title="1. Information we collect"><p>Keepwell may collect account information, property-access inventory labels, trusted-contact information, service-request details, provider onboarding and job-response information, transaction records, and technical/security data needed to operate the Service.</p></LegalSection>
      <LegalSection title="2. Access secrets"><p>Keepwell's current access-inventory feature is not intended for door codes, alarm PINs, lockbox combinations, or other access secrets. New secret entry is disabled while stronger application-level secret-storage controls are developed and reviewed.</p></LegalSection>
      <LegalSection title="3. How information is used"><p>Information is used to operate accounts, route marketplace requests, administer provider claims and memberships, support transactions, investigate incidents and disputes, secure the platform, and meet legal obligations.</p></LegalSection>
      <LegalSection title="4. Information shared with providers"><p>Before acceptance, provider-visible information should be limited to what is reasonably necessary to evaluate a job. After acceptance, Keepwell may provide details reasonably necessary to perform that service. Providers do not receive standing access to unrelated customer records.</p></LegalSection>
      <LegalSection title="5. Vendors"><p>Keepwell may use hosting, authentication, communications, analytics, and payment vendors. Information is shared with those vendors only as appropriate for their role and subject to applicable requirements.</p></LegalSection>
      <LegalSection title="6. Security"><p>Keepwell uses technical and organizational controls intended to reduce unauthorized access, alteration, or loss. Product security claims should reflect controls actually deployed in production. No system can guarantee absolute security.</p></LegalSection>
      <LegalSection title="7. Retention and rights"><p>Information is retained as reasonably necessary for operations, transactions, safety, disputes, and legal obligations. Depending on applicable law, users may have rights to request access, correction, deletion, or a copy of certain personal information.</p></LegalSection>
      <LegalSection title="8. Contact"><p>Privacy questions and requests can be submitted through the Keepwell contact page.</p></LegalSection>
    </LegalDoc>
  );
}
