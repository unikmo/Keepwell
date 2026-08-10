"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function claimProvider(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/providers/claim");

  const providerId = String(formData.get("provider_id") ?? "");
  const contactName = String(formData.get("contact_name") ?? "").trim();
  const businessEmail = String(formData.get("business_email") ?? "").trim();
  const businessPhone = String(formData.get("business_phone") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!providerId || !contactName || !businessEmail || !businessPhone || !relationship) {
    redirect(`/providers/claim?provider=${encodeURIComponent(providerId)}&error=${encodeURIComponent("Complete the required ownership details.")}`);
  }

  const { error } = await supabase.from("provider_claims").insert({
    provider_id: providerId,
    user_id: user!.id,
    contact_name: contactName,
    business_email: businessEmail,
    business_phone: businessPhone,
    relationship,
    notes: notes || null,
    status: "pending",
  });

  if (error) {
    redirect(`/providers/claim?provider=${encodeURIComponent(providerId)}&error=${encodeURIComponent(error.message)}`);
  }

  redirect("/provider?notice=Claim submitted for review.");
}
