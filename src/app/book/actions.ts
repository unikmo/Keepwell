"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServiceMenuItem } from "@/lib/service-menu";

export async function createGuestBooking(formData: FormData) {
  const serviceId = String(formData.get("service_id") ?? "");
  const service = getServiceMenuItem(serviceId);
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;

  if (!service) {
    redirect(`/book?error=${encodeURIComponent("Choose a valid service.")}`);
  }

  if (!address || !phone) {
    redirect(
      `/book/review?service_id=${encodeURIComponent(service.id)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email ?? "")}&error=${encodeURIComponent("Address and phone are required.")}`
    );
  }

  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from("guest_bookings")
    .insert({
      job_type: service.jobType,
      service_id: service.id,
      address,
      phone,
      email,
      price_cents: service.customerPriceCents,
      discount_pct: 0,
      payment_status: "pending",
      // Legacy-compatible status. Operational state now lives in
      // provider_job_offers until the guest_bookings status model is migrated.
      status: "dispatched",
    })
    .select()
    .single();

  if (error || !booking) {
    redirect(
      `/book/review?service_id=${encodeURIComponent(service.id)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email ?? "")}&error=${encodeURIComponent(error?.message ?? "Could not create the request")}`
    );
  }

  await supabase.from("analytics_events").insert({
    event_name: "service_request_created",
    guest_booking_id: booking.id,
    metadata: {
      service_id: service.id,
      job_type: service.jobType,
      customer_price_cents: service.customerPriceCents,
      payment_status: "pending",
    },
  });

  redirect(`/book/${booking.id}`);
}

// Development / operations helper only. Provider completion should replace
// this before public marketplace launch.
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

  await supabase.from("analytics_events").insert({
    event_name: "service_request_completed",
    guest_booking_id: id,
    metadata: { job_type: booking.job_type, service_id: booking.service_id },
  });

  redirect(`/book/${id}`);
}
