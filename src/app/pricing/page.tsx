import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";
import { getPlans, planDisplay, formatUsd } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing — Digital Sentinel Home Membership",
  description:
    "Digital Sentinel membership pricing: Individual from $29/yr, Household $49/yr, and Household + Smart Security $89/yr with a guaranteed welcome visit. No contracts, no surprise invoices.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  {
    q: "What counts as a covered event?",
    a: "A home lockout, a car locked out at your home address, or a standard rekey — all pulled from the same yearly pool. Full lock or smart-lock replacement is priced separately, always shown before anyone starts work.",
  },
  {
    q: "Does the price go up after year one?",
    a: "Household + Smart Security renews at a flat $89/year, every year — we don't build in a reduced first-year price that jumps later. What you see is what you pay at renewal, too.",
  },
  {
    q: "What's the lockbox add-on on the Individual plan?",
    a: "Lockbox code registration is a one-time $19.99 add-on, not included by default on Individual. Household and Household + Smart Security include lockbox coverage as part of the plan.",
  },
  {
    q: "Is the welcome visit really guaranteed?",
    a: "Yes — only on Household + Smart Security. It's a one-time visit combining a full security audit, lockbox mount, and smart lock install, plus a re-audit every 3 years after that.",
  },
];

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Pricing"
          title="Less than a streaming subscription"
          body="Every plan covers the whole approach — vault, trusted access, and dispatch. Higher tiers widen who and what's covered."
        />

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const { features, addOns, tagline } = planDisplay(plan);
                const highlighted = plan.id === "household";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-8 ${
                      highlighted
                        ? "border-brass bg-surface-raised shadow-[0_0_0_1px_rgba(201,162,75,0.4)]"
                        : "border-line bg-surface"
                    }`}
                  >
                    {highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brass px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">
                        Most members choose this
                      </div>
                    )}
                    <div className="font-mono text-xs uppercase tracking-wide text-parchment-dim">
                      {plan.name}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-medium text-parchment">
                        {formatUsd(plan.price_cents)}
                      </span>
                      <span className="text-sm text-parchment-dim">/year</span>
                    </div>
                    <p className="mt-2 text-sm text-parchment-dim">{tagline}</p>
                    {plan.renewal_price_cents === plan.price_cents && plan.id === "household_plus" && (
                      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wide text-verdigris">
                        Renews at {formatUsd(plan.renewal_price_cents)}/yr — flat, forever
                      </p>
                    )}

                    <ul className="mt-6 space-y-3 text-sm">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-parchment">
                          <span className="mt-0.5 text-verdigris">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {addOns && (
                      <ul className="mt-3 space-y-2 border-t border-line/70 pt-3 text-sm">
                        {addOns.map((a) => (
                          <li key={a.label} className="flex items-start justify-between gap-2 text-parchment-dim">
                            <span className="flex items-start gap-2">
                              <span className="mt-0.5 text-brass">+</span>
                              {a.label}
                            </span>
                            <span className="font-mono text-xs text-brass whitespace-nowrap">{a.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex-1" />

                    <Link
                      href={`/signup?plan=${plan.id}`}
                      className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                        highlighted
                          ? "bg-brass text-ink hover:bg-[#dab668]"
                          : "border border-line text-parchment hover:border-parchment-dim"
                      }`}
                    >
                      Choose {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-brass/20 bg-brass/[0.06] p-5 text-center text-sm leading-relaxed text-parchment-dim">
              Not ready for a membership?{" "}
              <Link href="/book" className="text-brass hover:underline">
                Book a one-off visit
              </Link>{" "}
              instead — fixed $89, no account required.
            </div>
          </div>
        </section>

        <section className="border-t border-line/70 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-display text-2xl font-medium text-parchment">
              Pricing questions
            </h2>
            <div className="mt-10 space-y-6">
              {FAQ.map((item) => (
                <div key={item.q} className="border-b border-line/70 pb-6">
                  <h3 className="font-medium text-parchment">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABand
          title="Set it up once. Forget about it, mostly."
          body="Join in under three minutes — no truck roll, no waiting period to add your vault and trusted contacts."
          ctaLabel="Get covered"
          ctaHref="/signup"
          secondaryLabel="How it works"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
