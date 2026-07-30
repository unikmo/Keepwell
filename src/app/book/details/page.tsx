import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";

export const metadata: Metadata = {
  title: "Book a Locksmith — Details | Digital Sentinel",
  robots: { index: false },
};

const JOB_LABELS: Record<string, string> = {
  lockout: "I'm locked out",
  rekey: "Rekey my locks",
  lock_upgrade: "Upgrade my lock",
};

export default async function BookDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ job_type?: string }>;
}) {
  const { job_type } = await searchParams;
  const jobType = job_type && JOB_LABELS[job_type] ? job_type : "lockout";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Where should we send a tech?</h1>
          <p className="mt-1 text-sm text-parchment-dim">{JOB_LABELS[jobType]}</p>
        </div>

        <form action="/book/review" className="mt-8 space-y-4">
          <input type="hidden" name="job_type" value={jobType} />
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              placeholder="123 Maple St, Austin, TX"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="(512) 555-0148"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-brass px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Continue to review
          </button>
        </form>
      </div>
    </div>
  );
}
