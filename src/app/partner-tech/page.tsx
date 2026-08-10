import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Join the Keepwell provider network",
  description: "Independent property-access providers can apply to receive clearly scoped Keepwell marketplace requests in the service areas they choose.",
  alternates: { canonical: "/partner-tech" },
};

const REASONS = [
  { title: "Clearly scoped requests", body: "See the service type and relevant property details before deciding whether to accept a request." },
  { title: "Transparent economics", body: "Provider payout and any platform fee should be visible before acceptance, not discovered after the job." },
  { title: "You remain independent", body: "Choose service area and availability. Keepwell is the marketplace platform, not your employer or field supervisor." },
  { title: "Build marketplace history", body: "Completed work can build a provider record inside Keepwell once real ratings and job history exist." },
];

const REQUIREMENTS = [
  "Identity and business verification",
  "Applicable trade credentials where required for the service and jurisdiction",
  "Proof of insurance where required by Keepwell's provider standards",
  "Accurate service area and availability information",
  "Agreement to platform pricing, conduct and completion rules",
];

export default function PartnerTechPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For independent providers"
          title="Take the jobs that fit. Keep your independence."
          body="Keepwell is building a property-access marketplace around clear requests, transparent economics and a clean handoff between customer and provider."
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

        <section className="border-b border-line/70 bg-surface/20 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {[{n:"01",title:"Apply",body:"Provide your service area, business information, experience and the services you want to receive."},{n:"02",title:"Get approved",body:"Keepwell reviews the provider information and any required credentials or insurance before activation."},{n:"03",title:"Accept requests",body:"Available marketplace requests can be accepted or declined based on your own schedule and service area."}].map((step) => (
                <div key={step.n} className="border-t border-line pt-5">
                  <div className="font-mono text-xs text-brass">{step.n}</div>
                  <h2 className="mt-3 font-display text-xl text-parchment">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="eyebrow text-center">Provider standards</div>
            <h2 className="mt-3 text-center font-display text-3xl text-parchment">What Keepwell needs before activation</h2>
            <ul className="mx-auto mt-8 max-w-xl space-y-3 text-sm leading-6 text-parchment-dim">
              {REQUIREMENTS.map((item) => <li key={item} className="flex gap-3"><span className="text-verdigris">✓</span><span>{item}</span></li>)}
            </ul>
            <p className="mx-auto mt-6 max-w-xl text-xs leading-5 text-parchment-dim/80">Requirements should be applied by service type and jurisdiction. Keepwell should not claim a credential requirement that does not actually exist in a provider's location.</p>
          </div>
        </section>

        <CTABand
          title="Interested in joining the provider network?"
          body="Send your service area and business details. Keepwell can use provider applications to build supply before opening customer demand in a market."
          ctaLabel="Apply as a provider"
          ctaHref="/contact?topic=Provider"
          secondaryLabel="How the platform works"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
