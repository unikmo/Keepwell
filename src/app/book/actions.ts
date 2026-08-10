"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const REFERENCE_PRICE_CENTS = 8900;
const FIXED_PRICE_JOB_TYPES = new Set(["lockout", "rekey"]);

export async function createGuestBooking(formData: FormData) {
  const jobType = String(formData.get("job_type") ?? "lockout");
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;

  if (!address || !phone) {
    redirect(`/book/review?job_type=${encodeURIComponent(jobType)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email ?? "")}&error=${encodeURIComponent("Address and phone are required.")}`);
  }

  const isReferencePrice = FIXED_PRICE_JOB_TYPES.has(jobType);
  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from("guest_bookings")
    .insert({
      job_type: jobType,
      address,
      phone,
      email,
      price_cents: isReferencePrice ? REFERENCE_PRICE_CENTS : 0,
      discount_pct: 0,
      payment_status: "pending",
      // Keep the existing database-compatible status until the marketplace
      // state model is migrated. The UI deliberately treats this as a
      // submitted request, not as proof that a provider has been dispatched.
      status: "dispatched",
    })
    .select()
    .single();

  if (error || !booking) {
    redirect(`/book/review?job_type=${encodeURIComponent(jobType)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email ?? "")}&error=${encodeURIComponent(error?.message ?? "Could not create the request")}`);
  }

  await supabase.from("analytics_events").insert({
    event_name: "service_request_created",
    guest_booking_id: booking.id,
    metadata: { job_type: jobType, payment_status: "pending" },
  });

  redirect(`/book/${booking.id}`);
}

// Development / operations helper only. A real provider completion workflow
// should replace this before production marketplace operations.
export async function completeGuestBooking(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: booking } = await supabase.from("guest_bookings").select("*").eq("id", id).maybeSingle();
  if (!booking || booking.status === "completed") redirect(`/book/${id}`);

  await supabase
    .from("guest_bookings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      payment_status: "pending_final_charge",
    })
    .eq("id", id);

  if (booking.phone) {
    await supabase.from("outbound_messages").insert({
      guest_booking_id: id,
      channel: "sms",
      template: "guest_upsell_1hr",
      to_address: booking.phone,
      body: "Keepwell can keep your property access, trusted contacts and future service requests in one place. Explore membership from $29/yr.",
      status: "queued",
    });
  }
  if (booking.email) {
    await supabase.from("outbound_messages").insert({
      guest_booking_id: id,
      channel: "email",
      template: "guest_upsell_1hr",
      to_address: booking.email,
      body: "Keepwell can keep your property access, trusted contacts and future service requests in one place. Explore membership from $29/yr.",
      status: "queued",
    });
  }

  await supabase.from("analytics_events").insert({
    event_name: "service_request_completed",
    guest_booking_id: id,
    metadata: { job_type: booking.job_type },
  });

  redirect(`/book/${id}`);
}
