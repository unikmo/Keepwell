import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Trusted Locksmith platform, locksmith marketplace and membership features.",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" lastUpdated="August 16, 2026">
      <LegalSection title="1. Trusted Locksmith platform and operator"><p>Trusted Locksmith is a technology platform operated by PlanetHike OÜ. The platform helps customers organize property-access information and request services from independent local providers. PlanetHike OÜ does not itself perform locksmith, security-system, installation, repair, audit fieldwork, or other field work unless explicitly stated for a specific service.</p></LegalSection>
      <LegalSection title="2. Provider availability"><p>Submitting a request does not guarantee provider availability. Provider identity and arrival timing are shown only after a real provider accepts. Arrival estimates may change because of traffic, job conditions, or provider circumstances.</p></LegalSection>
      <LegalSection title="3. Pricing"><p>For standard one-off services, Trusted Locksmith displays one standard all-in price before submission. The displayed standard price includes provider travel/service call. No second generic travel or service-call fee is added later. Hardware and work outside the stated standard scope may be separately priced only after the additional work and price are shown and approved before that work begins.</p></LegalSection>
      <LegalSection title="4. Membership and activation"><p>Membership is optional and is not insurance. Creating an account or selecting a plan does not by itself activate a paid membership. Paid membership benefits begin only after successful payment activation through the applicable checkout flow. Digital Access may be available with the account before paid field-service benefits begin. Field-service membership benefits are also subject to the waiting period shown at checkout or enrollment, currently 14 days for the launch plan design. Customers may still request ordinary fixed-price one-off service separately.</p></LegalSection>
      <LegalSection title="5. Household+ Lock & Access Audit"><p>Household+ is designed to include one Lock & Access Audit every three years, subject to paid membership activation, eligibility and provider availability. The first included audit is not available before the field-benefit waiting period ends. During an audit, the independent provider inspects and submits a standardized report through Trusted Locksmith. Any follow-up work should be offered separately through the platform so scope and price are clear before approval.</p></LegalSection>
      <LegalSection title="6. Customer authority"><p>Customers must have lawful authority to request access to or work on the property, vehicle, lock, or other item involved. A provider may require identification or proof of authority before work begins.</p></LegalSection>
      <LegalSection title="7. Independent providers"><p>Participating providers are independent businesses, not employees of PlanetHike OÜ or Trusted Locksmith. Providers are responsible for field work they accept, including workmanship, tools, qualifications, licenses, permits, and legal compliance applicable to that work.</p></LegalSection>
      <LegalSection title="8. Digital Access"><p>Digital Access allows users to store access instructions and, where enabled, sensitive access details. Sensitive text entered through the Trusted Locksmith application is encrypted by the application server before ciphertext is persisted to the database. Reference photos are stored in a private storage bucket and delivered through time-limited signed access. Trusted contacts and key-holder records do not automatically receive access to Digital Access secrets. Users remain responsible for controlling their account credentials and deciding what information to store.</p></LegalSection>
      <LegalSection title="9. Payments, renewals and cancellation"><p>Payment, renewal, cancellation, refund, failed-match, provider no-show and dispute rules shown in the applicable checkout or request flow form part of these Terms. If automatic renewal is offered, the renewal price, frequency, cancellation method and refund policy must be disclosed before enrollment. No paid membership should be treated as active until the payment system confirms activation.</p></LegalSection>
      <LegalSection title="10. Acceptable use"><p>You may not submit false requests, request unauthorized entry, misuse another person's account, bypass security controls, interfere with the Service, or use Trusted Locksmith unlawfully.</p></LegalSection>
      <LegalSection title="11. Pre-launch legal completion"><p>Before unrestricted paid public launch, these operational terms should be supplemented with the final governing-law provisions, payment/refund terms, provider agreement, final membership terms, company contact details and any market-specific terms required for the launch jurisdictions.</p></LegalSection>
      <LegalSection title="12. Contact"><p>Questions about these Terms can be submitted through the Trusted Locksmith contact page.</p></LegalSection>
    </LegalDoc>
  );
}
