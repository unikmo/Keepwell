import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { createGuestBooking } from "../actions";

export const metadata: Metadata = { title: "Review service request", robots: { index: false } };

const JOB_LABELS: Record<string, string> = {
  lockout: "Home lockout",
  rekey: "Standard rekey",
  lock_upgrade: "Lock change or upgrade",
};

export default async function BookReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ job_type?: string; address?: string; phone?: string; email?: string; error?: string }>;
}) {
  const { job_type, address, phone, email, error } = await searchParams;
  const jobType = job_type && JOB_LABELS[job_type] ? job_type : "lockout";
  const hasReferencePrice = jobType === "lockout" || jobType === "rekey";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment"><Keyhole className="h-5 w-4 text-brass" />Keepwell</Link>
          <h1 className="mt-7 font-display text-3xl font-medium text-parchment">Review the request</h1>
          <p className="mt-2 text-sm leading-6 text-parchment-dim">Submitting creates a marketplace request. It does not charge a card or guarantee an immediate provider match.</p>
        </div>

        {error && <div className="mt-6 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div>}

        <div className="mt-6 rounded-2xl border border-line bg-ink/35 p-5 text-sm">
          <Row label="Service" value={JOB_LABELS[jobType]} />
          <Row label="Address" value={address || "—"} />
          <Row label="Phone" value={phone || "—"} />
          <div className="mt-4 border-t border-line/70 pt-4">
            <div className="flex items-start justify-between gap-4">
              <span className="text-parchment-dim">Current reference price</span>
              <span className="font-mono text-xl text-brass">{hasReferencePrice ? "$89" : "Quoted before work"}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-parchment-dim">{hasReferencePrice ? "The current platform reference price for the standard service is $89. Payment must be implemented and confirmed before launch; this build does not pretend a card has been authorized." : "Any hardware scope should be priced and approved before work begins."}</p>
          </div>
        </div>

        <form action={createGuestBooking} className="mt-6">
          <input type="hidden" name="job_type" value={jobType} />
          <input type="hidden" name="address" value={address ?? ""} />
          <input type="hidden" name="phone" value={phone ?? ""} />
          <input type="hidden" name="email" value={email ?? ""} />
          <button type="submit" className="w-full rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink">Submit service request</button>
        </form>
        <p className="mt-5 text-center text-xs text-parchment-dim"><Link href={`/book/details?job_type=${jobType}`} className="hover:text-parchment">← Edit details</Link></p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 py-1.5"><span className="text-parchment-dim">{label}</span><span className="max-w-[65%] text-right text-parchment">{value}</span></div>;
}
