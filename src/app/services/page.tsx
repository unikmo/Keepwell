import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Property access services",
  description: "Request lockout help, rekeys, lock changes and related property-access services through Keepwell's independent local provider network.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    title: "Home lockout",
    body: "Start a service request when you cannot get into your home or property. Keepwell records the request and routes it through the local provider network.",
  },
  {
    title: "Standard rekey",
    body: "Change who can use existing locks after a move, turnover, lost key or access change without replacing all hardware by default.",
  },
  {
    title: "Lock replacement or upgrade",
    body: "Request replacement or upgraded hardware. Scope and pricing should be confirmed before work begins.",
  },
  {
    title: "Car lockout at the property",
    body: "Where supported, request help for a vehicle lockout occurring at the registered property address.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Services"
          title="Start with the property need, not a phone-tree search"
          body="Keepwell gives owners one place to request common access work, understand the scope and keep the outcome attached to the property."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {SERVICES.map((service) => (
                <div key={service.title} className="rounded-2xl border border-line bg-surface p-7">
                  <div className="h-1.5 w-10 rounded-full bg-brass" />
                  <h2 className="mt-5 font-display text-2xl font-medium text-parchment">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-parchment-dim">{service.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-line bg-surface/50 p-6 text-sm leading-6 text-parchment-dim">
              <strong className="text-parchment">Important:</strong> Keepwell operates the platform. Services are performed by independent local providers, and availability varies by service area. Provider identity and timing should only be shown after a real provider accepts a request.
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">For repeat ownership needs</div>
            <h2 className="mt-3 font-display text-3xl font-medium text-parchment">The service request is the beginning of the property record</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-parchment-dim">Membership can add trusted contacts, access records and plan benefits so the next request starts with context instead of starting over.</p>
            <Link href="/pricing" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment">See membership options</Link>
          </div>
        </section>

        <CTABand
          title="Need property-access help now?"
          body="Start with the service type and property address. Keepwell will create the request without pretending a provider has already been assigned."
          ctaLabel="Request service"
          ctaHref="/book"
          secondaryLabel="How Keepwell works"
          secondaryHref="/how-it-works"
        />
      </main>
      <Footer />
    </div>
  );
}
