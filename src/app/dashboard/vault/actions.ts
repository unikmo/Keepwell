"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addVaultItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") ?? "");
  const icon = String(formData.get("icon") ?? "🔑");
  const meta = String(formData.get("meta") ?? "");

  await supabase.from("vault_items").insert({ member_id: user.id, name, icon, meta });
  await supabase
    .from("activity_log")
    .insert({ member_id: user.id, title: `${name} added to vault`, meta: "by you" });

  revalidatePath("/dashboard/vault");
  revalidatePath("/dashboard");
}

export async function removeVaultItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  await supabase.from("vault_items").delete().eq("id", id).eq("member_id", user.id);

  revalidatePath("/dashboard/vault");
  revalidatePath("/dashboard");
}
