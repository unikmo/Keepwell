import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

const metaDescription = "See upfront standard prices for home lockouts, rekeys, lock changes and smart-lock installation before you find an independent local locksmith through Trusted Locksmith.";

export const metadata: Metadata = {
  title: "Locksmith Prices | Home Lockout, Rekey & Lock Change",
  description: metaDescription,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Trusted Locksmith prices | No call-out surprise",
    description: metaDescription,
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trusted Locksmith prices | No call-out surprise",
    description: metaDescription,
  },
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Locksmith services & prices"
          title="Clear prices for common locksmith services."
          body="See the standard total and service scope before you find a local provider. Provider travel/service call is included in every standard price shown."
        />

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_MENU.map((service) => (
                <div key={service.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.13em] text-parchment-dim">{service.timing}</div>
                  <h2 className="mt-3 font-display text-2xl font-medium text-parchment">{service.title}</h2>
                  <div className="mt-3 font-mono text-3xl text-brass">{formatServicePrice(service.customerPriceCents)}</div>
                  <div className="mt-1 text-[11px] text-verdigris">Standard total · travel included</div>
                  <p className="mt-4 text-xs leading-5 text-parchment-dim">{service.scope}</p>
                  <p className="mt-4 border-t border-line/70 pt-4 text-xs leading-5 text-verdigris">{service.memberNote}</p>
                  <div className="flex-1" />
                  <Link
                    href={`/book/details?service_id=${service.id}`}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment hover:border-brass/50"
                  >
                    Find this service
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-surface/50 p-6 text-sm leading-6 text-parchment-dim">
              <strong className="text-parchment">What happens next:</strong> Trusted Locksmith routes your request through participating independent local providers. A provider name and ETA appear only after a real provider accepts. If the job needs work outside the published standard scope, you see and approve the additional price before that work begins.
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">Digital Access</div>
            <h2 className="mt-3 font-display text-3xl font-medium text-parchment">
              Make the next access problem easier before it happens.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-parchment-dim">
              Membership adds Digital Access for codes, spare-key details and trusted people. One-off locksmith service remains available without membership.
            </p>
            <Link href="/pricing" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">
              Compare membership
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
