import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Member Agreement — Keepwell",
  description: "Terms for Keepwell membership, Digital Access, waiting periods, plan benefits and cancellation.",
  alternates: { canonical: "/member-agreement" },
  robots: { index: false },
};

export default function MemberAgreementPage() {
  return (
    <LegalDoc title="Member Agreement" lastUpdated="August 15, 2026">
      <LegalSection title="1. Membership is optional and is not insurance">
        <p>Keepwell membership is an optional service-platform membership. It is not insurance and is not a substitute for homeowners, renters, vehicle, liability, or other insurance.</p>
      </LegalSection>

      <LegalSection title="2. Account creation is not payment activation">
        <p>Creating a Keepwell account or selecting a membership plan does not by itself activate a paid membership. Paid benefits begin only after the applicable checkout confirms payment. Until payment processing is enabled, the account may store the selected plan without treating paid benefits as active.</p>
      </LegalSection>

      <LegalSection title="3. Digital Access">
        <p>Digital Access helps you keep property-access codes, spare-key details, trusted key holders, recovery instructions, and reference photos together for the property. Digital Access may be available with the account before paid field-service benefits begin.</p>
      </LegalSection>

      <LegalSection title="4. Individual plan">
        <p><strong className="text-parchment">Individual ($29/year):</strong> Digital Access for one member, one trusted key holder or emergency contact, access to Keepwell&apos;s published standard service prices, and any other benefits shown at checkout for that plan.</p>
      </LegalSection>

      <LegalSection title="5. Household plan">
        <p><strong className="text-parchment">Household ($49/year):</strong> everything in Individual, plus household access profiles, unlimited trusted contacts and key holders, and the household benefits shown at checkout.</p>
      </LegalSection>

      <LegalSection title="6. Household+ plan">
        <p><strong className="text-parchment">Household+ ($89/year):</strong> everything in Household, plus priority provider matching when marketplace supply is available and one included Lock &amp; Access Audit every three years, subject to eligibility, waiting period, provider availability, and the rules shown at checkout.</p>
      </LegalSection>

      <LegalSection title="7. Waiting period">
        <p>Paid field-service membership benefits are subject to the waiting period disclosed at enrollment or checkout. The current launch design uses a 14-day waiting period. One-off fixed-price service remains available separately during the waiting period.</p>
      </LegalSection>

      <LegalSection title="8. Provider availability">
        <p>Membership does not guarantee that a provider will be available at every time or location. Keepwell is a marketplace platform. Provider identity and ETA appear only after a participating independent provider actually accepts a request.</p>
      </LegalSection>

      <LegalSection title="9. Lock & Access Audit">
        <p>The Household+ audit is performed by an independent provider. The provider submits a standardized report through Keepwell. Any follow-up work should be offered separately through the platform so the scope and price are clear before approval.</p>
      </LegalSection>

      <LegalSection title="10. Pricing and renewals">
        <p>Membership pricing, renewal frequency, any automatic-renewal terms, and the then-current plan benefits will be shown before paid enrollment. Future changes apply only as permitted by the applicable checkout terms and law.</p>
      </LegalSection>

      <LegalSection title="11. Cancellation and refunds">
        <p>You may cancel future renewal using the cancellation method made available with the paid membership or by contacting Keepwell support. Final refund, renewal, and failed-payment terms will be shown as part of the live payment flow before paid public launch.</p>
      </LegalSection>

      <LegalSection title="12. Relationship to the Terms of Service">
        <p>This Member Agreement works together with the <a href="/terms" className="text-brass hover:underline">Terms of Service</a>. The Terms govern general use of Keepwell; this Agreement describes membership-specific rules.</p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>Questions about membership can be submitted through the <a href="/contact" className="text-brass hover:underline">Keepwell contact page</a>.</p>
      </LegalSection>
    </LegalDoc>
  );
}
