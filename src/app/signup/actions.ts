"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const VALID_PLAN_IDS = new Set(["individual", "household", "household_plus"]);

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "").trim();
  const rawPlan = String(formData.get("plan") ?? "household");
  const planId = VALID_PLAN_IDS.has(rawPlan) ? rawPlan : "household";

  const { data: planRow } = await supabase.from("plans").select("id,name").eq("id", planId).maybeSingle();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        plan: planRow?.name ?? planId,
        plan_id: planId,
        // Do not provision an active paid subscription before a real Stripe
        // checkout/webhook confirms payment.
        membership_signup: false,
      },
    },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  if (data.session) redirect("/app");
  redirect("/login?notice=Check your email to confirm your account. Your selected plan has been saved.");
}
