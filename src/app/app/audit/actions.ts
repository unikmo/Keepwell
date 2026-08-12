"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function requestLockAudit(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/audit");

  const preferredDate = String(formData.get("preferred_date") ?? "").trim() || null;
  const propertyAddress = String(formData.get("property_address") ?? "").trim();
  if (!propertyAddress) redirect("/app/audit?error=Property address is required.");

  const { error } = await supabase.rpc("request_lock_audit", {
    p_property_address: propertyAddress,
    p_preferred_date: preferredDate,
  });
  if (error) redirect(`/app/audit?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/app/audit");
  revalidatePath("/app");
  redirect("/app/audit?notice=Audit request submitted.");
}

export async function acceptAuditOffer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/audit");
  const offerId = String(formData.get("offer_id") ?? "");

  const { error } = await supabase.rpc("accept_audit_offer", { p_offer_id: offerId });
  if (error) redirect(`/app/audit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/app/audit");
  redirect("/app/audit?notice=Offer accepted. Keepwell will coordinate the follow-up work.");
}
