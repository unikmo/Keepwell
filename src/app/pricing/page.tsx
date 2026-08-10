import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";
import { getPlans, planDisplay, formatUsd } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Membership pricing",
  description: "Compare Keepwell membership options for property access tools, trusted contacts and covered-event benefits.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  {
    q: "Do I need a membership to use Keepwell?",
    a: "No. One-off service requests remain available. Membership is for owners who want Keepwell set up before an access problem happens and who value the ongoing property-access tools and plan benefits.",
  },
  {
    q: "Who performs the service work?",
    a: "Independent local providers perform the field service. Keepwell operates the platform, request flow, property records and marketplace rules.",
  },
  {
    q: "Are providers always available?",
    a: "No marketplace should promise that before it has a real match. Availability depends on participating providers, service type, location and time. Keepwell should only show a provider or ETA after an actual provider accepts.",
  },
  {
    q: "Is membership insurance?",
    a: "No. Keepwell membership is a service-platform membership and is not a substitute for homeowners, renters or auto insurance.",
  },
];

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Membership"
          title="Use Keepwell once, or keep it ready year-round"
          body="Membership adds ongoing access tools and plan benefits. One-off service requests remain available without forcing every customer into a subscription."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const { features, addOns, tagline } = planDisplay(plan);
                const highlighted = plan.id === "household";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${highlighted ? "border-brass/70 bg-surface-raised shadow-[0_18px_60px_-32px_rgba(212,173,88,.65)]" : "border-line bg-surface"}`}
                  >
                    {highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brass px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">
                        Best for households
                      </div>
                    )}
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">{plan.name}</div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span className="font-display text-5xl font-medium text-parchment">{formatUsd(plan.price_cents)}</span>
                      <span className="text-sm text-parchment-dim">/year</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-parchment-dim">{tagline}</p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-parchment">
                          <span className="mt-0.5 text-verdigris">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {addOns && (
                      <ul className="mt-4 space-y-2 border-t border-line/70 pt-4 text-sm">
                        {addOns.map((addOn) => (
                          <li key={addOn.label} className="flex items-start justify-between gap-3 text-parchment-dim">
                            <span>{addOn.label}</span>
                            <span className="whitespace-nowrap font-mono text-xs text-brass">{addOn.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex-1" />
                    <Link
                      href={`/signup?plan=${plan.id}`}
                      className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${highlighted ? "bg-brass text-ink hover:brightness-110" : "border border-line text-parchment hover:border-parchment-dim"}`}
                    >
                      Continue with {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface/60 p-6 text-sm leading-6 text-parchment-dim">
              <strong className="text-parchment">Platform note:</strong> covered-event benefits describe plan eligibility, not a promise that a provider is instantly available in every location. A real provider match must happen before Keepwell shows provider identity or arrival timing.
            </div>

            <div className="mt-8 text-center text-sm text-parchment-dim">
              Need a single service instead? <Link href="/book" className="font-medium text-brass hover:underline">Request one-off service →</Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-display text-3xl font-medium text-parchment">Membership questions</h2>
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
          title="Membership should make the next access problem easier"
          body="Set up trusted access and property context before you need them, while keeping one-off service available for everyone else."
          ctaLabel="Choose a plan"
          ctaHref="/signup"
          secondaryLabel="How it works"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
