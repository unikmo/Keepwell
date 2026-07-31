import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { createClient } from "@/lib/supabase/server";
import { completeGuestBooking } from "../actions";

export const metadata: Metadata = {
  title: "Your Booking — Digital Sentinel",
  robots: { index: false },
};

const JOB_LABELS: Record<string, string> = {
  lockout: "Lockout",
  rekey: "Rekey",
  lock_upgrade: "Lock upgrade",
};

export default async function BookStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: booking } = await supabase.from("guest_bookings").select("*").eq("id", id).maybeSingle();

  if (!booking) notFound();

  const completed = booking.status === "completed";
  const isFixedPrice = booking.price_cents > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>

          {!completed ? (
            <>
              <div className="mt-4 font-mono text-xs uppercase tracking-wide text-verdigris">
                Help is on the way
              </div>
              <h1 className="mt-2 font-display text-2xl font-medium text-parchment">
                A tech is headed your way
              </h1>
              <p className="mt-1 text-sm text-parchment-dim">{JOB_LABELS[booking.job_type]}</p>
            </>
          ) : (
            <>
              <div className="mt-4 font-mono text-xs uppercase tracking-wide text-brass">Job complete</div>
              <h1 className="mt-2 font-display text-2xl font-medium text-parchment">
                All set — thanks for booking
              </h1>
            </>
          )}
        </div>

        <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-surface-raised px-5 py-4">
          <div>
            <div className="font-mono text-xl text-brass">
              {completed
                ? isFixedPrice
                  ? `$${(booking.price_cents / 100).toFixed(0)}`
                  : "Priced on-site"
                : "12 min"}
            </div>
            <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">
              {completed ? (isFixedPrice ? "Charged on completion" : "Final price from your tech") : "Estimated arrival"}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-verdigris/35 bg-verdigris/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris">
            <span className="h-1.5 w-1.5 rounded-full bg-verdigris" />
            {completed ? (isFixedPrice ? "Paid" : "Assessed") : "Verified ID"}
          </span>
        </div>

        {!completed && (
          <form action={completeGuestBooking} className="mt-6">
            <input type="hidden" name="id" value={booking.id} />
            <button
              type="submit"
              className="w-full rounded-full border border-line px-6 py-3 text-sm font-medium text-parchment-dim transition hover:border-parchment-dim"
            >
              (Ops preview) Mark job complete
            </button>
          </form>
        )}

        {completed && (
          <div className="mt-6 rounded-xl border border-brass/20 bg-brass/[0.06] p-5 text-center">
            <div className="text-sm font-medium text-parchment">
              Never pay per visit again
            </div>
            <p className="mt-1 text-xs leading-relaxed text-parchment-dim">
              Members get covered lockouts, rekeys, and car-at-home visits for $0 — from $29/yr.
            </p>
            <Link
              href="/signup"
              className="mt-3 inline-block rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-[#dab668]"
            >
              See plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
