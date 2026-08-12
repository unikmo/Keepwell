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
        membership_signup: true,
      },
    },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  // Membership provisioning is handled by the database auth trigger. This is
  // reliable even when email confirmation means signUp does not return a session.
  if (data.session) redirect("/app");
  redirect("/login?notice=Check your email to confirm your account. Your membership setup is reserved from signup.");
}
