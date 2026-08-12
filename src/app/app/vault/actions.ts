"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createSentinelRevealToken, encryptSentinelSecret } from "@/lib/sentinel-crypto";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);

export async function addVaultItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/vault");

  const name = String(formData.get("name") ?? "").trim();
  const icon = String(formData.get("icon") ?? "🔑");
  const itemType = String(formData.get("item_type") ?? "other");
  const notes = String(formData.get("notes") ?? "").trim();
  const secret = String(formData.get("secret") ?? "").trim();
  const photo = formData.get("photo");

  if (!name) redirect("/app/vault?error=Name is required.");

  let ciphertext: string | null = null;
  if (secret) {
    try {
      ciphertext = encryptSentinelSecret(secret);
    } catch (error) {
      redirect(`/app/vault?error=${encodeURIComponent(error instanceof Error ? error.message : "Digital Sentinel encryption is unavailable.")}`);
    }
  }

  const { data: itemId, error } = await supabase.rpc("sentinel_add_item", {
    p_name: name,
    p_icon: icon,
    p_item_type: itemType,
    p_notes: notes || null,
    p_secret_ciphertext: ciphertext,
  });

  if (error || !itemId) redirect(`/app/vault?error=${encodeURIComponent(error?.message ?? "Could not save item")}`);

  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) redirect("/app/vault?error=Photo must be 5 MB or smaller.");
    if (photo.type && !ALLOWED_TYPES.has(photo.type)) redirect("/app/vault?error=Photo must be JPEG, PNG, WebP or HEIC.");
    const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${itemId}/${Date.now()}-${safeName}`;
    const bytes = Buffer.from(await photo.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("keepwell-sentinel").upload(path, bytes, {
      contentType: photo.type || "image/jpeg",
      upsert: false,
    });
    if (uploadError) {
      redirect(`/app/vault?error=${encodeURIComponent("The access item was saved, but the photo upload failed. You can remove the item and try again.")}`);
    }
    await supabase.rpc("sentinel_set_photo_path", { p_item_id: itemId, p_photo_path: path });
  }

  revalidatePath("/app/vault");
  revalidatePath("/app");
  redirect("/app/vault?notice=Saved to Digital Sentinel.");
}

export async function removeVaultItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  const { data: item } = await supabase.from("vault_items").select("photo_path").eq("id", id).eq("member_id", user.id).maybeSingle();
  if (item?.photo_path) await supabase.storage.from("keepwell-sentinel").remove([item.photo_path]);
  await supabase.from("vault_items").delete().eq("id", id).eq("member_id", user.id);
  revalidatePath("/app/vault");
  revalidatePath("/app");
}


export async function revealSentinelSecret(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login?next=/app/vault");

  const itemId = String(formData.get("item_id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!itemId || !password) redirect("/app/vault?error=Enter your account password to reveal a saved access secret.");

  const { error: authError } = await supabase.auth.signInWithPassword({ email: user.email, password });
  if (authError) redirect("/app/vault?error=Password verification failed.");

  const { data: item } = await supabase
    .from("vault_items")
    .select("id")
    .eq("id", itemId)
    .eq("member_id", user.id)
    .maybeSingle();
  if (!item) redirect("/app/vault?error=Digital Sentinel item not found.");

  const token = createSentinelRevealToken(user.id, itemId, 120);
  redirect(`/app/vault?reveal_token=${encodeURIComponent(token)}`);
}
