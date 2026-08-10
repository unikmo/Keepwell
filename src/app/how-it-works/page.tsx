import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "How Keepwell works",
  description: "See how Keepwell turns a property-access problem into a structured service request and keeps the outcome attached to the property.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  { n: "01", title: "Choose the property and need", body: "Start a lockout, rekey or related access request. Keepwell captures the service scope and the property details needed to route it." },
  { n: "02", title: "Check trusted access first", body: "If a registered contact or access method can solve the problem, use that path before escalating to a provider visit." },
  { n: "03", title: "Match through the provider network", body: "When service is needed, Keepwell routes the request to participating independent providers. A provider and ETA are only shown after a real match occurs." },
  { n: "04", title: "Keep the property record", body: "The request and outcome remain part of the property's access history, so the next event starts with context." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="How it works"
          title="A clean workflow between the property owner and the provider"
          body="Keepwell coordinates the request and property context. Independent local providers perform the field service."
        />
        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {STEPS.map((step) => (
                <div key={step.n} className="rounded-2xl border border-line bg-surface p-7">
                  <div className="font-mono text-xs text-brass">{step.n}</div>
                  <h2 className="mt-3 font-display text-2xl text-parchment">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-parchment-dim">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
            <div className="rounded-2xl border border-verdigris/25 bg-verdigris/[0.05] p-7">
              <div className="eyebrow">Keepwell does</div>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-parchment-dim">
                <li>Structure the service request and property context.</li>
                <li>Route requests through the participating provider network.</li>
                <li>Store trusted-access and property service records.</li>
                <li>Support membership and marketplace rules.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-7">
              <div className="eyebrow">Independent providers do</div>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-parchment-dim">
                <li>Accept or decline service requests.</li>
                <li>Perform the field work using their own trade judgment.</li>
                <li>Confirm any additional scope before work proceeds.</li>
                <li>Remain responsible for their own credentials, insurance and workmanship.</li>
              </ul>
            </div>
          </div>
        </section>
        <CTABand
          title="Start with the need you have today"
          body="Request service once, or set up membership so access information and plan benefits are ready before the next event."
          ctaLabel="Request service"
          ctaHref="/book"
          secondaryLabel="View membership"
          secondaryHref="/pricing"
        />
      </main>
      <Footer />
    </div>
  );
}
