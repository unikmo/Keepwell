import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "How It Works — Digital Sentinel",
  description:
    "How Digital Sentinel membership works: join in three minutes, store keys and codes in your digital vault, and tap Get help for covered dispatch when you need it.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS = [
  {
    n: "01",
    title: "Join in 3 minutes",
    body: "Pick a plan, add your household, register a trusted contact or lockbox. No truck roll required to sign up.",
    detail:
      "Signup takes a name, email, and password — no site visit, no waiting period. Household+ members get their welcome visit scheduled right from the dashboard afterward.",
  },
  {
    n: "02",
    title: "Live your life",
    body: "Your keys and codes live in the vault. Nothing else to track or worry about until you actually need something.",
    detail:
      "The vault holds photos and notes for everyday keys, gate codes, and lockbox combinations — encrypted, and scoped deliberately to household use, not legal or estate documents.",
  },
  {
    n: "03",
    title: "One tap, if it happens",
    body: "Locked out? Open the app, tap Get help. A verified tech is on the way, phone in hand.",
    detail:
      "Before dispatching, we'll check whether a registered lockbox or trusted contact can solve it for free right now. If not, a background-checked tech is dispatched with a live ETA.",
  },
];

const WHATS_COVERED = [
  { title: "Home lockout", body: "Locked out of your own front door — a covered event on every plan." },
  { title: "Car lockout, at home", body: "Locked your keys in the car in your own driveway or garage." },
  { title: "Standard rekey", body: "Rekeying existing locks, drawn from the same yearly covered-event pool." },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="How it works"
          title="Three minutes to set up. There when you need it."
          body="A membership built around the things you hope you'll never deal with — and a few you'll actually use often."
        />

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-14">
              {STEPS.map((s) => (
                <div key={s.n} className="grid gap-2 sm:grid-cols-[80px_1fr]">
                  <div className="font-mono text-sm text-brass">{s.n}</div>
                  <div>
                    <h2 className="font-display text-xl font-medium text-parchment">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.body}</p>
                    <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line/70 bg-surface/30 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">What&rsquo;s a covered event</div>
              <h2 className="mt-3 font-display text-2xl font-medium text-parchment">
                Three everyday things, one pool per year
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {WHATS_COVERED.map((c) => (
                <div key={c.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-lg font-medium text-parchment">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{c.body}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-parchment-dim">
              Full lock replacement or smart-lock hardware upgrades are priced separately and always
              shown before anyone starts work — never a surprise invoice.
            </p>
          </div>
        </section>

        <CTABand
          title="See what your plan includes"
          body="Every tier covers the vault and trusted access — pricing scales with household size and guaranteed visits."
          ctaLabel="View pricing"
          ctaHref="/pricing"
          secondaryLabel="Book a one-off visit"
          secondaryHref="/book"
        />
      </main>
      <Footer />
    </div>
  );
}
