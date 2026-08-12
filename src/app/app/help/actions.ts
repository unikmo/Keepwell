"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDispatchRequest() {
  redirect("/book");
}

export async function cancelDispatchRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  await supabase.from("dispatch_requests").delete().eq("id", id).eq("member_id", user.id);
  await supabase.from("activity_log").insert({ member_id: user.id, title: "Service request cancelled", meta: id });
  revalidatePath("/app");
  redirect("/app");
}
