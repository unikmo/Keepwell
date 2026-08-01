"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Payment is stubbed per the Implementation Spec ("build everything up to
// payment") — no real charge is captured here yet. The line item is still
// logged as a real, independently-queryable ledger entry.
export async function purchaseLockboxAddon() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, plan:plans(lockbox_addon_price_cents)")
    .eq("member_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!subscription) redirect("/app/help?error=No active subscription found");

  const plan = subscription.plan as unknown as { lockbox_addon_price_cents: number | null } | null;
  const priceCents = plan?.lockbox_addon_price_cents ?? 1999;

  await supabase
    .from("subscriptions")
    .update({ lockbox_status: "installed" })
    .eq("id", subscription.id);

  await supabase.from("lockbox_ledger").insert({
    subscription_id: subscription.id,
    member_id: user.id,
    event_type: "addon_purchase",
    wholesale_cost_cents: 1400,
    // TODO(payment): capture real charge once a payment processor is
    // connected. charged_amount_cents reflects the list price for now.
    charged_amount_cents: priceCents,
  });

  await supabase.from("activity_log").insert({
    member_id: user.id,
    title: "Lockbox code registered",
    meta: `${(priceCents / 100).toFixed(2)} one-time`,
  });

  await supabase.from("analytics_events").insert({
    event_name: "lockbox_addon_purchased",
    member_id: user.id,
  });

  revalidatePath("/app");
  revalidatePath("/app/trusted");
  redirect("/app/trusted?notice=Lockbox+registered");
}
