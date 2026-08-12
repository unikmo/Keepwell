"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitAuditReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/provider");

  const offerId = String(formData.get("offer_id") ?? "");
  const report = {
    exterior_doors: String(formData.get("exterior_doors") ?? "").trim(),
    cylinders: String(formData.get("cylinders") ?? "").trim(),
    strike_plates: String(formData.get("strike_plates") ?? "").trim(),
    smart_access: String(formData.get("smart_access") ?? "").trim(),
    spare_key_risk: String(formData.get("spare_key_risk") ?? "").trim(),
    recommendations: String(formData.get("recommendations") ?? "").trim(),
    urgent_issue: String(formData.get("urgent_issue") ?? "") === "yes",
  };

  const { error } = await supabase.rpc("submit_lock_audit_report", { p_offer_id: offerId, p_report: report });
  if (error) redirect(`/provider/audits/${offerId}?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/provider");
  redirect(`/provider/audits/${offerId}?notice=Report submitted to Keepwell. Do not quote or sell remedial work directly to the customer.`);
}
