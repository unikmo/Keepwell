import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { createGuestBooking } from "../actions";

export const metadata: Metadata = {
  title: "Book a Locksmith — Review | Digital Sentinel",
  robots: { index: false },
};

const JOB_LABELS: Record<string, string> = {
  lockout: "I'm locked out",
  rekey: "Rekey my locks",
  lock_upgrade: "Upgrade my lock",
};

export default async function BookReviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    job_type?: string;
    address?: string;
    phone?: string;
    email?: string;
    error?: string;
  }>;
}) {
  const { job_type, address, phone, email, error } = await searchParams;
  const jobType = job_type && JOB_LABELS[job_type] ? job_type : "lockout";
  // Flat $89 + 15% guest discount applies to lockout/rekey only. Lock
  // upgrade/hardware jobs use the existing hardware-upsell pricing split
  // with no separate guest discount — priced after an on-site assessment.
  const isFixedPrice = jobType === "lockout" || jobType === "rekey";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Confirm your booking</h1>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-line bg-surface p-5 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="text-parchment-dim">Job</span>
            <span className="text-parchment">{JOB_LABELS[jobType]}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-parchment-dim">Address</span>
            <span className="max-w-[60%] text-right text-parchment">{address || "—"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-parchment-dim">Phone</span>
            <span className="text-parchment">{phone || "—"}</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-line/70 pt-4">
            <span className="text-parchment-dim">{isFixedPrice ? "Guest price" : "Price"}</span>
            <span className="font-mono text-2xl text-brass">{isFixedPrice ? "$89" : "TBD"}</span>
          </div>
          <p className="mt-1 text-xs text-parchment-dim">
            {isFixedPrice
              ? "Your 15% guest discount is already included. No membership required."
              : "Lock upgrades are priced on-site after your tech assesses the hardware — no guest discount applies to hardware jobs."}
          </p>
        </div>

        <form action={createGuestBooking} className="mt-6">
          <input type="hidden" name="job_type" value={jobType} />
          <input type="hidden" name="address" value={address ?? ""} />
          <input type="hidden" name="phone" value={phone ?? ""} />
          <input type="hidden" name="email" value={email ?? ""} />
          <button
            type="submit"
            className="w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            {isFixedPrice ? "Confirm — $89, charged when the job is done" : "Confirm — priced after assessment"}
          </button>
          <p className="mt-2 text-center text-[11px] text-parchment-dim">
            {isFixedPrice
              ? "Card is authorized now and only captured after the visit is complete."
              : "No charge is authorized until your tech gives you a fixed price on-site."}
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          Members pay $0 for covered visits.{" "}
          <Link href="/signup" className="text-brass hover:underline">
            See plans
          </Link>
        </p>
      </div>
    </div>
  );
}
