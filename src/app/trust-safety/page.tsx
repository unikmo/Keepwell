import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Trust & Safety — Digital Sentinel",
  description:
    "How Digital Sentinel vets techs, verifies identity before dispatch, protects your vault, and guarantees pricing before any work starts.",
  alternates: { canonical: "/trust-safety" },
};

const PILLARS = [
  {
    icon: "🛂",
    title: "Every tech is background-checked",
    body: "No one gets into the dispatch network without passing a background check and verifying trade credentials where required. It's a condition of joining, not an optional badge.",
  },
  {
    icon: "🪪",
    title: "Verified ID before dispatch, every time",
    body: "When a tech is on the way, you see their name, photo, job count, and rating in the app before they arrive — the same identity verification shown on every dispatch screen, no exceptions.",
  },
  {
    icon: "💲",
    title: "Price certainty over discounts",
    body: "Covered visits cost $0. Any suggested upgrade — a rekey, a lock swap, a smart lock install — shows a fixed price before the tech touches anything. No on-site negotiation, no surprise invoice.",
  },
  {
    icon: "🔒",
    title: "Your vault is encrypted, and scoped on purpose",
    body: "Keys, codes, and photos you save are encrypted on your device. The vault is deliberately limited to everyday household access — it's never used for legal or estate documentation, and we won't expand it into that.",
  },
];

const DATA_POINTS = [
  {
    q: "Who can see what's in my digital vault?",
    a: "You, and anyone you explicitly grant access to through trusted contacts. Dispatch techs never see your vault — if they need a code to get you back in, that's handled separately at the door, not through vault access.",
  },
  {
    q: "What happens if a tech doesn't show up or something goes wrong on a visit?",
    a: "Report it through the app or contact support directly — every dispatch is tied to a specific tech and job record, so we can investigate and act on it, including removing a tech from the network if warranted.",
  },
  {
    q: "Is membership the same as insurance?",
    a: "No. Digital Sentinel is a membership that covers a defined set of events (see the Member Agreement for specifics) — it isn't an insurance policy and shouldn't be treated as a substitute for homeowners or renters insurance.",
  },
  {
    q: "How is my payment and account data handled?",
    a: "Payment processing is handled by a PCI-compliant third-party processor — we don't store full card numbers ourselves. See the Privacy Policy for the full breakdown of what we collect and how it's used.",
  },
];

export default function TrustSafetyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Trust & safety"
          title="Calm authority, not just a promise"
          body="The systems behind every dispatch: who's allowed to show up at your door, what they can see, and what you're guaranteed before any work starts."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div key={p.title} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="text-2xl">{p.icon}</div>
                  <h2 className="mt-4 font-display text-lg font-medium text-parchment">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <div className="eyebrow">Common questions</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Trust & safety FAQ
              </h2>
            </div>
            <div className="mt-12 space-y-6">
              {DATA_POINTS.map((d) => (
                <div key={d.q} className="border-b border-line/70 pb-6">
                  <h3 className="font-medium text-parchment">{d.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{d.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABand
          title="Have a trust or safety concern?"
          body="Report an incident, ask about our vetting process, or flag anything that doesn't sit right — we take this seriously and read every message."
          ctaLabel="Contact us"
          ctaHref="/contact?topic=Trust%20%26%20safety"
        />
      </main>
      <Footer />
    </div>
  );
}
