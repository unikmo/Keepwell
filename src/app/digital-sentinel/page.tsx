import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Digital Sentinel — Keepwell",
  description: "Keep key locations, access instructions, codes, photos and trusted key holders ready before a lockout becomes a service call.",
  alternates: { canonical: "/digital-sentinel" },
};

const ITEMS = [
  ["Access details", "Keep keypad, lockbox, smart-lock recovery and garage-access details in one private property-access record."],
  ["Key locations", "Record where a spare exists and who physically holds it — without giving that person automatic access to your saved secrets."],
  ["Reference photos", "Attach a private reference photo when a visual reminder is more useful than another note."],
  ["Trusted people", "Mark a neighbor, family member or friend as a spare-key holder, emergency contact or person who can authorize access."],
];

export default function DigitalSentinelPage() {
  return <div className="flex min-h-screen flex-col"><Nav /><main className="flex-1">
    <PageHero eyebrow="Digital Sentinel" title="The cheapest lockout is the one you solve without a locksmith." body="Digital Sentinel is the subscriber access box inside Keepwell: saved access details, key locations, reference photos and the people who can help locally — ready before you need them." />

    <section className="border-b border-line/70 py-18"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{ITEMS.map(([title,body])=><div key={title} className="rounded-2xl border border-line bg-surface p-6"><h2 className="font-display text-xl text-parchment">{title}</h2><p className="mt-2 text-sm leading-6 text-parchment-dim">{body}</p></div>)}</div></div></section>

    <section className="border-b border-line/70 bg-surface/20 py-20"><div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><div className="eyebrow">Lockout flow</div><h2 className="mt-3 font-display text-3xl text-parchment">Check your own access network before paying for a visit.</h2><p className="mt-4 text-sm leading-6 text-parchment-dim">Keepwell puts the zero-cost paths first. If none works, the same account takes you to the fixed-price provider marketplace.</p></div><div className="space-y-3">{[["01","Check Digital Sentinel","Review saved access instructions or recovery details."],["02","Reach a key holder","Call the neighbor, friend or family member recorded as holding a spare."],["03","Use physical backup access","Follow your saved lockbox or spare-key instructions."],["04","Still locked out?","Request an independent provider at Keepwell's published all-in price."]].map(([n,t,b])=><div key={n} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl border border-line bg-surface p-4"><div className="font-mono text-xs text-brass">{n}</div><div><div className="font-medium text-parchment">{t}</div><p className="mt-1 text-xs leading-5 text-parchment-dim">{b}</p></div></div>)}</div></div></section>

    <section className="py-20"><div className="mx-auto max-w-4xl px-6"><div className="rounded-3xl border border-brass/25 bg-brass/[0.06] p-8"><div className="eyebrow">Privacy model</div><h2 className="mt-3 font-display text-3xl text-parchment">A trusted contact is not a vault user.</h2><p className="mt-4 text-sm leading-6 text-parchment-dim">A person can be recorded as holding a spare key without receiving your Digital Sentinel secrets. Sensitive text is stored as server-encrypted ciphertext; reference photos use private storage with time-limited signed access. Keepwell does not describe the design as zero-knowledge or end-to-end encryption.</p><Link href="/privacy" className="mt-5 inline-flex text-sm text-brass">Read the privacy approach →</Link></div></div></section>

    <CTABand title="Set up access before the emergency" body="Digital Sentinel is included with Keepwell membership and activates immediately. Field-service membership benefits have a separate waiting period." ctaLabel="Compare membership" ctaHref="/pricing" secondaryLabel="Request one-off service" secondaryHref="/book" />
  </main><Footer /></div>;
}
