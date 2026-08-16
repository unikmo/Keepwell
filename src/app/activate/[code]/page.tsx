import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUsd } from "@/lib/plans";
import { activateGiftedMembership } from "./actions";

export default async function ActivatePage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ error?: string }> }) {
  const { code } = await params;
  const { error } = await searchParams;
  const normalized = decodeURIComponent(code).toUpperCase();
  const supabase = await createClient();
  const { data: rows } = await supabase.rpc("lookup_brokerage_activation", { p_code: normalized });
  const gift = Array.isArray(rows) ? rows[0] : null;
  const plan = gift ? { name: gift.plan_name, price_cents: gift.retail_price_cents } : null;
  const valid = gift?.status === "unused";

  return <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12"><div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-7 sm:p-9">
    <Link href="/" className="font-display text-lg text-parchment">Trusted Locksmith</Link>
    <div className="mt-7 font-mono text-[10px] uppercase tracking-wide text-brass">Closing gift activation</div>
    <h1 className="mt-2 font-display text-3xl text-parchment">{valid ? `Activate ${plan?.name ?? "Trusted Locksmith"}` : "Activation code unavailable"}</h1>
    {valid ? <><p className="mt-3 text-sm leading-6 text-parchment-dim">{gift?.brokerage_name ? `${gift.brokerage_name} has provided your first Trusted Locksmith term.` : "A real-estate partner has provided your first Trusted Locksmith term."} You own and control the account after activation. This gifted term does not silently renew on the agent's payment method.</p><div className="mt-5 rounded-xl border border-line bg-ink/30 p-4"><div className="font-mono text-[10px] uppercase text-parchment-dim">Gift code</div><div className="mt-1 font-mono text-lg text-brass">{normalized}</div><div className="mt-1 text-xs text-parchment-dim">Retail plan value {plan ? formatUsd(plan.price_cents) : "—"}/year</div></div>{error&&<div className="mt-4 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}<form action={activateGiftedMembership} className="mt-6 space-y-3"><input type="hidden" name="code" value={normalized}/><input name="name" required placeholder="Full name" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment"/><input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment"/><input name="password" type="password" minLength={8} required placeholder="Create password" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment"/><button className="w-full rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink">Activate gifted membership</button></form><p className="mt-3 text-[11px] leading-5 text-parchment-dim">Digital Access is available immediately. Field-service membership benefits begin after the standard 14-day waiting period.</p></> : <><p className="mt-3 text-sm leading-6 text-parchment-dim">This code is invalid, already redeemed, expired or not yet issued.</p><Link href="/pricing" className="mt-5 inline-flex text-sm text-brass">View Trusted Locksmith memberships →</Link></>}
  </div></div>;
}
