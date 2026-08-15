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
  description: "See Keepwell's fixed all-in property-access prices and compare optional memberships with Digital Access and Household+ audit benefits.",
  alternates: { canonical: "/pricing" },
};

const FAQ = [
  { q: "Do I need a membership to use Keepwell?", a: "No. One-off service is available without membership. Membership adds Digital Access, trusted-access tools and tier-specific benefits." },
  { q: "Does the price shown include the provider's trip?", a: "Yes. Every standard Keepwell price shown here includes provider travel/service call. We do not add a second generic drive or call-out fee at checkout." },
  { q: "Can a provider add charges after arriving?", a: "Only for work outside the stated standard scope, and only after the additional price is shown and you approve it before that work starts." },
  { q: "What is the 14-day waiting period?", a: "Digital Access is available immediately. Field-service membership benefits, including the Household+ Lock & Access Audit, become eligible 14 days after paid membership activation. One-off fixed-price service remains available at any time." },
  { q: "What does Household+ include?", a: "Household+ is $89/year and includes Digital Access, household/trusted-access tools, priority matching when supply is available, and one included Lock & Access Audit every three years." },
  { q: "Can the provider sell work during the audit?", a: "The audit provider submits a standardized report to Keepwell. Any follow-up work should be offered separately through the platform so scope and price are clear before approval." },
  { q: "Who performs field work?", a: "Independent local providers perform field service. Keepwell operates the platform, customer flow, pricing rules, access records and marketplace workflow." },
];

export default async function PricingPage() {
  const plans = await getPlans();
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Transparent pricing"
          title="One price. Travel included. No service-call surprise."
          body="Keepwell shows one fixed standard total before you request service. Provider travel/service call is already included in the displayed price."
        />

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">One-off service menu</div>
                <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">The number you see is the standard total.</h2>
                <p className="mt-4 text-sm leading-6 text-parchment-dim">All prices include provider travel/service call. Hardware and genuinely out-of-scope work are separate only when stated and require approval before work begins.</p>
              </div>
              <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_22px_rgba(214,173,87,0.14)]">Request one-off service</Link>
            </div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-sky/15 bg-surface shadow-[0_20px_55px_rgba(3,18,37,0.14)]">
              <div className="hidden grid-cols-[1.15fr_.8fr_.8fr_1.55fr] gap-4 border-b border-line bg-surface-raised px-6 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-parchment-dim md:grid">
                <div>Service</div><div>When</div><div>Total</div><div>Standard scope</div>
              </div>
              <div className="divide-y divide-line">
                {SERVICE_MENU.map((item) => (
                  <div key={item.id} className="grid gap-3 px-5 py-5 md:grid-cols-[1.15fr_.8fr_.8fr_1.55fr] md:items-start md:gap-4 md:px-6">
                    <div>
                      <div className="font-medium text-parchment">{item.title}</div>
                      <div className="mt-1 text-xs leading-5 text-verdigris">Travel/service call included</div>
                    </div>
                    <div className="text-sm text-parchment-dim">{item.timing}</div>
                    <div>
                      <div className="font-mono text-2xl text-brass">{formatServicePrice(item.customerPriceCents)}</div>
                      <div className="mt-1 text-[11px] leading-4 text-parchment-dim">all-in standard price</div>
                    </div>
                    <div className="text-xs leading-5 text-parchment-dim">{item.scope}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-brass/20 bg-brass/[0.05] p-5 text-xs leading-5 text-parchment-dim">
              <strong className="text-parchment">Price rule:</strong> no generic drive fee or service-call fee is added later. If the actual job falls outside the published standard scope, the extra work and price must be shown and approved before it begins.
            </div>
          </div>
        </section>

        <section className="border-b border-[#c7d9ec] bg-mist py-16 text-navy-text sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="font-mono text-xs uppercase tracking-[.14em] text-[#7d6330]">Optional membership</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-navy-text sm:text-4xl">Membership is useful before anything goes wrong.</h2>
              <p className="mt-4 text-sm leading-6 text-[#536e8a]">Digital Access keeps access codes, spare-key details, trusted people, photos and recovery instructions in one place so you can check your own backup options first.</p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const { features, addOns, tagline } = planDisplay(plan);
                const highlighted = plan.id === "household_plus";
                return (
                  <div key={plan.id} className={`relative flex flex-col rounded-3xl border p-7 sm:p-8 ${highlighted ? "border-[#b9964a] bg-white shadow-[0_18px_50px_rgba(28,65,105,0.12)]" : "border-[#c7d9ec] bg-white/85"}`}>
                    {highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brass px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">Audit included</div>}
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#536e8a]">{plan.name}</div>
                    <div className="mt-3 flex items-baseline gap-1.5"><span className="font-display text-5xl font-medium text-navy-text">{formatUsd(plan.price_cents)}</span><span className="text-sm text-[#536e8a]">/year</span></div>
                    <p className="mt-3 text-sm leading-6 text-[#536e8a]">{tagline}</p>
                    <ul className="mt-6 space-y-3 text-sm">{features.map((feature) => <li key={feature} className="flex items-start gap-2 text-navy-text"><span className="mt-0.5 text-[#3f8c7d]">✓</span><span>{feature}</span></li>)}</ul>
                    {addOns && <ul className="mt-4 space-y-2 border-t border-[#c7d9ec] pt-4 text-sm">{addOns.map((addOn) => <li key={addOn.label} className="flex items-start justify-between gap-3 text-[#536e8a]"><span>{addOn.label}</span><span className="whitespace-nowrap font-mono text-xs text-[#8c6d31]">{addOn.price}</span></li>)}</ul>}
                    <div className="flex-1" />
                    <Link href={`/signup?plan=${plan.id}`} className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${highlighted ? "bg-brass text-ink hover:brightness-105" : "border border-[#aebfd2] text-navy-text hover:border-[#7f9bb9]"}`}>Create account for {plan.name}</Link>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#c7d9ec] bg-white/70 p-6 text-sm leading-6 text-[#536e8a]">
              <strong className="text-navy-text">Activation rule:</strong> Digital Access is available with the account. Paid field-service membership benefits begin only after payment activation and the stated waiting period. Creating an account alone does not charge a card.
            </div>
          </div>
        </section>

        <section className="py-20"><div className="mx-auto max-w-3xl px-6"><h2 className="text-center font-display text-3xl font-medium text-parchment">Pricing questions</h2><div className="mt-10 space-y-6">{FAQ.map((item) => <div key={item.q} className="border-b border-line/70 pb-6"><h3 className="font-medium text-parchment">{item.q}</h3><p className="mt-2 text-sm leading-6 text-parchment-dim">{item.a}</p></div>)}</div></div></section>

        <CTABand title="Need one service? Use Keepwell once." body="Membership is optional. Start with the fixed all-in price and join later if Digital Access and the membership benefits make sense." ctaLabel="Request one-off service" ctaHref="/book" secondaryLabel="How it works" secondaryHref="/how-it-works" />
      </main>
      <Footer />
    </div>
  );
}
