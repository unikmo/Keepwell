import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Trusted Locksmith for Landlords",
  description: "Coordinate rental-property lockouts, rekeys, trusted access and locksmith service history through one focused platform.",
  alternates: { canonical: "/landlords" },
};

const BENEFITS = [
  { title: "Turnover rekeys", body: "Create a repeatable rekey workflow when a tenant moves out instead of sourcing a locksmith from scratch each time." },
  { title: "Access records", body: "Keep lock, code and access notes associated with the property rather than scattered across messages and spreadsheets." },
  { title: "Resident requests", body: "Give access-related service requests a defined route instead of turning every lockout into an ad-hoc landlord call." },
  { title: "Service history", body: "Retain a simple record of what was requested and changed at each property." },
];

export default function LandlordsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Trusted Locksmith for landlords"
          title="Access work should not restart from zero at every turnover"
          body="Give rental properties a consistent workflow for rekeys, lockouts, trusted access and the locksmith service record behind them."
        />
        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h2 className="font-display text-xl text-parchment">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-brass/25 bg-brass/[0.06] p-8">
              <div className="eyebrow">Focused on locksmith access work</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">Trusted Locksmith stays deliberately narrow</h2>
              <p className="mt-4 leading-7 text-parchment-dim">This is not a lease, rent-collection or maintenance-suite product. The platform stays focused on lockouts, rekeys, access records, trusted contacts and locksmith service history.</p>
            </div>
          </div>
        </section>
        <CTABand
          title="Start with one rental property"
          body="Use the same locksmith workflow now, then expand across properties when the operating pattern is proven."
          ctaLabel="Find a locksmith"
          ctaHref="/book"
          secondaryLabel="Property manager solution"
          secondaryHref="/for-property-managers"
        />
      </main>
      <Footer />
    </div>
  );
}
