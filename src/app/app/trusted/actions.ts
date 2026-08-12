"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTrustedContact(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const hasSpareKey = String(formData.get("has_spare_key") ?? "") === "on";
  const canAuthorize = String(formData.get("can_authorize") ?? "") === "on";
  const accessNote = String(formData.get("access_note") ?? "").trim();
  if (!name) return;

  const permission = hasSpareKey ? "Key holder" : canAuthorize ? "Can authorize" : "Emergency contact";

  await supabase.from("trusted_contacts").insert({
    member_id: user.id,
    name,
    relationship,
    permission,
    phone: phone || null,
    email: email || null,
    has_spare_key: hasSpareKey,
    can_authorize: canAuthorize,
    access_note: accessNote || null,
  });
  await supabase.from("activity_log").insert({ member_id: user.id, title: `${name} added as trusted contact`, meta: permission });

  revalidatePath("/app/trusted");
  revalidatePath("/app/help");
  revalidatePath("/app");
}

export async function removeTrustedContact(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const id = String(formData.get("id") ?? "");
  await supabase.from("trusted_contacts").delete().eq("id", id).eq("member_id", user.id);
  revalidatePath("/app/trusted");
  revalidatePath("/app/help");
  revalidatePath("/app");
}
