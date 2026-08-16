import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Trust & Safety | Trusted Locksmith",
  description: "How Trusted Locksmith vets provider information, separates platform responsibilities from independent provider responsibilities and handles property-access information.",
  alternates: { canonical: "/trust-safety" },
};

const PILLARS = [
  {
    title: "Provider information is reviewed",
    body: "Provider activation is based on the business, service-area and credential information required by the onboarding standard. Trusted Locksmith only displays verification claims supported by the provider record.",
  },
  {
    title: "No fictional provider status",
    body: "Trusted Locksmith does not show a provider name, rating, verification badge or ETA until that information comes from a real provider record and accepted request.",
  },
  {
    title: "Clear platform role",
    body: "Trusted Locksmith structures requests, pricing rules and property records. Independent providers perform field service and remain responsible for their own work.",
  },
  {
    title: "Scope before extra work",
    body: "You see the requested service scope and any additional price before authorizing work beyond the published standard scope.",
  },
];

const FAQ = [
  {
    q: "Does Trusted Locksmith employ the locksmith?",
    a: "No. Trusted Locksmith is a platform operated by PlanetHike OÜ. Participating locksmith providers are independent businesses or professionals, not PlanetHike OÜ employees.",
  },
  {
    q: "How does provider vetting work?",
    a: "Provider information required by the onboarding standard and relevant service area is reviewed before activation. Trusted Locksmith only displays verification claims that are supported by the provider record.",
  },
  {
    q: "Can a locksmith request be unavailable?",
    a: "Yes. Local provider availability varies. A request is not the same thing as a confirmed provider match; a provider name and ETA appear only after a real provider accepts.",
  },
  {
    q: "Is membership insurance?",
    a: "No. Trusted Locksmith membership is a service-platform membership and is not a substitute for property, renters or auto insurance.",
  },
];

export default function TrustSafetyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Trust & safety"
          title="Trust starts before a locksmith reaches your door."
          body="Provider information, pricing and service status should reflect real platform records and real provider actions—not placeholders presented as facts."
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
          ctaLabel="Contact Trusted Locksmith"
          ctaHref="/contact?topic=Trust%20%26%20safety"
        />
      </main>
      <Footer />
    </div>
  );
}
