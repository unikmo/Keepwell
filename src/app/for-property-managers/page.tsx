import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Keepwell for property managers",
  description: "Standardize resident lockouts, rekeys, access records and provider coordination across properties with Keepwell.",
  alternates: { canonical: "/for-property-managers" },
};

const PROBLEMS = [
  { title: "After-hours lockouts become staffing problems", body: "Residents call whoever is on duty, and access work becomes an unplanned maintenance workflow." },
  { title: "Rekeys repeat without a system", body: "Every turnover can trigger the same calls, scheduling and follow-up with little reusable property context." },
  { title: "Access data lives everywhere", body: "Keys, lockboxes, gate notes and service history end up split across desks, texts and vendor records." },
];

const WORKFLOWS = [
  { title: "Resident service requests", body: "Give lockout and access requests a defined intake path instead of routing everything through the on-call line." },
  { title: "Turnover rekeys", body: "Create a repeatable property-level request for rekey work between move-out and move-in." },
  { title: "Provider marketplace", body: "Route work to participating independent local providers with clear scope and platform records." },
  { title: "Portfolio history", body: "Retain the access-service record at the property level so future requests start with context." },
];

export default function PropertyManagersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For property managers"
          title="Take property-access work out of the ad-hoc maintenance queue"
          body="Keepwell creates one workflow for resident lockouts, rekeys, access records and independent-provider coordination across the portfolio."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {PROBLEMS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h2 className="font-display text-xl text-parchment">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <div className="eyebrow">The platform layer</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">Narrow enough to deploy. Useful enough to become infrastructure.</h2>
              <p className="mt-4 leading-7 text-parchment-dim">Keepwell is not trying to replace a property-management system. It owns the access workflow: request, provider coordination, trusted access and the property record.</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {WORKFLOWS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-xl text-parchment">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-brass/25 bg-brass/[0.06] p-8">
              <div className="eyebrow">Pilot structure</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">Start with one portfolio workflow, not an enterprise transformation</h2>
              <p className="mt-4 leading-7 text-parchment-dim">The strongest initial use case is repeat access work: resident lockouts and turnover rekeys. Prove request volume, provider response, completion quality and support load before expanding the product surface.</p>
            </div>
          </div>
        </section>

        <CTABand
          title="Put one access workflow on Keepwell"
          body="Tell us the market, property count and current lockout/rekey process. The platform can be evaluated around a narrow pilot first."
          ctaLabel="Discuss a portfolio pilot"
          ctaHref="/contact?topic=Partnership"
          secondaryLabel="See the owner experience"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
