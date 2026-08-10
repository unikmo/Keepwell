"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerProvider(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const provider = String(formData.get("provider") ?? "").trim();

  if (!name || !email || password.length < 8) {
    redirect(`/providers/register?provider=${encodeURIComponent(provider)}&error=${encodeURIComponent("Name, email, and an 8+ character password are required.")}`);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, role: "provider" } },
  });

  if (error) {
    redirect(`/providers/register?provider=${encodeURIComponent(provider)}&error=${encodeURIComponent(error.message)}`);
  }

  const next = provider ? `/providers/claim?provider=${encodeURIComponent(provider)}` : "/providers/claim";

  if (data.session) redirect(next);

  redirect(`/login?notice=${encodeURIComponent("Check your email to confirm the provider account, then log in to finish the claim.")}&next=${encodeURIComponent(next)}`);
}
