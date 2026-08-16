import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatUsd } from "@/lib/plans";
import { createBrokerageAccount, createBulkMembershipOrder } from "./actions";

export default async function BrokeragePage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/brokerage");
  const { data: membership } = await supabase.from("brokerage_members").select("brokerage_id,role,brokerage:brokerage_accounts(*)").eq("user_id", user.id).limit(1).maybeSingle();
  const brokerage = membership?.brokerage as any;
  const brokerageId = membership?.brokerage_id;
  const [{ data: orders }, { data: codes }, { data: plans }] = brokerageId ? await Promise.all([
    supabase.from("brokerage_bulk_orders").select("*").eq("brokerage_id", brokerageId).order("created_at", { ascending: false }),
    supabase.from("brokerage_activation_codes").select("*").eq("brokerage_id", brokerageId).order("created_at", { ascending: false }).limit(200),
    supabase.from("plans").select("id,name,price_cents").order("sort_order"),
  ]) : [{ data: [] as any[] }, { data: [] as any[] }, await supabase.from("plans").select("id,name,price_cents").order("sort_order")];

  return <div className="flex min-h-screen flex-col"><Nav /><main className="flex-1 py-12"><div className="mx-auto max-w-6xl px-6">
    <div className="eyebrow">Real-estate partner sales</div><h1 className="mt-2 font-display text-4xl text-parchment">Bulk Trusted Locksmith memberships for closings</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">Buy memberships in batches, assign activation codes to buyers, and let each buyer own their Trusted Locksmith account. Gifted terms do not silently renew on the agent's payment method.</p>
    {notice && <div className="mt-5 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{notice}</div>}{error && <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}
    {!brokerageId ? <form action={createBrokerageAccount} className="mt-8 max-w-xl rounded-2xl border border-line bg-surface p-6"><h2 className="font-display text-2xl text-parchment">Create brokerage workspace</h2><input name="brokerage_name" required placeholder="Brokerage / team name" className="mt-4 w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment" /><button className="mt-3 rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Create workspace</button></form> : <>
      <div className="mt-7 rounded-2xl border border-line bg-surface p-5"><div className="font-mono text-[10px] uppercase tracking-wide text-parchment-dim">Brokerage</div><div className="mt-2 font-display text-2xl text-parchment">{brokerage?.name}</div></div>
      <form action={createBulkMembershipOrder} className="mt-7 rounded-2xl border border-line bg-surface p-6"><input type="hidden" name="brokerage_id" value={brokerageId} /><h2 className="font-display text-2xl text-parchment">Create bulk order</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><select name="plan_id" defaultValue="household" className="rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment">{(plans??[]).map((p:any)=><option key={p.id} value={p.id}>{p.name} · {formatUsd(p.price_cents)}/yr retail</option>)}</select><select name="quantity" defaultValue="25" className="rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment"><option value="10">10 memberships</option><option value="25">25 memberships</option><option value="50">50 memberships</option><option value="100">100 memberships</option></select><button className="rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Create order</button></div><p className="mt-3 text-xs leading-5 text-parchment-dim">Until payment processing is connected, the order enters pending invoice. Activation codes are generated only after Trusted Locksmith marks the order paid. Launch bulk orders use published membership pricing; any future volume discount should be configured deliberately rather than assumed.</p></form>
      <section className="mt-8"><h2 className="font-display text-2xl text-parchment">Orders</h2><div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">{(orders??[]).length===0?<div className="p-5 text-sm text-parchment-dim">No bulk orders yet.</div>:(orders??[]).map((o:any)=><div key={o.id} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto]"><div><div className="text-sm font-medium text-parchment">{o.quantity} × {o.plan_id} · {formatUsd(o.total_price_cents)}</div><div className="mt-1 text-xs text-parchment-dim">{o.discount_pct > 0 ? `${o.discount_pct}% partner discount · ` : ""}{formatUsd(o.unit_price_cents)} each</div></div><span className="font-mono text-[10px] uppercase text-parchment-dim">{o.status}</span></div>)}</div></section>
      <section className="mt-8"><div className="flex items-center justify-between"><h2 className="font-display text-2xl text-parchment">Activation codes</h2><span className="font-mono text-xs text-parchment-dim">{(codes??[]).length}</span></div><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(codes??[]).length===0?<div className="rounded-xl border border-line bg-surface p-5 text-sm text-parchment-dim">Codes appear after a paid order is activated.</div>:(codes??[]).map((c:any)=><div key={c.id} className="rounded-xl border border-line bg-surface p-4"><div className="font-mono text-sm text-brass">{c.code}</div><div className="mt-1 text-[10px] uppercase text-parchment-dim">{c.status}</div></div>)}</div></section>
    </>}
    <Link href="/for-real-estate-agents" className="mt-8 inline-flex text-sm text-brass">← Real-estate partnership overview</Link>
  </div></main><Footer /></div>;
}
