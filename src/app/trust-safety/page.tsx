import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Trust and safety",
  description: "How Keepwell separates platform responsibilities from independent provider responsibilities and handles property-access information.",
  alternates: { canonical: "/trust-safety" },
};

const PILLARS = [
  {
    title: "No fictional provider status",
    body: "Keepwell should never show a provider name, rating, verification badge or ETA until that information comes from a real provider record and accepted request.",
  },
  {
    title: "Clear platform role",
    body: "Keepwell structures requests, marketplace rules and property records. Independent providers perform field service and remain responsible for their own work.",
  },
  {
    title: "Scope before work",
    body: "The customer should see the requested service scope and any additional price before authorizing work beyond that scope.",
  },
  {
    title: "Access information stays intentional",
    body: "The vault should be limited to property-access details and trusted-contact information, with permissions and security designed around that narrow use case.",
  },
];

const FAQ = [
  {
    q: "Does Keepwell employ the service provider?",
    a: "No. Keepwell is designed as a marketplace platform. Participating providers are independent businesses or professionals, not Keepwell employees.",
  },
  {
    q: "How does provider verification work?",
    a: "The platform should verify the provider information required by its onboarding standard and the relevant service area before activation. Keepwell should only display verification claims that are actually supported by the provider record.",
  },
  {
    q: "Can a service request be unavailable?",
    a: "Yes. Marketplace supply varies. A request is not the same thing as a confirmed provider match, and the interface should make that distinction explicit.",
  },
  {
    q: "Is membership insurance?",
    a: "No. Keepwell membership is a service-platform membership and should not be treated as a substitute for property, renters or auto insurance.",
  },
];

export default function TrustSafetyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Trust & safety"
          title="Trust starts with not pretending the marketplace has done more than it has"
          body="Provider identity, timing, payment and service status should reflect real platform events — never placeholders presented as facts."
        />
        <section className="border-b border-line/70 py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-line bg-surface p-7">
                <h2 className="font-display text-2xl text-parchment">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-6 text-parchment-dim">{pillar.body}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-display text-3xl text-parchment">Common questions</h2>
            <div className="mt-10 space-y-6">
              {FAQ.map((item) => (
                <div key={item.q} className="border-b border-line/70 pb-6">
                  <h3 className="font-medium text-parchment">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTABand
          title="Have a trust or safety concern?"
          body="Use the contact form for provider, account, privacy or safety concerns."
          ctaLabel="Contact Keepwell"
          ctaHref="/contact?topic=Trust%20%26%20safety"
        />
      </main>
      <Footer />
    </div>
  );
}
