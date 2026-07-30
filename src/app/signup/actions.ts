"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "");
  const plan = String(formData.get("plan") ?? "Household");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, plan },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    await supabase
      .from("members")
      .upsert({ id: data.user.id, full_name: fullName, plan }, { onConflict: "id" });
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/login?notice=Check your email to confirm your account.");
}
