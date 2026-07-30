import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service — Digital Sentinel",
  description: "The terms that govern use of the Digital Sentinel membership, app, and dispatch network.",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of Service" lastUpdated="July 30, 2026">
      <LegalSection title="1. Acceptance of terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Digital
          Sentinel website, mobile application, and membership services (together, the
          &ldquo;Service&rdquo;), operated by Digital Sentinel, Inc. (&ldquo;Digital Sentinel,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account or using the Service, you agree
          to these Terms and to our Privacy Policy and Member Agreement, which are incorporated by
          reference.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of the service">
        <p>
          Digital Sentinel is a membership that provides access to covered dispatch for eligible
          home-access events (such as lockouts and rekeys), a digital key and code vault, trusted
          contact sharing, and related features described on our Pricing page and in the Member
          Agreement. Dispatch services are performed by independent, background-checked technicians
          (&ldquo;Techs&rdquo;) who are not employees of Digital Sentinel.
        </p>
        <p>
          Digital Sentinel membership is <strong className="text-parchment">not insurance</strong>{" "}
          and should not be relied on as a substitute for homeowners&rsquo;, renters&rsquo;, or
          auto insurance.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and accounts">
        <p>
          You must be at least 18 years old and able to form a binding contract to create an
          account. You&rsquo;re responsible for maintaining the confidentiality of your login
          credentials and for all activity under your account. Notify us immediately if you
          suspect unauthorized access.
        </p>
      </LegalSection>

      <LegalSection title="4. Membership, billing, and cancellation">
        <p>
          Membership plans, pricing, and included covered events are described on our Pricing
          page at the time of signup and are billed annually unless otherwise stated. Covered
          events reset at each renewal and do not carry over. You can cancel at any time through
          your account or by contacting support; cancellation and refund terms are set out in the
          Member Agreement.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>
          You agree not to misuse the Service, including by submitting false dispatch requests,
          attempting to access another member&rsquo;s vault or account, interfering with the
          Service&rsquo;s operation, or using the Service for any unlawful purpose.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party technicians">
        <p>
          Techs in the dispatch network are independent contractors, not Digital Sentinel
          employees or agents. We take commercially reasonable steps to vet Techs, including
          background checks, but we do not guarantee the conduct, workmanship, or availability of
          any individual Tech. Any work performed beyond a covered event will always show a fixed
          price before it begins.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers and limitation of liability">
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or
          implied. To the maximum extent permitted by law, Digital Sentinel&rsquo;s total
          liability arising out of or relating to the Service will not exceed the amount you paid
          us in the twelve months preceding the claim. We are not liable for indirect,
          incidental, or consequential damages.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to these terms">
        <p>
          We may update these Terms from time to time. If we make material changes, we&rsquo;ll
          provide notice through the app or by email before they take effect. Continued use of
          the Service after changes take effect constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These Terms are governed by the laws of the state in which Digital Sentinel, Inc. is
          incorporated, without regard to conflict-of-law principles, unless a different
          arrangement is required by local law where you reside.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:support@digitalsentinel.com" className="text-brass hover:underline">
            support@digitalsentinel.com
          </a>{" "}
          or through our{" "}
          <a href="/contact" className="text-brass hover:underline">
            contact page
          </a>
          .
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
