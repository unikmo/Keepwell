import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy — Keepwell",
  description: "How Keepwell handles account, Digital Access, property-access, marketplace, and provider information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" lastUpdated="August 15, 2026">
      <LegalSection title="1. Information we collect"><p>Keepwell may collect account information, Digital Access records, trusted-contact information, reference photos, service-request details, property-manager and brokerage information, provider onboarding and job-response information, transaction records, and technical/security data needed to operate the Service.</p></LegalSection>
      <LegalSection title="2. Digital Access sensitive information"><p>Where secret storage is enabled, sensitive text such as a lockbox or keypad code is encrypted by the Keepwell application server before the resulting ciphertext is persisted to the database. The server-side encryption key is not stored in the application database. Private reference photos are stored separately in a non-public storage bucket and are presented through short-lived signed access. Keepwell does not describe this design as zero-knowledge or end-to-end encryption.</p></LegalSection>
      <LegalSection title="3. Trusted contacts"><p>A trusted contact may be recorded as a spare-key holder, emergency contact, or person who can authorize access. Recording a trusted contact does not by itself grant that person access to the member&apos;s Digital Access secrets.</p></LegalSection>
      <LegalSection title="4. How information is used"><p>Information is used to operate accounts, provide self-resolution access tools, route marketplace requests, administer audits, property-manager and brokerage workflows, provider claims and memberships, support transactions, investigate incidents and disputes, secure the platform, and meet legal obligations.</p></LegalSection>
      <LegalSection title="5. Information shared with providers"><p>Before acceptance, provider-visible information should be limited to what is reasonably necessary to evaluate a job. After acceptance, Keepwell may provide details reasonably necessary to perform that service. Providers do not receive standing access to Digital Access secrets or unrelated customer records. Audit providers submit their report to Keepwell rather than receiving authority to sell follow-up work in the home.</p></LegalSection>
      <LegalSection title="6. Vendors"><p>Keepwell may use hosting, authentication, storage, communications, analytics, and payment vendors. Information is shared with those vendors only as appropriate for their role and subject to applicable requirements.</p></LegalSection>
      <LegalSection title="7. Security"><p>Keepwell uses technical and organizational controls intended to reduce unauthorized access, alteration, or loss. Product security claims should reflect controls actually deployed in production. No system can guarantee absolute security.</p></LegalSection>
      <LegalSection title="8. Retention and rights"><p>Information is retained as reasonably necessary for operations, transactions, safety, disputes, and legal obligations. Depending on applicable law, users may have rights to request access, correction, deletion, or a copy of certain personal information.</p></LegalSection>
      <LegalSection title="9. Contact"><p>Privacy questions and requests can be submitted through the Keepwell contact page.</p></LegalSection>
    </LegalDoc>
  );
}
