import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "How Trusted Locksmith Works | Lockout, Rekey & Access",
  description: "See how Trusted Locksmith moves from saved access options to upfront locksmith pricing and a real independent local provider match.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  { n: "01", title: "Check your backup access", body: "If you use Digital Access, start with saved codes, spare-key details or trusted people who may already be able to solve the problem." },
  { n: "02", title: "Choose the locksmith service", body: "If you still need on-site help, choose a lockout, rekey, lock change or other available service and see the standard total before you continue." },
  { n: "03", title: "Find a local provider", body: "Trusted Locksmith routes the request through participating independent providers. A provider name and ETA appear only after a real provider accepts." },
  { n: "04", title: "Keep the service record", body: "The request and outcome stay attached to the property account so the next access issue starts with more context." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="How Trusted Locksmith works"
          title="Upfront pricing. A vetted local network. Backup access when you want it."
          body="Trusted Locksmith gives you a simpler path from an access problem to a clearly priced local locksmith, with Digital Access available to help prevent some service calls altogether."
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
              <div className="eyebrow">Trusted Locksmith handles</div>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-parchment-dim">
                <li>Digital Access and trusted-access records.</li>
                <li>Published standard service pricing and scope.</li>
                <li>Request routing and provider acceptance status.</li>
                <li>Property-level service history.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-7">
              <div className="eyebrow">Independent providers handle</div>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-parchment-dim">
                <li>Accepting or declining offered service requests.</li>
                <li>Performing the field work using their trade judgment.</li>
                <li>Confirming any additional scope before extra work begins.</li>
                <li>Their own credentials, insurance and workmanship obligations.</li>
              </ul>
            </div>
          </div>
        </section>
        <CTABand
          title="Find a trusted locksmith near you"
          body="Choose the service, see the standard total and continue only if the price and scope work for you."
          ctaLabel="Find a locksmith"
          ctaHref="/book"
          secondaryLabel="Explore Digital Access"
          secondaryHref="/digital-access"
        />
      </main>
      <Footer />
    </div>
  );
}
