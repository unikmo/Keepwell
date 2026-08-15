import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Digital Access",
  description: "Keep access codes, spare-key details, trusted key holders, photos and recovery instructions ready before a lockout becomes a service call.",
  alternates: { canonical: "/digital-access" },
};

const ITEMS = [
  ["Access codes", "Keep keypad, lockbox, smart-lock recovery and garage-access details attached to the right property."],
  ["Spare-key details", "Record where a spare exists and who physically holds it, so you know your backup options before calling anyone."],
  ["Reference photos", "Save a private reference photo when seeing the location or device is more useful than another note."],
  ["Trusted people", "Keep the neighbor, family member or friend who can help with a spare key or authorize access easy to find."],
];

export default function DigitalAccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Digital Access"
          title="Your backup plan for getting into your property."
          body="Keep access codes, spare-key details, trusted key holders and recovery instructions in one place, ready before you need them."
        />

        <section className="border-b border-[#c7d9ec] bg-mist py-16 text-navy-text sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[#c7d9ec] bg-white p-6 shadow-[0_16px_38px_rgba(28,65,105,0.08)]">
                  <h2 className="font-display text-xl text-navy-text">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#536e8a]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="eyebrow">When access goes wrong</div>
              <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">Check the access you already have before paying for a visit.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-parchment-dim">Digital Access puts your own backup options first. If none works, Keepwell can take you into the fixed-price provider request flow.</p>
            </div>
            <div className="space-y-3">
              {[
                ["01", "Check your saved access", "Review codes, recovery instructions and access notes."],
                ["02", "Reach a trusted key holder", "Contact the person you recorded as holding a spare."],
                ["03", "Use physical backup access", "Follow your saved lockbox or spare-key instructions."],
                ["04", "Still need help?", "Request an independent provider through Keepwell at the published standard price."],
              ].map(([n, title, body]) => (
                <div key={n} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl border border-sky/15 bg-surface/65 p-4">
                  <div className="font-mono text-xs text-brass">{n}</div>
                  <div>
                    <div className="font-medium text-parchment">{title}</div>
                    <p className="mt-1 text-xs leading-5 text-parchment-dim">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="rounded-3xl border border-sky/20 bg-surface/55 p-8 sm:p-10">
              <div className="eyebrow">Privacy by role</div>
              <h2 className="mt-3 font-display text-3xl text-parchment">A trusted person does not automatically see your saved codes.</h2>
              <p className="mt-4 text-sm leading-6 text-parchment-dim">Someone can be recorded as holding a spare key without being given access to sensitive Digital Access details. Sensitive text is stored as server-encrypted ciphertext and reference photos use private storage with time-limited signed access.</p>
              <Link href="/privacy" className="mt-5 inline-flex text-sm font-semibold text-brass hover:underline">Read the privacy approach →</Link>
            </div>
          </div>
        </section>

        <CTABand
          title="Set up access before you need it"
          body="Digital Access is included with Keepwell membership. One-off service remains available without membership."
          ctaLabel="Compare membership"
          ctaHref="/pricing"
          secondaryLabel="Request one-off service"
          secondaryHref="/book"
        />
      </main>
      <Footer />
    </div>
  );
}
