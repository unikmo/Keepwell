"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_QUANTITIES = new Set([10, 25, 50, 100]);

export async function createBrokerageAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/brokerage");
  const name = String(formData.get("brokerage_name") ?? "").trim();
  if (!name) redirect("/brokerage?error=Brokerage name is required.");
  const { data: account, error } = await supabase.from("brokerage_accounts").insert({ name, created_by: user.id }).select().single();
  if (error || !account) redirect(`/brokerage?error=${encodeURIComponent(error?.message ?? "Could not create account")}`);
  await supabase.from("brokerage_members").insert({ brokerage_id: account.id, user_id: user.id, role: "admin" });
  revalidatePath("/brokerage");
  redirect("/brokerage?notice=Brokerage workspace created.");
}

export async function createBulkMembershipOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/brokerage");
  const brokerageId = String(formData.get("brokerage_id") ?? "");
  const planId = String(formData.get("plan_id") ?? "household");
  const quantity = Number(formData.get("quantity") ?? 0);
  if (!ALLOWED_QUANTITIES.has(quantity) || !["individual","household","household_plus"].includes(planId)) redirect("/brokerage?error=Choose a valid bulk package.");

  const { data: plan } = await supabase.from("plans").select("price_cents").eq("id", planId).maybeSingle();
  if (!plan) redirect("/brokerage?error=Plan not found.");
  const discountPct = 0;
  const unitPrice = plan.price_cents;
  const { error } = await supabase.from("brokerage_bulk_orders").insert({ brokerage_id: brokerageId, created_by: user.id, plan_id: planId, quantity, unit_price_cents: unitPrice, total_price_cents: unitPrice * quantity, discount_pct: discountPct, status: "pending_invoice" });
  if (error) redirect(`/brokerage?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/brokerage");
  redirect("/brokerage?notice=Bulk order created. Keepwell will issue the invoice; activation codes are released after payment confirmation.");
}
