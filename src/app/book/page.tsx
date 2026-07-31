import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";

export const metadata: Metadata = {
  title: "Book a Locksmith — No Membership Required | Digital Sentinel",
  description:
    "Locked out right now? Book a verified local locksmith in minutes — no membership, no account. Fixed $89 for lockouts and rekeys, guest discount already applied.",
  alternates: { canonical: "/book" },
};

const JOB_TYPES: { id: string; label: string; icon: string; body: string }[] = [
  { id: "lockout", label: "I'm locked out", icon: "🔒", body: "Home or car, right now. $89 flat." },
  { id: "rekey", label: "Rekey my locks", icon: "🔑", body: "Standard rekey, same visit. $89 flat." },
  { id: "lock_upgrade", label: "Upgrade my lock", icon: "🛡️", body: "Smart lock or hardware upgrade, priced on-site." },
];

export default function BookPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Book a tech — no account needed</h1>
          <p className="mt-2 text-sm text-parchment-dim">
            $89 flat for lockouts and rekeys, guest discount already applied. Same vetted techs our
            members use.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {JOB_TYPES.map((jt) => (
            <Link
              key={jt.id}
              href={`/book/details?job_type=${jt.id}`}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left text-sm text-parchment transition hover:border-brass/40"
            >
              <span className="text-xl">{jt.icon}</span>
              <span className="flex-1">
                <span className="block font-medium">{jt.label}</span>
                <span className="mt-0.5 block text-xs text-parchment-dim">{jt.body}</span>
              </span>
              <span className="text-brass">→</span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          Already a member?{" "}
          <Link href="/login" className="text-brass hover:underline">
            Log in
          </Link>{" "}
          — your covered events are free.
        </p>
        <p className="mt-2 text-center text-xs text-parchment-dim">
          Prefer not to pay per visit?{" "}
          <Link href="/pricing" className="text-brass hover:underline">
            See membership pricing
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
