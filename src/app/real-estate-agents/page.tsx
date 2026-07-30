import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Digital Sentinel for Real Estate Agents — A Closing Gift Clients Actually Use",
  description:
    "Gift new homeowners a membership that covers their first lockout, rekey, and home security audit — a closing gift that keeps your name in their pocket long after the sale. Referral partnerships available.",
  alternates: { canonical: "/real-estate-agents" },
};

const REASONS = [
  {
    icon: "🎁",
    title: "A closing gift people actually use",
    body: "Branded tumblers get donated. A membership that gets your new homeowner out of a 3rd-day lockout gets remembered — and it's your name on the confirmation email.",
  },
  {
    icon: "🔐",
    title: "Solves a real new-homeowner problem",
    body: "New keys, new codes, an unfamiliar lock — the first few weeks in a new house are exactly when lockouts and \"who has a copy of this key\" happen most.",
  },
  {
    icon: "🏠",
    title: "A natural add-on to a rekey conversation",
    body: "You're probably already telling clients to rekey after closing. Digital Sentinel's Household + Smart Security tier bundles the audit and the rekey into one guaranteed visit.",
  },
  {
    icon: "🤝",
    title: "Referral partnerships available",
    body: "Send clients our way directly and we'll set up a referral arrangement — details vary by market, and we'll work them out with you directly.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Pick a plan to gift or discount",
    body: "Most agents gift the first year of Individual or Household, or offer clients a discount code to sign up themselves at closing.",
  },
  {
    n: "02",
    title: "We handle onboarding",
    body: "Your client gets an email, sets up their vault and trusted contacts, and their coverage is active — nothing for you to manage after handoff.",
  },
  {
    n: "03",
    title: "You stay the agent who thought of it",
    body: "Every dispatch, every vault entry — it's a small, recurring reminder of who made the move-in easier.",
  },
];

const FAQS = [
  {
    q: "How much does gifting a membership cost me?",
    a: "It depends on volume and which tier you gift — we'll put together simple per-closing pricing once we know roughly how many closings a year you're working with.",
  },
  {
    q: "Can I just refer clients instead of paying for gifts?",
    a: "Yes. Referral-only partnerships are available too — you send clients a link or code, they pay for their own membership, and we handle a referral arrangement with you separately.",
  },
  {
    q: "Does the client need to do anything complicated to redeem it?",
    a: "No — a gifted membership shows up as a normal signup with the first term already covered. They set a password and they're active.",
  },
  {
    q: "Can I offer this for rentals too, not just home sales?",
    a: "Some agents who also handle rentals use it the same way for new tenants. Bring it up when you contact us and we'll figure out what makes sense.",
  },
];

export default function RealEstateAgentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For real estate agents"
          title="A closing gift your clients actually use"
          body="Skip the branded mug. Gift new homeowners a membership that gets them out of their first lockout and helps them rekey the house they just bought."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">Why agents partner with us</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Closing gifts people forget. This one they use.
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((r) => (
                <div key={r.title} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="text-2xl">{r.icon}</div>
                  <h3 className="mt-4 font-display text-lg font-medium text-parchment">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/30 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">How it works</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Three steps, nothing to manage after closing
              </h2>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.n} className="text-center sm:text-left">
                  <div className="font-mono text-sm text-brass">{s.n}</div>
                  <h3 className="mt-3 font-display text-xl font-medium text-parchment">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <div className="eyebrow">Questions we get</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Agent partnership FAQ
              </h2>
            </div>
            <div className="mt-12 space-y-6">
              {FAQS.map((f) => (
                <div key={f.q} className="border-b border-line/70 pb-6">
                  <h3 className="font-medium text-parchment">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABand
          title="Let's set up your partnership"
          body="Tell us your market and roughly how many closings a year — we'll come back with gifting and referral options that fit."
          ctaLabel="Contact partnerships"
          ctaHref="/contact?topic=Partnership"
          secondaryLabel="See member pricing"
          secondaryHref="/#pricing"
        />
      </main>
      <Footer />
    </div>
  );
}
