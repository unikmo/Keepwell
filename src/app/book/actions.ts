"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const TECHS = [
  { name: "Daryl Owusu" },
  { name: "Renata Cole" },
  { name: "Sam Okafor" },
];

const GUEST_PRICE_CENTS = 8900;
const GUEST_DISCOUNT_PCT = 15;

// Flat $89 + 15% guest discount applies to lockout/rekey only (Spec
// Section 4). Lock upgrade/hardware jobs use the existing hardware-upsell
// split with NO separate guest discount — priced after an on-site
// assessment, so there's no fixed price or discount to store at booking.
const FIXED_PRICE_JOB_TYPES = new Set(["lockout", "rekey"]);

// "Not yet — build everything up to payment, stub the charge." Payment
// authorize-at-booking / capture-on-completion is modeled via
// payment_status transitions; no real processor is wired in yet.
export async function createGuestBooking(formData: FormData) {
  const jobType = String(formData.get("job_type") ?? "lockout");
  const address = String(formData.get("address") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const email = String(formData.get("email") ?? "") || null;

  if (!address || !phone) {
    redirect(
      `/book/review?job_type=${encodeURIComponent(jobType)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email ?? "")}&error=${encodeURIComponent("Address and phone are required.")}`
    );
  }

  const isFixedPrice = FIXED_PRICE_JOB_TYPES.has(jobType);

  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from("guest_bookings")
    .insert({
      job_type: jobType,
      address,
      phone,
      email,
      price_cents: isFixedPrice ? GUEST_PRICE_CENTS : 0,
      discount_pct: isFixedPrice ? GUEST_DISCOUNT_PCT : 0,
      // TODO(payment): replace with a real authorize-only PaymentIntent once
      // Stripe (or similar) is connected. Fixed-price jobs get a hold now;
      // hardware jobs wait for an on-site price before anything is charged.
      payment_status: isFixedPrice ? "authorized" : "pending_assessment",
      status: "dispatched",
    })
    .select()
    .single();

  if (error || !booking) {
    redirect(`/book/review?error=${encodeURIComponent(error?.message ?? "Could not create booking")}`);
  }

  await supabase.from("analytics_events").insert({
    event_name: "guest_booking_created",
    guest_booking_id: booking.id,
    metadata: { job_type: jobType },
  });

  redirect(`/book/${booking.id}`);
}

// In production this fires from the tech's completion event. Exposed here
// as a direct action since no field-tech app exists yet in this pass.
export async function completeGuestBooking(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("guest_bookings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!booking || booking.status === "completed") {
    redirect(`/book/${id}`);
  }

  await supabase
    .from("guest_bookings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      // Fixed-price jobs had a hold placed at booking and capture now.
      // Hardware jobs get their price on-site, so this flags the final
      // charge as ready rather than pretending a hold already exists.
      payment_status: booking.price_cents > 0 ? "captured" : "pending_final_charge",
    })
    .eq("id", id);

  // Post-completion automated upsell, queued for send within 1 hour.
  // No real SMS/email provider is connected yet — this is the stub queue.
  if (booking.phone) {
    await supabase.from("outbound_messages").insert({
      guest_booking_id: id,
      channel: "sms",
      template: "guest_upsell_1hr",
      to_address: booking.phone,
      body: "Glad we could help today. Want lockouts covered for free next time? Join Digital Sentinel from $29/yr: https://mykeepwell.vercel.app/pricing",
      status: "queued",
    });
  }
  if (booking.email) {
    await supabase.from("outbound_messages").insert({
      guest_booking_id: id,
      channel: "email",
      template: "guest_upsell_1hr",
      to_address: booking.email,
      body: "Glad we could help today. Want lockouts covered for free next time? Join Digital Sentinel from $29/yr.",
      status: "queued",
    });
  }

  await supabase.from("analytics_events").insert({
    event_name: "guest_booking_completed",
    guest_booking_id: id,
    metadata: { job_type: booking.job_type },
  });

  redirect(`/book/${id}`);
}
