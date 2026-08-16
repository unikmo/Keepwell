import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { createClient } from "@/lib/supabase/server";
import { completeGuestBooking } from "../actions";
import { defaultServiceForJobType, formatServicePrice, getServiceMenuItem } from "@/lib/service-menu";

export const metadata: Metadata = { title: "Locksmith request status", robots: { index: false } };

export default async function BookStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: booking }, { data: match }] = await Promise.all([
    supabase.from("guest_bookings").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("public_provider_matches")
      .select("*")
      .eq("request_type", "guest_booking")
      .eq("request_id", id)
      .maybeSingle(),
  ]);

  if (!booking) notFound();

  const service = getServiceMenuItem(booking.service_id) ?? defaultServiceForJobType(booking.job_type)!;
  const completed = booking.status === "completed";
  const matched = Boolean(match);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 text-center sm:p-8">
        <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment">
          <Keyhole className="h-5 w-4 text-brass" />Trusted Locksmith
        </Link>

        <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-verdigris">
          {completed ? "Request completed" : matched ? "Locksmith accepted" : "Request submitted"}
        </div>
        <h1 className="mt-2 font-display text-3xl font-medium text-parchment">
          {completed ? "The service request is closed" : matched ? "Your locksmith has accepted" : "We’re finding a local locksmith"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-parchment-dim">
          {completed
            ? "The request remains in the service record."
            : matched
              ? "This independent provider accepted the job through Trusted Locksmith. Arrival timing below is the provider's accepted ETA."
              : "Trusted Locksmith will show a locksmith only after a real independent provider accepts the request."}
        </p>

        <div className="mt-6 rounded-2xl border border-line bg-ink/35 p-5 text-left text-sm">
          <Row label="Service" value={service.title} />
          <Row label="Fixed standard price" value={formatServicePrice(booking.price_cents || service.customerPriceCents)} />
          <Row label="Request ID" value={booking.id.slice(0, 8).toUpperCase()} />
          <Row label="Locksmith" value={matched ? match.business_name : "Matching in progress"} />
          {matched && match.eta_minutes ? <Row label="Accepted ETA" value={`${match.eta_minutes} min`} /> : null}
          <Row
            label="Payment"
            value={booking.payment_status === "pending" ? "Payment integration pending" : String(booking.payment_status).replaceAll("_", " ")}
          />
        </div>

        {!matched && !completed && (
          <p className="mt-5 text-xs leading-5 text-parchment-dim">
            No fabricated locksmith, rating or ETA is shown. A name and arrival estimate appear only after a real provider accepts.
          </p>
        )}

        {process.env.NODE_ENV !== "production" && !completed && (
          <form action={completeGuestBooking} className="mt-6">
            <input type="hidden" name="id" value={booking.id} />
            <button type="submit" className="text-xs text-parchment-dim underline underline-offset-4">
              Developer preview: mark completed
            </button>
          </form>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment">Back to Trusted Locksmith</Link>
          <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">See prices & membership</Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4 py-1.5"><span className="text-parchment-dim">{label}</span><span className="max-w-[65%] text-right text-parchment">{value}</span></div>;
}
