"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const VALID_PLAN_IDS = new Set(["individual", "household", "household_plus"]);

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "");
  const rawPlan = String(formData.get("plan") ?? "household");
  const planId = VALID_PLAN_IDS.has(rawPlan) ? rawPlan : "household";

  const { data: planRow } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, plan: planRow?.name ?? planId },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && planRow) {
    // The DB trigger already inserts a starter members row; upsert to make
    // sure the display name reflects the chosen plan.
    await supabase
      .from("members")
      .upsert({ id: data.user.id, full_name: fullName, plan: planRow.name }, { onConflict: "id" });

    // Household+ gets its first re-audit clock started at signup (3-year
    // cadence). welcome_visit_used stays false — it's a one-time flag
    // consumed only when the welcome visit is actually completed, never
    // reset by billing cycle.
    const nextReauditDue =
      planRow.id === "household_plus" && planRow.reaudit_cadence_years
        ? isoDatePlusYears(planRow.reaudit_cadence_years)
        : null;

    // Household includes a free self-install lockbox mailed at signup;
    // Household+ install happens later as part of the guaranteed welcome
    // visit, so its lockbox stays "none" until that visit is completed.
    const lockboxStatus = planRow.lockbox_mode === "included_free" ? "shipped" : "none";

    const { data: subscription } = await supabase
      .from("subscriptions")
      .insert({
        member_id: data.user.id,
        plan_id: planRow.id,
        welcome_visit_used: false,
        lockbox_status: lockboxStatus,
        next_reaudit_due: nextReauditDue,
      })
      .select()
      .single();

    if (subscription && planRow.lockbox_mode === "included_free") {
      // Real, independently-queryable COGS line item at time of shipment —
      // tagged separately from dispatch payouts per the spec.
      await supabase.from("lockbox_ledger").insert({
        subscription_id: subscription.id,
        member_id: data.user.id,
        event_type: "included_ship",
        wholesale_cost_cents: 1400,
        charged_amount_cents: 0,
      });
    }

    await supabase.from("analytics_events").insert({
      event_name: "signup_completed",
      member_id: data.user.id,
      plan_id: planRow.id,
    });
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/login?notice=Check your email to confirm your account.");
}

function isoDatePlusYears(years: number) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}
