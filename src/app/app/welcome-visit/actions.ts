"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function scheduleWelcomeVisit(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const preferredDate = String(formData.get("date") ?? "");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, welcome_visit_used")
    .eq("member_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!subscription) redirect("/app?error=No active subscription found");

  if (subscription.welcome_visit_used) {
    redirect("/app");
  }

  // One-time flag tied to signup entitlement — never reset by billing cycle.
  // next_reaudit_due is untouched here; it's a separate entitlement reset
  // only when a completed re-audit actually happens, years from now.
  await supabase
    .from("subscriptions")
    .update({ welcome_visit_used: true, lockbox_status: "installed" })
    .eq("id", subscription.id);

  await supabase.from("lockbox_ledger").insert({
    subscription_id: subscription.id,
    member_id: user.id,
    event_type: "welcome_visit_install",
    wholesale_cost_cents: 1400,
    charged_amount_cents: 0,
  });

  await supabase.from("activity_log").insert({
    member_id: user.id,
    title: "Welcome visit scheduled",
    meta: preferredDate ? `Requested for ${preferredDate}` : "Security audit + lockbox + smart lock install",
  });

  await supabase.from("analytics_events").insert({
    event_name: "welcome_visit_completed",
    member_id: user.id,
    metadata: { preferred_date: preferredDate },
  });

  revalidatePath("/app");
  redirect("/app?notice=Welcome+visit+scheduled");
}
