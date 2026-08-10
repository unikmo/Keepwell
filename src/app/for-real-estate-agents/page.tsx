import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Keepwell for real estate professionals",
  description: "Give buyers a useful move-in access setup: rekey support, trusted access and a property-access record through Keepwell.",
  alternates: { canonical: "/for-real-estate-agents" },
};

const REASONS = [
  { title: "The rekey conversation already exists", body: "New owners are already thinking about who has keys. Keepwell turns that advice into a clear move-in action." },
  { title: "Useful after closing", body: "A property-access setup remains relevant after the gift basket is gone: trusted contacts, access notes and future service requests." },
  { title: "Simple handoff", body: "The agent can introduce or gift the product, then Keepwell handles the owner onboarding rather than creating another task for the brokerage." },
  { title: "Portfolio partnership path", body: "Brokerages can standardize the offer across closings once the individual use case proves conversion and retention." },
];

export default function RealEstateAgentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For real estate professionals"
          title="Turn 'you should rekey after closing' into a useful move-in product"
          body="Keepwell gives new owners a property-access setup they can keep using: rekey support, trusted access, access records and a route for future service."
        />
        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h2 className="font-display text-xl text-parchment">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {[{n:"01",title:"Choose the offer",body:"Gift a first term, sponsor a move-in access service or provide a brokerage code."},{n:"02",title:"Buyer activates",body:"The client creates their own Keepwell account and keeps control of their property-access information."},{n:"03",title:"Keepwell continues",body:"Future service requests and property records stay with the owner, not with the agent."}].map((step) => (
                <div key={step.n} className="border-t border-line pt-5">
                  <div className="font-mono text-xs text-brass">{step.n}</div>
                  <h2 className="mt-3 font-display text-xl text-parchment">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CTABand
          title="Build a move-in access offer around the closing"
          body="Start with a simple buyer handoff or gifting pilot. Keepwell remains the platform; independent providers perform any field service."
          ctaLabel="Discuss a partnership"
          ctaHref="/contact?topic=Partnership"
          secondaryLabel="See membership"
          secondaryHref="/pricing"
        />
      </main>
      <Footer />
    </div>
  );
}
