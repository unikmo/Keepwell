import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Property access services & fixed prices",
  description:
    "See fixed all-in Keepwell prices for home lockouts, rekeys, lock changes and smart-lock installation through independent local providers.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Services & prices"
          title="Start with a real price, not a $19 bait quote"
          body="Keepwell publishes one all-in standard customer price before the request. Provider travel/service call is included, and independent providers see their fixed payout before they accept."
        />

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_MENU.map((service) => (
                <div key={service.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-parchment-dim">{service.timing}</div>
                  <h2 className="mt-3 font-display text-2xl font-medium text-parchment">{service.title}</h2>
                  <div className="mt-3 font-mono text-3xl text-brass">{formatServicePrice(service.customerPriceCents)}</div>
                  <div className="mt-1 text-[11px] text-verdigris">All-in · travel/service call included</div>
                  <p className="mt-4 text-xs leading-5 text-parchment-dim">{service.scope}</p>
                  <p className="mt-4 border-t border-line/70 pt-4 text-xs leading-5 text-verdigris">{service.memberNote}</p>
                  <div className="flex-1" />
                  <Link
                    href={`/book/details?service_id=${service.id}`}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment hover:border-brass/50"
                  >
                    Request this service
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-surface/50 p-6 text-sm leading-6 text-parchment-dim">
              <strong className="text-parchment">Keepwell's role:</strong> Keepwell operates the platform, publishes the standard scope and routes requests. Field work is performed by independent local providers. Provider identity and timing appear only after a provider actually accepts.
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">Optional membership</div>
            <h2 className="mt-3 font-display text-3xl font-medium text-parchment">
              Compare membership against prices you can actually see
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-parchment-dim">
              You never need a membership to request service. Membership is the repeat-owner layer: Digital Sentinel, trusted contacts and trusted-access benefits.
            </p>
            <Link href="/pricing" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">
              Compare one-off & membership
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
