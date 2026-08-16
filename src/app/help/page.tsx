import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers about Trusted Locksmith, Digital Access, locksmith requests, provider matching, membership and trusted access.",
  alternates: { canonical: "/help" },
};

const SECTIONS = [
  {
    title: "Locksmith requests",
    items: [
      {
        q: "Do I need a membership to find a locksmith?",
        a: "No. One-off locksmith requests are available without membership. Trusted Locksmith shows the standard service price before you submit the request.",
      },
      {
        q: "Does submitting a request mean a locksmith is already assigned?",
        a: "No. A request is submitted first. A provider name and ETA appear only after a participating independent local provider actually accepts the request.",
      },
      {
        q: "Who performs the field work?",
        a: "Independent local providers perform field service. Trusted Locksmith, operated by PlanetHike OÜ, manages the platform, request flow, pricing rules and property-access records.",
      },
      {
        q: "Can a provider add charges after arriving?",
        a: "Only when the job is genuinely outside the published standard scope. Any additional work and price should be shown and approved before that additional work starts.",
      },
    ],
  },
  {
    title: "Digital Access",
    items: [
      {
        q: "What is Digital Access?",
        a: "Digital Access keeps access codes, spare-key details, trusted key holders, recovery instructions and reference photos together for the property so you can check your own backup options first.",
      },
      {
        q: "Can a trusted person see all my saved codes?",
        a: "No. A person can be recorded as holding a spare key or being able to help without automatically receiving access to your saved sensitive details.",
      },
      {
        q: "How are sensitive access details stored?",
        a: "Sensitive text is stored as server-encrypted ciphertext. Reference photos use private storage with time-limited signed access. Trusted Locksmith does not describe this as zero-knowledge or end-to-end encryption.",
      },
    ],
  },
  {
    title: "Membership",
    items: [
      {
        q: "What does membership add?",
        a: "Membership adds Digital Access and plan-specific benefits such as household access profiles, trusted-contact capacity and, on Household+, priority matching and the included Lock & Access Audit on its stated cadence.",
      },
      {
        q: "When do field-service membership benefits begin?",
        a: "Digital Access is available immediately. Field-service membership benefits use the waiting period shown on the pricing page. One-off service can still be requested separately.",
      },
      {
        q: "Does creating an account charge my card?",
        a: "No. Account creation stores your profile and selected plan. Payment activation is handled separately through checkout once payment processing is enabled.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Help center"
          title="Clear answers before you find a locksmith"
          body="Understand Digital Access, local provider matching, pricing and membership without having to decode marketplace jargon."
        />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="mb-14 last:mb-0">
                <h2 className="font-display text-2xl font-medium text-parchment">{section.title}</h2>
                <div className="mt-7 space-y-6">
                  {section.items.map((item) => (
                    <div key={item.q} className="border-b border-line/70 pb-6">
                      <h3 className="font-medium text-parchment">{item.q}</h3>
                      <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CTABand
          title="Still need help?"
          body="Use the contact form for account, provider, privacy or general support questions."
          ctaLabel="Contact Trusted Locksmith"
          ctaHref="/contact"
          secondaryLabel="View locksmith services"
          secondaryHref="/services"
        />
      </main>
      <Footer />
    </div>
  );
}
