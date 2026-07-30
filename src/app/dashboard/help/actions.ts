"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const TECHS = [
  { name: "Daryl Owusu", jobs: 412, rating: "4.9" },
  { name: "Renata Cole", jobs: 288, rating: "4.8" },
  { name: "Sam Okafor", jobs: 601, rating: "5.0" },
];

export async function createDispatchRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const issue = String(formData.get("issue") ?? "Locked out of my home");
  const tech = TECHS[Math.floor(Math.random() * TECHS.length)];
  const eta = 8 + Math.floor(Math.random() * 12);

  const { data: request, error } = await supabase
    .from("dispatch_requests")
    .insert({
      member_id: user!.id,
      issue,
      status: "dispatched",
      tech_name: tech.name,
      eta_minutes: eta,
    })
    .select()
    .single();

  if (error || !request) {
    redirect(`/dashboard/help?error=${encodeURIComponent(error?.message ?? "Could not dispatch")}`);
  }

  await supabase.from("activity_log").insert({
    member_id: user!.id,
    title: "Dispatch requested",
    meta: issue,
  });

  const { data: member } = await supabase
    .from("members")
    .select("covered_events_used")
    .eq("id", user!.id)
    .maybeSingle();

  await supabase
    .from("members")
    .update({ covered_events_used: (member?.covered_events_used ?? 0) + 1 })
    .eq("id", user!.id);

  revalidatePath("/dashboard");
  redirect(`/dashboard/help/${request.id}`);
}

export async function cancelDispatchRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = String(formData.get("id") ?? "");
  await supabase.from("dispatch_requests").delete().eq("id", id).eq("member_id", user.id);

  const { data: member } = await supabase
    .from("members")
    .select("covered_events_used")
    .eq("id", user.id)
    .maybeSingle();

  await supabase
    .from("members")
    .update({ covered_events_used: Math.max((member?.covered_events_used ?? 1) - 1, 0) })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
