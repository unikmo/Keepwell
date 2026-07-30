"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitContact(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const topic = String(formData.get("topic") ?? "General");
  const message = String(formData.get("message") ?? "");

  const { error } = await supabase.from("contact_messages").insert({ name, email, topic, message });

  if (error) {
    redirect(`/contact?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/contact?sent=1");
}
