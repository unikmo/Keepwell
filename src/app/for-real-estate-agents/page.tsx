import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Closing Gifts for Homebuyers | Keepwell for Real Estate Professionals",
  description: "Give homebuyers a practical closing gift with Digital Access, trusted key-holder setup and clearly priced property-access services through Keepwell.",
  alternates: { canonical: "/for-real-estate-agents" },
};

const REASONS = [
  { title: "Useful on day one", body: "New owners already need to think about keys, rekeys and who can access the property. Keepwell fits naturally into that move-in moment." },
  { title: "Useful long after closing", body: "Digital Access, trusted key holders and clearly priced service remain relevant after the welcome basket is gone." },
  { title: "Designed for bulk gifting", body: "Brokerages can prepare memberships and activation codes across multiple closings instead of buying one-off gifts individually." },
  { title: "The buyer owns the account", body: "The recipient activates and controls their own Keepwell account. Gifted access does not create an ongoing account relationship with the agent." },
];

export default function RealEstateAgentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For real estate professionals"
          title="A closing gift that solves a real homeowner problem."
          body="Give buyers a practical property-access setup: Digital Access for codes and spare-key details, trusted contacts, and clearly priced service when they need on-site help."
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
              {[
                { n: "01", title: "Choose the buyer program", body: "Select the membership tier and batch size that fits your closing volume." },
                { n: "02", title: "Prepare activation codes", body: "Once payment is enabled and confirmed, individual activation codes can be assigned across closings." },
                { n: "03", title: "Buyer activates", body: "The buyer creates and controls their own Keepwell account while the brokerage can track unused versus activated codes." },
              ].map((step) => (
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
          title="Give buyers something they can still use a year later"
          body="Create a brokerage workspace and prepare a repeatable Keepwell closing-gift program."
          ctaLabel="Open brokerage workspace"
          ctaHref="/brokerage"
          secondaryLabel="See membership"
          secondaryHref="/pricing"
        />
      </main>
      <Footer />
    </div>
  );
}
