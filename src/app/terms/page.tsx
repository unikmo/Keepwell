import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service — Keepwell",
  description: "Terms governing use of the Keepwell property-access marketplace and membership features.",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" lastUpdated="August 11, 2026">
      <LegalSection title="1. Keepwell platform"><p>Keepwell operates a technology platform that helps customers organize property-access information and request services from independent local providers. Keepwell does not itself perform locksmith, security-system, installation, repair, audit fieldwork, or other field work unless explicitly stated for a specific service.</p></LegalSection>
      <LegalSection title="2. Provider availability"><p>Submitting a request does not guarantee provider availability. Provider identity and arrival timing are shown only after a real provider accepts. Arrival estimates may change because of traffic, job conditions, or provider circumstances.</p></LegalSection>
      <LegalSection title="3. Pricing"><p>For standard one-off services, Keepwell displays one standard all-in price before submission. The displayed standard price includes provider travel/service call. No second generic travel or service-call fee is added later. Hardware and work outside the stated standard scope may be separately priced only after the additional work and price are shown and approved before that work begins.</p></LegalSection>
      <LegalSection title="4. Membership and waiting period"><p>Membership is optional and is not insurance. Digital Sentinel and other digital account features may be available immediately after enrollment. Field-service membership benefits begin after the waiting period shown at enrollment, currently 14 days for launch memberships. Customers may still request ordinary fixed-price one-off service during the waiting period.</p></LegalSection>
      <LegalSection title="5. Household+ Lock & Access Audit"><p>Household+ includes one Lock & Access Audit every three years, subject to eligibility and provider availability. The first included audit is not available before the field-benefit waiting period ends. During an audit, the independent provider inspects and submits a standardized report to Keepwell. The provider is not authorized to quote, sell, or collect payment for remedial work during that audit. Keepwell may later issue a separate official follow-up offer for the customer's approval.</p></LegalSection>
      <LegalSection title="6. Customer authority"><p>Customers must have lawful authority to request access to or work on the property, vehicle, lock, or other item involved. A provider may require identification or proof of authority before work begins.</p></LegalSection>
      <LegalSection title="7. Independent providers"><p>Participating providers are independent businesses, not Keepwell employees. Providers are responsible for field work they accept, including workmanship, tools, qualifications, licenses, permits, and legal compliance applicable to that work.</p></LegalSection>
      <LegalSection title="8. Digital Sentinel"><p>Digital Sentinel allows members to store access instructions and, where enabled, sensitive access details. Sensitive text entered through the Keepwell application is encrypted by the application server before ciphertext is persisted to the database. Reference photos are stored in a private storage bucket and delivered through time-limited signed access. Trusted contacts and key-holder records do not automatically receive access to Digital Sentinel secrets. Users remain responsible for controlling their account credentials and deciding what information to store.</p></LegalSection>
      <LegalSection title="9. Cancellations and disputes"><p>Cancellation, refund, failed-match, provider no-show, and dispute rules shown in the request flow or applicable policy form part of these Terms. Payment authorizations should be released or refunded according to the checkout terms when no service is completed.</p></LegalSection>
      <LegalSection title="10. Acceptable use"><p>You may not submit false requests, request unauthorized entry, misuse another person's account, bypass security controls, interfere with the Service, or use Keepwell unlawfully.</p></LegalSection>
      <LegalSection title="11. Legal review"><p>These operational terms must be supplemented before unrestricted public launch with the final operating legal entity, governing-law provisions, payment/refund terms, provider agreement, membership agreement, and any state-specific terms required for the launch market.</p></LegalSection>
      <LegalSection title="12. Contact"><p>Questions about these Terms can be submitted through the Keepwell contact page.</p></LegalSection>
    </LegalDoc>
  );
}
