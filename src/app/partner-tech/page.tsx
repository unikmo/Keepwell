import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Become a Partner Tech — Locksmith & Lockout Jobs, Digital Sentinel",
  description:
    "Join the Digital Sentinel tech network: pre-verified lockout, rekey, and smart-lock jobs sent straight to your phone, upfront pricing, no cold-calling for work.",
  alternates: { canonical: "/partner-tech" },
};

const REASONS = [
  {
    icon: "📱",
    title: "Jobs come to you",
    body: "Covered dispatch requests route straight to available techs near the job — no ad spend, no cold calls, no bidding against five other locksmiths for the same lead.",
  },
  {
    icon: "💵",
    title: "Fixed dispatch pay, transparent upgrade pricing",
    body: "Covered visits pay a flat dispatch rate. Any suggested upgrade — a rekey, a lock swap, a smart lock install — has a fixed member price shown before you touch anything, so there's no haggling on-site.",
  },
  {
    icon: "⭐",
    title: "Ratings that actually follow you",
    body: "Your job count and rating are visible to members before you even arrive, building a reputation that compounds instead of resetting with every new platform.",
  },
  {
    icon: "🗓️",
    title: "Work the hours you want",
    body: "Set your own availability windows. Covered dispatch fills the gaps in your schedule instead of competing with your existing customer base.",
  },
];

const REQUIREMENTS = [
  "Licensed locksmith or equivalent trade credential where required by your state",
  "Pass a background check before your first dispatch",
  "Carry liability insurance (we'll ask for proof during onboarding)",
  "Reliable transportation and phone for real-time dispatch",
];

const STEPS = [
  { n: "01", title: "Apply", body: "Tell us your service area, license status, and experience." },
  { n: "02", title: "Get verified", body: "Background check and credential verification — usually a few business days." },
  { n: "03", title: "Start getting dispatched", body: "Set your availability and covered jobs start routing to your phone." },
];

export default function PartnerTechPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Become a partner tech"
          title="Lockout and rekey jobs, without chasing leads"
          body="Join the verified tech network behind Digital Sentinel's covered dispatch — pre-qualified jobs, upfront pricing, and members who already trust the badge on your profile before you knock."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">Why techs partner with us</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Less time chasing work, more time doing it
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
              <div className="eyebrow">Getting started</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Three steps to your first dispatch
              </h2>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center sm:text-left">
                  <div className="font-mono text-sm text-brass">{s.n}</div>
                  <h3 className="mt-3 font-display text-xl font-medium text-parchment">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <div className="text-center">
              <div className="eyebrow">Requirements</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                What you'll need to apply
              </h2>
            </div>
            <ul className="mx-auto mt-10 max-w-md space-y-3 text-sm">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex items-start gap-2 text-parchment">
                  <span className="mt-0.5 text-verdigris">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CTABand
          title="Ready to apply?"
          body="Send us your service area and license details — we'll follow up with next steps on verification."
          ctaLabel="Apply to join"
          ctaHref="/contact?topic=Partnership"
        />
      </main>
      <Footer />
    </div>
  );
}
