"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function purchaseLockboxAddon() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/lockbox");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id,lockbox_status,plan:plans(lockbox_addon_price_cents)")
    .eq("member_id", user.id)
    .eq("status", "active")
    .maybeSingle();
  if (!subscription) redirect("/app/help?error=No active subscription found");
  if (subscription.lockbox_status !== "none") redirect("/app/lockbox?notice=Lockbox fulfillment is already on your account.");

  // Payments/fulfillment are not connected yet. Record a request only; do not
  // fabricate a charge, shipment or installation.
  await supabase.from("subscriptions").update({ lockbox_status: "pending_fulfillment" }).eq("id", subscription.id);
  await supabase.from("activity_log").insert({ member_id: user.id, title: "Physical lockbox add-on requested", meta: "Pending payment / fulfillment" });
  await supabase.from("analytics_events").insert({ event_name: "lockbox_addon_requested", member_id: user.id });

  revalidatePath("/app");
  revalidatePath("/app/trusted");
  revalidatePath("/app/lockbox");
  redirect("/app/lockbox?notice=Lockbox add-on requested. No payment has been captured yet.");
}
