"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServiceMenuItem, defaultServiceForJobType } from "@/lib/service-menu";

async function getAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user!.id).maybeSingle();
  if (!admin) redirect("/?error=admin_required");
  return { supabase, user: user! };
}

export async function reviewProviderClaim(formData: FormData) {
  const { supabase } = await getAdminClient();
  const claimId = String(formData.get("claim_id") ?? "");
  const decision = String(formData.get("decision") ?? "");

  const { data: claim } = await supabase.from("provider_claims").select("*").eq("id", claimId).maybeSingle();
  if (!claim) redirect("/admin?error=Claim not found.");

  const status = decision === "approve" ? "approved" : "rejected";
  const { error: claimError } = await supabase
    .from("provider_claims")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", claim.id);

  if (claimError) redirect(`/admin?error=${encodeURIComponent(claimError.message)}`);

  if (decision === "approve") {
    const { error: providerError } = await supabase
      .from("provider_profiles")
      .update({
        claimed_user_id: claim.user_id,
        claim_status: "verified",
        verified_at: new Date().toISOString(),
        is_available: false,
      })
      .eq("id", claim.provider_id);

    if (providerError) redirect(`/admin?error=${encodeURIComponent(providerError.message)}`);
  } else {
    await supabase.from("provider_profiles").update({ claim_status: "unclaimed" }).eq("id", claim.provider_id);
  }

  revalidatePath("/admin");
  redirect(`/admin?notice=${encodeURIComponent(`Claim ${status}.`)}`);
}

export async function offerJob(formData: FormData) {
  const { supabase } = await getAdminClient();
  const requestType = String(formData.get("request_type") ?? "");
  const requestId = String(formData.get("request_id") ?? "");
  const providerId = String(formData.get("provider_id") ?? "");
  const payoutCents = Number(formData.get("payout_cents") ?? 0);

  if (!["guest_booking", "member_dispatch"].includes(requestType) || !requestId || !providerId || payoutCents <= 0) {
    redirect("/admin?error=Invalid job offer.");
  }

  const { data: provider } = await supabase
    .from("provider_profiles")
    .select("id,business_name,claim_status,is_available")
    .eq("id", providerId)
    .maybeSingle();

  if (!provider || provider.claim_status !== "verified") redirect("/admin?error=Provider must be verified.");

  let summary: Record<string, unknown> = {};

  if (requestType === "guest_booking") {
    const { data: request } = await supabase.from("guest_bookings").select("*").eq("id", requestId).maybeSingle();
    if (!request) redirect("/admin?error=Request not found.");
    const service = getServiceMenuItem(request.service_id) ?? defaultServiceForJobType(request.job_type)!;
    summary = {
      service_title: service.title,
      service_id: service.id,
      address: request.address,
      scope: service.scope,
      customer_price_cents: request.price_cents || service.customerPriceCents,
    };
  } else {
    const { data: request } = await supabase.from("dispatch_requests").select("*").eq("id", requestId).maybeSingle();
    if (!request) redirect("/admin?error=Request not found.");
    summary = { issue: request.issue ?? "Member access request" };
  }

  const { error } = await supabase.from("provider_job_offers").insert({
    request_type: requestType,
    request_id: requestId,
    provider_id: providerId,
    payout_cents: payoutCents,
    request_summary: summary,
    status: "offered",
  });

  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin");
  redirect(`/admin?notice=${encodeURIComponent(`Offer sent to ${provider.business_name}.`)}`);
}
