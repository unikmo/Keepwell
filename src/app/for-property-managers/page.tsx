import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Property Access & Rekey Workflow for Property Managers",
  description: "Standardize resident lockouts, turnover rekeys, access records and provider coordination across properties with Keepwell.",
  alternates: { canonical: "/for-property-managers" },
};

const PROBLEMS = [
  { title: "Fewer after-hours access calls", body: "Give resident lockouts and access requests a defined route instead of turning every issue into an on-call staffing problem." },
  { title: "Repeatable turnover rekeys", body: "Use one property-level workflow for rekey requests between move-out and move-in instead of starting from scratch each time." },
  { title: "One access record", body: "Keep keys, lockboxes, service notes and completed work attached to the property rather than scattered across texts and vendor records." },
];

const WORKFLOWS = [
  { title: "Resident requests", body: "Capture the property, access issue and service need through a consistent intake flow." },
  { title: "Turnover rekeys", body: "Request the same clearly scoped rekey service across units with transparent standard pricing." },
  { title: "Provider coordination", body: "Route work through participating independent providers instead of rebuilding the vendor search for every job." },
  { title: "Portfolio history", body: "Keep the access-service record at property and unit level so future requests start with context." },
];

export default function PropertyManagersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For property managers"
          title="Fewer lockout calls. Cleaner turnover rekeys. One access workflow."
          body="Keepwell gives property teams a consistent way to handle resident access requests, rekeys, provider coordination and property-level service history."
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
              <div className="eyebrow">One repeatable workflow</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">From resident request to completed property record.</h2>
              <p className="mt-4 leading-7 text-parchment-dim">Your team keeps one intake and approval path while independent providers perform the field work. Request status and completed service stay attached to the property account.</p>
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
              <div className="eyebrow">Start narrow</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">Begin with the access jobs that create the most friction.</h2>
              <p className="mt-4 leading-7 text-parchment-dim">Set up a small property group, route repeat lockouts and turnover rekeys through Keepwell, then expand once the workflow is working for your team and provider network.</p>
            </div>
          </div>
        </section>

        <CTABand
          title="Standardize access work across your properties"
          body="Create a property-manager workspace and start with a focused property set."
          ctaLabel="Start property-manager setup"
          ctaHref="/property-manager"
          secondaryLabel="See service pricing"
          secondaryHref="/services"
        />
      </main>
      <Footer />
    </div>
  );
}
