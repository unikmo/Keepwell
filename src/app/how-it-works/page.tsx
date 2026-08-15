import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "How Keepwell Works | Lockout, Rekey & Property Access",
  description: "See how Keepwell moves from saved access options to a clearly priced service request and a real independent provider match.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  { n: "01", title: "Check your backup access", body: "If you use Digital Access, start with saved codes, spare-key details or trusted people who may already be able to solve the problem." },
  { n: "02", title: "Choose the service", body: "If you still need on-site help, choose a lockout, rekey, lock change or other available service and see the standard total before you continue." },
  { n: "03", title: "Submit the request", body: "Keepwell routes the request through participating independent providers. A provider name and ETA appear only after a real provider accepts." },
  { n: "04", title: "Keep the service record", body: "The request and outcome stay attached to the property account so the next access issue starts with more context." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="How Keepwell works"
          title="Backup access first. Clearly priced service when you still need help."
          body="Keepwell combines Digital Access with a simple service-request flow so a lockout or rekey does not start with searching, calling and guessing at the price."
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
              <div className="eyebrow">Keepwell handles</div>
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
          title="Start with the access problem you have today"
          body="Request one-off service now, or set up Digital Access so your backup options are ready next time."
          ctaLabel="Request service"
          ctaHref="/book"
          secondaryLabel="Explore Digital Access"
          secondaryHref="/digital-access"
        />
      </main>
      <Footer />
    </div>
  );
}
