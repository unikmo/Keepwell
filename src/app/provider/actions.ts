"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getOwnedProvider() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/provider");

  const { data: provider } = await supabase
    .from("provider_profiles")
    .select("id")
    .eq("claimed_user_id", user.id)
    .eq("claim_status", "verified")
    .maybeSingle();

  if (!provider) redirect("/provider?error=Provider profile is not verified yet.");
  return { supabase, user, provider };
}

export async function setAvailability(formData: FormData) {
  const { supabase, provider } = await getOwnedProvider();
  const isAvailable = String(formData.get("is_available") ?? "false") === "true";

  const { error } = await supabase.from("provider_profiles").update({ is_available: isAvailable }).eq("id", provider.id);
  if (error) redirect(`/provider?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/provider");
  redirect(`/provider?notice=${encodeURIComponent(isAvailable ? "You are available for job offers." : "Availability paused.")}`);
}

export async function respondToOffer(formData: FormData) {
  const { supabase, provider } = await getOwnedProvider();
  const offerId = String(formData.get("offer_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const etaMinutes = Number(formData.get("eta_minutes") ?? 0);

  const { data: offer } = await supabase
    .from("provider_job_offers")
    .select("id,status")
    .eq("id", offerId)
    .eq("provider_id", provider.id)
    .maybeSingle();

  if (!offer || offer.status !== "offered") redirect("/provider?error=That offer is no longer open.");

  const update = decision === "accept"
    ? { status: "accepted", accepted_at: new Date().toISOString(), responded_at: new Date().toISOString(), eta_minutes: Math.min(Math.max(etaMinutes || 30, 5), 240) }
    : { status: "declined", responded_at: new Date().toISOString() };

  const { error } = await supabase.from("provider_job_offers").update(update).eq("id", offer.id).eq("provider_id", provider.id);
  if (error) redirect(`/provider?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/provider");
  redirect(`/provider?notice=${encodeURIComponent(decision === "accept" ? "Job accepted." : "Job declined.")}`);
}

export async function completeFulfillmentOffer(formData: FormData) {
  const { supabase, provider } = await getOwnedProvider();
  const offerId = String(formData.get("offer_id") ?? "");
  const { data: offer } = await supabase
    .from("provider_job_offers")
    .select("id,status,request_type")
    .eq("id", offerId)
    .eq("provider_id", provider.id)
    .maybeSingle();

  if (!offer || !["pm_request", "audit_followup"].includes(offer.request_type) || offer.status !== "accepted") {
    redirect("/provider?error=Only an accepted managed-property or audit follow-up job can be completed here.");
  }

  const { error } = await supabase
    .from("provider_job_offers")
    .update({ status: "completed", completed_at: new Date().toISOString(), responded_at: new Date().toISOString() })
    .eq("id", offer.id)
    .eq("provider_id", provider.id);
  if (error) redirect(`/provider?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/provider");
  redirect(`/provider?notice=${encodeURIComponent(offer.request_type === "audit_followup" ? "Audit follow-up work marked completed." : "Property-manager job marked completed.")}`);
}
