"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function activateGiftedMembership(formData: FormData) {
  const supabase = await createClient();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("name") ?? "").trim();
  if (!code || !email || !password) redirect(`/activate/${encodeURIComponent(code)}?error=Complete all required fields.`);

  const { data: codeRows } = await supabase.rpc("lookup_brokerage_activation", { p_code: code });
  const codeRow = Array.isArray(codeRows) ? codeRows[0] : null;
  if (!codeRow || codeRow.status !== "unused") redirect(`/activate/${encodeURIComponent(code)}?error=This activation code is invalid or already used.`);

  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, bulk_code: code } } });
  if (error) redirect(`/activate/${encodeURIComponent(code)}?error=${encodeURIComponent(error.message)}`);
  if (data.session) redirect("/app");
  redirect("/login?notice=Check your email to confirm your gifted Keepwell membership.");
}
