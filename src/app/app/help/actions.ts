"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDispatchRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const issue = String(formData.get("issue") ?? "Locked out of my home");

  const { data: request, error } = await supabase
    .from("dispatch_requests")
    .insert({
      member_id: user!.id,
      issue,
      // Preserve the current database shape without inventing a technician.
      // A marketplace-state migration should replace this placeholder once
      // provider acceptance is implemented end-to-end.
      status: "dispatched",
      tech_name: "Matching provider",
      eta_minutes: 0,
    })
    .select()
    .single();

  if (error || !request) {
    redirect(`/app/help?step=dispatch&error=${encodeURIComponent(error?.message ?? "Could not create the request")}`);
  }

  await supabase.from("activity_log").insert({ member_id: user!.id, title: "Service request created", meta: issue });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, plan_id")
    .eq("member_id", user!.id)
    .eq("status", "active")
    .maybeSingle();

  if (subscription) {
    // Do not consume the event at request creation. Consumption belongs at
    // the real accepted/completed marketplace event once that flow exists.
    await supabase.from("analytics_events").insert({
      event_name: "member_service_request_created",
      member_id: user!.id,
      plan_id: subscription.plan_id,
      metadata: { issue },
    });
  }

  revalidatePath("/app");
  redirect(`/app/help/${request.id}`);
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
