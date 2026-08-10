import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { createClient } from "@/lib/supabase/server";
import { completeGuestBooking } from "../actions";

export const metadata: Metadata = { title: "Service request status", robots: { index: false } };

const JOB_LABELS: Record<string, string> = { lockout: "Home lockout", rekey: "Standard rekey", lock_upgrade: "Lock change or upgrade" };

export default async function BookStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: booking } = await supabase.from("guest_bookings").select("*").eq("id", id).maybeSingle();
  if (!booking) notFound();

  const completed = booking.status === "completed";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 text-center sm:p-8">
        <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment"><Keyhole className="h-5 w-4 text-brass" />Keepwell</Link>

        <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-verdigris">{completed ? "Request completed" : "Request submitted"}</div>
        <h1 className="mt-2 font-display text-3xl font-medium text-parchment">{completed ? "The service request is closed" : "Keepwell has your request"}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-parchment-dim">{completed ? "The request remains in the property service record." : "A provider has not been invented or pre-assigned. Keepwell should show provider identity and timing only after a real independent provider accepts."}</p>

        <div className="mt-6 rounded-2xl border border-line bg-ink/35 p-5 text-left text-sm">
          <Row label="Service" value={JOB_LABELS[booking.job_type] ?? booking.job_type} />
          <Row label="Request ID" value={booking.id.slice(0, 8).toUpperCase()} />
          <Row label="Provider" value={completed ? "See completed request record" : "Waiting for a real match"} />
          <Row label="Payment" value={booking.payment_status === "pending" ? "Not authorized in this build" : String(booking.payment_status).replaceAll("_", " ")} />
        </div>

        {!completed && (
          <p className="mt-5 text-xs leading-5 text-parchment-dim">Production launch still requires the real provider-matching and payment workflow. This screen is intentionally truthful instead of showing a fake technician, rating or ETA.</p>
        )}

        {process.env.NODE_ENV !== "production" && !completed && (
          <form action={completeGuestBooking} className="mt-6">
            <input type="hidden" name="id" value={booking.id} />
            <button type="submit" className="text-xs text-parchment-dim underline underline-offset-4">Developer preview: mark completed</button>
          </form>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment">Back to Keepwell</Link>
          <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Explore membership</Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 py-1.5"><span className="text-parchment-dim">{label}</span><span className="max-w-[65%] text-right text-parchment">{value}</span></div>;
}
