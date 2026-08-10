import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";
import { getPlans, planDisplay, formatUsd } from "@/lib/plans";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Keepwell prices — one-off service & membership",
  description:
    "See Keepwell's fixed one-off property-access service menu and compare membership options. No membership is required to request service.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  {
    q: "Do I need a membership to use Keepwell?",
    a: "No. One-off service requests are a core Keepwell offer. Membership is for owners who want ongoing property-access tools plus eligible covered-event benefits.",
  },
  {
    q: "Is the one-off price really shown before I request service?",
    a: "Yes for the standard scopes listed here. If the job needs excluded hardware, destructive entry, specialty locks, door repair, or another out-of-scope item, the additional price must be shown and approved before that work begins.",
  },
  {
    q: "Who performs the service work?",
    a: "Independent local providers perform the field service. Keepwell operates the platform, request flow, property records, pricing rules, and marketplace workflow.",
  },
  {
    q: "Are providers always available?",
    a: "No. Availability depends on participating providers, service type, location, and time. Keepwell only shows provider identity or arrival timing after a real provider accepts.",
  },
];

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Transparent pricing"
          title="Know the one-off price. Then decide whether membership is worth it."
          body="No membership is required. Keepwell's fixed service menu is the baseline; membership should earn its place by making repeat ownership needs easier and reducing eligible event costs."
        />

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">One-off service menu</div>
                <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                  Fixed standard prices, visible before the request
                </h2>
                <p className="mt-4 text-sm leading-6 text-parchment-dim">
                  These are Keepwell's pilot customer prices for the standard scope shown. No bait-price service-call fee is added later.
                </p>
              </div>
              <Link
                href="/book"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink"
              >
                Request one-off service
              </Link>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-surface">
              <div className="hidden grid-cols-[1.25fr_.9fr_.6fr_1.6fr] gap-4 border-b border-line bg-surface-raised px-6 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-parchment-dim md:grid">
                <div>Service</div><div>When</div><div>Price</div><div>Standard scope</div>
              </div>
              <div className="divide-y divide-line">
                {SERVICE_MENU.map((item) => (
                  <div key={item.id} className="grid gap-3 px-5 py-5 md:grid-cols-[1.25fr_.9fr_.6fr_1.6fr] md:items-start md:gap-4 md:px-6">
                    <div>
                      <div className="font-medium text-parchment">{item.title}</div>
                      <div className="mt-1 text-xs leading-5 text-verdigris">{item.memberNote}</div>
                    </div>
                    <div className="text-sm text-parchment-dim">{item.timing}</div>
                    <div className="font-mono text-xl text-brass">{formatServicePrice(item.customerPriceCents)}</div>
                    <div className="text-xs leading-5 text-parchment-dim">{item.scope}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-brass/20 bg-brass/[0.05] p-5 text-xs leading-5 text-parchment-dim">
              <strong className="text-parchment">Price rule:</strong> if the provider discovers work outside the listed standard scope, the additional amount must be shown in Keepwell and accepted by the customer before that additional work starts.
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/15 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">Membership</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Now compare the repeat-owner option
              </h2>
              <p className="mt-4 text-sm leading-6 text-parchment-dim">
                Membership is optional. The comparison only works if the one-off alternative is visible first.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const { features, addOns, tagline } = planDisplay(plan);
                const highlighted = plan.id === "household";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${
                      highlighted
                        ? "border-brass/70 bg-surface-raised shadow-[0_18px_60px_-32px_rgba(212,173,88,.65)]"
                        : "border-line bg-surface"
                    }`}
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
                      className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                        highlighted
                          ? "bg-brass text-ink hover:brightness-110"
                          : "border border-line text-parchment hover:border-parchment-dim"
                      }`}
                    >
                      Continue with {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface/60 p-6 text-sm leading-6 text-parchment-dim">
              <strong className="text-parchment">Unit-economics warning:</strong> the current low annual membership prices include multiple covered events. Before accepting paid memberships at scale, Keepwell should validate actual provider payouts and expected event utilization against each tier.
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-display text-3xl font-medium text-parchment">Pricing questions</h2>
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
          title="Need one service? Use Keepwell once."
          body="Membership is optional. Start with the fixed one-off price and join later only if the ongoing benefits make sense."
          ctaLabel="Request one-off service"
          ctaHref="/book"
          secondaryLabel="How it works"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
