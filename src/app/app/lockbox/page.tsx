import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUsd } from "@/lib/plans";
import { purchaseLockboxAddon } from "./actions";

export default async function LockboxAddonPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: subscription } = await supabase.from("subscriptions").select("lockbox_status,plan:plans(*)").eq("member_id", user!.id).eq("status", "active").maybeSingle();
  const plan = subscription?.plan as unknown as { lockbox_mode: string; lockbox_addon_price_cents: number | null } | undefined;
  const status = subscription?.lockbox_status ?? "none";
  const priceCents = plan?.lockbox_addon_price_cents ?? 1999;

  return <div className="flex flex-col items-center text-center">
    <Link href="/app/trusted" className="self-start text-xs text-parchment-dim hover:text-parchment">← Back</Link>
    <div className="mt-6 text-3xl">🔒</div>
    <h1 className="mt-4 font-display text-2xl font-medium text-parchment">Physical lockbox</h1>
    <p className="mt-2 max-w-md text-sm leading-relaxed text-parchment-dim">A physical lockbox can create another self-resolution path. Codes and access instructions belong in Digital Sentinel; hardware fulfillment is tracked separately.</p>
    {notice && <div className="mt-5 w-full max-w-md rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{notice}</div>}
    {status !== "none" ? <div className="mt-8 w-full max-w-sm rounded-xl border border-line bg-surface p-5 text-sm text-parchment"><div className="font-medium">Lockbox status</div><div className="mt-2 font-mono text-xs uppercase text-brass">{status.replaceAll("_", " ")}</div></div> : <form action={purchaseLockboxAddon} className="mt-8 w-full max-w-sm"><div className="rounded-xl border border-line bg-surface p-5 text-left"><div className="flex items-baseline justify-between"><span className="text-sm font-medium text-parchment">Optional physical lockbox</span><span className="font-mono text-lg text-brass">{formatUsd(priceCents)}</span></div><p className="mt-1 text-xs text-parchment-dim">One-time add-on when fulfillment/payment is available.</p></div><button className="mt-4 w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink">Request lockbox add-on</button><p className="mt-2 text-[11px] text-parchment-dim">Payment is not connected yet. This records a request only and does not claim the item has shipped.</p></form>}
  </div>;
}
