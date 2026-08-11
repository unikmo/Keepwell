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
    <LegalDoc title="Terms of Service" lastUpdated="August 10, 2026">
      <LegalSection title="1. Keepwell platform"><p>Keepwell operates a technology platform that helps customers request property-access services from independent local providers. Keepwell does not itself perform locksmith, security-system, installation, repair, or other field work unless explicitly stated for a specific service.</p></LegalSection>
      <LegalSection title="2. Provider availability"><p>Submitting a request does not guarantee provider availability. Provider identity and arrival timing are shown only after a real provider accepts. Arrival estimates may change because of traffic, job conditions, or provider circumstances.</p></LegalSection>
      <LegalSection title="3. Pricing"><p>For standard one-off services, Keepwell displays the standard service price, the fixed provider travel fee, and the total before submission. The current standard provider travel fee is $25 where shown in the request flow. Out-of-scope work must be separately priced and approved before it begins.</p></LegalSection>
      <LegalSection title="4. Membership"><p>Membership is optional. A travel-fee waiver removes one displayed $25 provider travel fee from an eligible request. It does not make the underlying field service free unless Keepwell explicitly states otherwise. Membership is not insurance.</p></LegalSection>
      <LegalSection title="5. Customer authority"><p>Customers must have lawful authority to request access to or work on the property, vehicle, lock, or other item involved. A provider may require identification or proof of authority before work begins.</p></LegalSection>
      <LegalSection title="6. Independent providers"><p>Participating providers are independent businesses, not Keepwell employees. Providers are responsible for field work they accept, including workmanship, tools, qualifications, licenses, permits, and legal compliance applicable to that work.</p></LegalSection>
      <LegalSection title="7. Sensitive access information"><p>Keepwell's current access-inventory feature is for labels and records, not door codes, alarm PINs, lockbox combinations, or other access secrets. Do not enter access secrets unless Keepwell expressly introduces a secured secret-storage feature.</p></LegalSection>
      <LegalSection title="8. Cancellations and disputes"><p>Cancellation, refund, failed-match, provider no-show, and dispute rules shown in the request flow or applicable policy form part of these Terms. Payment authorizations should be released or refunded according to the checkout terms when no service is completed.</p></LegalSection>
      <LegalSection title="9. Acceptable use"><p>You may not submit false requests, request unauthorized entry, misuse another person's account, bypass security controls, interfere with the Service, or use Keepwell unlawfully.</p></LegalSection>
      <LegalSection title="10. Legal review"><p>These operational terms must be supplemented before unrestricted public launch with the final operating legal entity, governing-law provisions, payment/refund terms, and any state-specific terms required for the launch market.</p></LegalSection>
      <LegalSection title="11. Contact"><p>Questions about these Terms can be submitted through the Keepwell contact page.</p></LegalSection>
    </LegalDoc>
  );
}
