import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Member Agreement — Digital Sentinel",
  description: "What's covered under your Digital Sentinel membership, plan by plan, and what isn't.",
  alternates: { canonical: "/member-agreement" },
  robots: { index: false },
};

export default function MemberAgreementPage() {
  return (
    <LegalDoc title="Member Agreement" lastUpdated="July 30, 2026">
      <LegalSection title="1. Membership is not insurance">
        <p>
          Digital Sentinel is a services membership, not an insurance product. It is not
          regulated as insurance and should not be relied on as a substitute for homeowners&rsquo;,
          renters&rsquo;, or auto insurance. This agreement describes the specific services
          included with your plan.
        </p>
      </LegalSection>

      <LegalSection title="2. What counts as a covered event">
        <p>
          A &ldquo;covered event&rdquo; is one of the following, drawn from your plan&rsquo;s
          yearly pool of covered events:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>A lockout at your registered home address.</li>
          <li>A car lockout occurring at your registered home address.</li>
          <li>A standard rekey of an existing lock at your registered home address.</li>
        </ul>
        <p>
          Full lock replacement, smart-lock hardware, and any work beyond a standard rekey are
          not included in the covered-event pool. When suggested, these are always quoted at a
          fixed price and confirmed by you before any work begins.
        </p>
      </LegalSection>

      <LegalSection title="3. What each plan includes">
        <p>
          <strong className="text-parchment">Individual ($29/year):</strong> 3 covered events per
          year, a digital key vault, and 1 trusted contact. Lockbox code registration is not
          included at this tier and is available as a one-time optional add-on ($19.99).
        </p>
        <p>
          <strong className="text-parchment">Household ($49/year):</strong> everything in
          Individual, extended to cover your full household, plus unlimited trusted contacts. This
          tier does not include a complimentary onboarding security audit.
        </p>
        <p>
          <strong className="text-parchment">Household + Smart Security ($89/year):</strong>{" "}
          everything in Household, plus one guaranteed onboarding visit combining a home security
          audit, a lockbox mount, and a smart lock install; an annual re-audit; and priority
          dispatch scheduling. This is currently the only plan that includes a guaranteed
          combined install visit.
        </p>
        <p>
          Plan contents and pricing may change for future billing periods; we&rsquo;ll notify you
          before any change affects your renewal.
        </p>
      </LegalSection>

      <LegalSection title="4. Covered events reset annually">
        <p>
          Your covered-event pool refreshes at each annual renewal. Unused covered events do not
          roll over or carry a cash value. If you exhaust your covered events before renewal,
          additional dispatch requests are billed at a fixed, disclosed rate rather than drawn
          from the pool.
        </p>
      </LegalSection>

      <LegalSection title="5. Price certainty on upgrades">
        <p>
          Any suggested work beyond a covered event — a full lock replacement, additional smart
          lock hardware, or similar — is always quoted as a fixed price shown to you before the
          Tech begins work. You are never charged for suggested upgrades without confirming the
          price first.
        </p>
      </LegalSection>

      <LegalSection title="6. Cancellation and refunds">
        <p>
          You may cancel your membership at any time through your account or by contacting
          support. Cancellation stops future renewal billing. Membership fees already paid for
          the current term are non-refundable except where required by law, or at our discretion
          in cases of billing error.
        </p>
      </LegalSection>

      <LegalSection title="7. Fair use">
        <p>
          Covered dispatch is intended for genuine access events at your registered address. We
          reserve the right to review unusually frequent requests and may decline coverage or
          suspend membership in cases of suspected misuse.
        </p>
      </LegalSection>

      <LegalSection title="8. Relationship to the Terms of Service">
        <p>
          This Member Agreement works alongside our{" "}
          <a href="/terms" className="text-brass hover:underline">
            Terms of Service
          </a>
          . Where this Agreement describes specific plan coverage, and the Terms describe general
          use of the Service, both apply together.
        </p>
      </LegalSection>

      <LegalSection title="9. Questions about your coverage">
        <p>
          If you&rsquo;re ever unsure whether something is covered, ask before assuming — contact
          us through the{" "}
          <a href="/contact" className="text-brass hover:underline">
            contact page
          </a>{" "}
          and we&rsquo;ll clarify against your specific plan.
        </p>
      </LegalSection>
    </LegalDoc>
  );
}
