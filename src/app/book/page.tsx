import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";

export const metadata: Metadata = {
  title: "Request property access service",
  description: "Start a Keepwell request for a lockout, rekey or lock change. Independent local providers perform the field service.",
  alternates: { canonical: "/book" },
};

const JOB_TYPES = [
  { id: "lockout", label: "I'm locked out", body: "Start a home-access request." },
  { id: "rekey", label: "Rekey my locks", body: "Change who can use the existing locks." },
  { id: "lock_upgrade", label: "Change or upgrade a lock", body: "Request replacement or upgraded hardware." },
];

export default function BookPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-brass/30 bg-brass/10"><Keyhole className="h-4 w-3 text-brass" /></span>
            Keepwell
          </Link>
          <div className="mt-7 eyebrow">Service request</div>
          <h1 className="mt-2 font-display text-4xl font-medium text-parchment">What does the property need?</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-parchment-dim">Choose the closest service type. Keepwell creates the request; an independent local provider must accept before a provider or ETA is confirmed.</p>
        </div>

        <div className="mt-8 space-y-3">
          {JOB_TYPES.map((job) => (
            <Link key={job.id} href={`/book/details?job_type=${job.id}`} className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-brass/45">
              <span>
                <span className="block font-medium text-parchment">{job.label}</span>
                <span className="mt-1 block text-xs leading-5 text-parchment-dim">{job.body}</span>
              </span>
              <span className="text-brass transition group-hover:translate-x-0.5">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface/50 p-4 text-xs leading-5 text-parchment-dim">
          Keepwell is the platform. Services are performed by independent local providers, and availability varies by location and time.
        </div>

        <p className="mt-6 text-center text-xs text-parchment-dim">Already a member? <Link href="/login" className="text-brass hover:underline">Log in</Link> to use your member workflow.</p>
      </div>
    </div>
  );
}
