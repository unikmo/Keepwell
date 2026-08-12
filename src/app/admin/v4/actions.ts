"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { LOCK_AUDIT } from "@/lib/service-menu";

async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/v4");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/");
  return { supabase, user };
}

export async function offerV4Request(formData: FormData) {
  const { supabase } = await getAdmin();
  const requestType = String(formData.get("request_type") ?? "");
  const requestId = String(formData.get("request_id") ?? "");
  const providerId = String(formData.get("provider_id") ?? "");
  const payoutCents = Number(formData.get("payout_cents") ?? 0);
  if (!["lock_audit","pm_request","audit_followup"].includes(requestType) || !requestId || !providerId || payoutCents <= 0) redirect("/admin/v4?error=Invalid provider offer.");

  const { data: provider } = await supabase.from("provider_profiles").select("id,business_name,claim_status").eq("id", providerId).maybeSingle();
  if (!provider || provider.claim_status !== "verified") redirect("/admin/v4?error=Provider must be verified.");

  let summary: Record<string, unknown> = {};
  if (requestType === "lock_audit") {
    const { data: audit } = await supabase.from("lock_audits").select("*").eq("id", requestId).maybeSingle();
    if (!audit) redirect("/admin/v4?error=Audit not found.");
    summary = { service_title: LOCK_AUDIT.title, address: audit.property_address, preferred_date: audit.preferred_date, scope: LOCK_AUDIT.scope };
    await supabase.from("lock_audits").update({ status: "offered" }).eq("id", requestId);
  } else if (requestType === "pm_request") {
    const { data: request } = await supabase.from("pm_service_requests").select("*,property:pm_properties(name,address)").eq("id", requestId).maybeSingle();
    if (!request) redirect("/admin/v4?error=Property-manager request not found.");
    const property = request.property as any;
    summary = { service_title: `Property manager · ${request.service_type}`, address: property?.address, scope: request.notes ?? "Managed-property access request" };
    await supabase.from("pm_service_requests").update({ status: "offered" }).eq("id", requestId);
  } else {
    const { data: followup } = await supabase.from("audit_offers").select("*,audit:lock_audits(property_address)").eq("id", requestId).maybeSingle();
    if (!followup || followup.status !== "accepted") redirect("/admin/v4?error=Customer-approved audit follow-up offer required.");
    const audit = followup.audit as any;
    summary = { service_title: followup.title, address: audit?.property_address, scope: followup.description, customer_price_cents: followup.customer_price_cents, source: "Keepwell audit follow-up" };
  }

  const { error } = await supabase.from("provider_job_offers").insert({ request_type: requestType, request_id: requestId, provider_id: providerId, payout_cents: payoutCents, request_summary: summary, status: "offered" });
  if (error) redirect(`/admin/v4?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/v4");
  revalidatePath("/provider");
  redirect(`/admin/v4?notice=${encodeURIComponent(`Offer sent to ${provider.business_name}.`)}`);
}

export async function publishAuditReview(formData: FormData) {
  const { supabase } = await getAdmin();
  const auditId = String(formData.get("audit_id") ?? "");
  const customerSummary = String(formData.get("customer_summary") ?? "").trim();
  const { data: audit } = await supabase.from("lock_audits").select("*").eq("id", auditId).maybeSingle();
  if (!audit || audit.status !== "report_submitted") redirect("/admin/v4?error=Submitted provider report required.");

  const completedAt = new Date();
  const next = new Date(completedAt);
  next.setFullYear(next.getFullYear() + 3);
  await supabase.from("lock_audits").update({ status: "reviewed", customer_report_summary: customerSummary || "Keepwell reviewed the provider report.", reviewed_at: completedAt.toISOString(), completed_at: completedAt.toISOString() }).eq("id", auditId);
  await supabase.from("subscriptions").update({ last_audit_completed_at: completedAt.toISOString(), next_audit_eligible_at: next.toISOString().slice(0,10), next_reaudit_due: next.toISOString().slice(0,10) }).eq("id", audit.subscription_id);
  await supabase.from("provider_job_offers").update({ status: "completed", completed_at: completedAt.toISOString() }).eq("request_type", "lock_audit").eq("request_id", auditId).eq("status", "accepted");
  await supabase.from("activity_log").insert({ member_id: audit.member_id, title: "Lock & Access Audit reviewed", meta: `Next included audit available ${next.toISOString().slice(0,10)}` });
  revalidatePath("/admin/v4"); revalidatePath("/app/audit");
  redirect("/admin/v4?notice=Audit reviewed and three-year entitlement clock reset.");
}

export async function issueAuditOffer(formData: FormData) {
  const { supabase, user } = await getAdmin();
  const auditId = String(formData.get("audit_id") ?? "");
  const title = String(formData.get("title") ?? "Recommended access work").trim();
  const description = String(formData.get("description") ?? "").trim();
  const customerPriceCents = Number(formData.get("customer_price_cents") ?? 0);
  const targetProviderPayoutCents = Number(formData.get("provider_payout_cents") ?? 0) || null;
  if (!auditId || !description || customerPriceCents <= 0) redirect("/admin/v4?error=Complete the official offer details.");
  const { data: audit } = await supabase.from("lock_audits").select("member_id").eq("id", auditId).maybeSingle();
  if (!audit) redirect("/admin/v4?error=Audit not found.");
  const { error } = await supabase.from("audit_offers").insert({ audit_id: auditId, member_id: audit.member_id, created_by: user.id, title, description, customer_price_cents: customerPriceCents, target_provider_payout_cents: targetProviderPayoutCents, status: "offered" });
  if (error) redirect(`/admin/v4?error=${encodeURIComponent(error.message)}`);
  await supabase.from("lock_audits").update({ status: "quoted" }).eq("id", auditId);
  revalidatePath("/admin/v4"); revalidatePath("/app/audit");
  redirect("/admin/v4?notice=Official Keepwell follow-up offer issued.");
}

export async function markBulkOrderPaid(formData: FormData) {
  const { supabase } = await getAdmin();
  const orderId = String(formData.get("order_id") ?? "");
  const { data: order } = await supabase.from("brokerage_bulk_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order || order.status !== "pending_invoice") redirect("/admin/v4?error=Pending bulk order not found.");

  await supabase.from("brokerage_bulk_orders").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", order.id);
  const rows = Array.from({ length: order.quantity }, () => ({ brokerage_id: order.brokerage_id, bulk_order_id: order.id, plan_id: order.plan_id, code: `KW-${randomUUID().replace(/-/g, "").slice(0,20).toUpperCase()}`, status: "unused" }));
  const { error } = await supabase.from("brokerage_activation_codes").insert(rows);
  if (error) redirect(`/admin/v4?error=${encodeURIComponent(error.message)}`);
  await supabase.from("brokerage_bulk_orders").update({ status: "codes_issued", codes_issued_at: new Date().toISOString() }).eq("id", order.id);
  revalidatePath("/admin/v4"); revalidatePath("/brokerage");
  redirect("/admin/v4?notice=Payment recorded and activation codes issued.");
}
