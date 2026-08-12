import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatServicePrice, LOCK_AUDIT } from "@/lib/service-menu";
import { issueAuditOffer, markBulkOrderPaid, offerV4Request, publishAuditReview } from "./actions";

export default async function AdminV4({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/v4");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/");

  const [{ data: providers }, { data: audits }, { data: auditOffers }, { data: pmRequests }, { data: bulkOrders }, { data: offers }] = await Promise.all([
    supabase.from("provider_profiles").select("id,business_name,claim_status,is_available").eq("claim_status", "verified").order("business_name"),
    supabase.from("lock_audits").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("audit_offers").select("*,audit:lock_audits(property_address)").order("created_at", { ascending: false }).limit(100),
    supabase.from("pm_service_requests").select("*,property:pm_properties(name,address),organization:pm_organizations(name)").order("created_at", { ascending: false }).limit(100),
    supabase.from("brokerage_bulk_orders").select("*,brokerage:brokerage_accounts(name)").order("created_at", { ascending: false }).limit(100),
    supabase.from("provider_job_offers").select("*").order("offered_at", { ascending: false }).limit(200),
  ]);
  const verified = providers ?? [];

  return <div className="flex min-h-screen flex-col"><Nav /><main className="flex-1 py-10"><div className="mx-auto max-w-7xl px-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">V4 operations</div><h1 className="mt-2 font-display text-4xl text-parchment">Audit, property-manager & brokerage loops</h1></div><Link href="/admin" className="text-sm text-brass">Core network dashboard →</Link></div>
    {notice && <Notice>{notice}</Notice>}{error && <ErrorBox>{error}</ErrorBox>}

    <section className="mt-9"><h2 className="font-display text-2xl text-parchment">Lock & Access Audits</h2><div className="mt-3 space-y-4">
      {(audits??[]).length===0?<Empty>No audit requests.</Empty>:(audits??[]).map((a:any)=>{
        const existing=(offers??[]).filter((o:any)=>o.request_type==="lock_audit"&&o.request_id===a.id);
        return <div key={a.id} className="rounded-2xl border border-line bg-surface p-5"><div className="grid gap-5 xl:grid-cols-[1fr_1fr]"><div><div className="font-medium text-parchment">{a.property_address}</div><div className="mt-1 text-xs text-parchment-dim">Status {a.status} · preferred {a.preferred_date??"open"} · {existing.length} provider offer(s)</div>{a.provider_report && <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-xl bg-ink/40 p-3 text-xs text-parchment-dim">{JSON.stringify(a.provider_report,null,2)}</pre>}</div><div className="space-y-3">
          {["requested","offered"].includes(a.status) && <ProviderOfferForm requestType="lock_audit" requestId={a.id} providers={verified} payout={LOCK_AUDIT.providerPayoutCents} label="Offer audit" />}
          {a.status==="report_submitted" && <form action={publishAuditReview} className="space-y-2"><input type="hidden" name="audit_id" value={a.id}/><textarea name="customer_summary" rows={3} required placeholder="Customer-facing Keepwell summary of the audit" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/><button className="rounded-full border border-brass/40 px-4 py-2 text-xs font-semibold text-brass">Review report + reset 3-year clock</button></form>}
          {["reviewed","quoted"].includes(a.status) && <form action={issueAuditOffer} className="space-y-2"><input type="hidden" name="audit_id" value={a.id}/><input name="title" defaultValue="Recommended access work" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/><textarea name="description" rows={2} required placeholder="Official Keepwell recommendation and scope" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/><div className="grid gap-2 sm:grid-cols-2"><input name="customer_price_cents" type="number" min="1" required placeholder="Customer price cents" className="rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/><input name="provider_payout_cents" type="number" min="1" placeholder="Target provider payout cents" className="rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/></div><button className="rounded-full bg-brass px-4 py-2 text-xs font-semibold text-ink">Issue official Keepwell offer</button></form>}
        </div></div></div>;
      })}
    </div></section>

    <section className="mt-10"><h2 className="font-display text-2xl text-parchment">Customer-approved audit follow-up work</h2><p className="mt-2 max-w-3xl text-xs leading-5 text-parchment-dim">Only customer-approved offers can be routed here. The audit provider never sells directly in the home.</p><div className="mt-3 space-y-3">
      {(auditOffers??[]).filter((x:any)=>x.status==="accepted").length===0?<Empty>No approved audit follow-up work waiting for provider routing.</Empty>:(auditOffers??[]).filter((x:any)=>x.status==="accepted").map((x:any)=>{const existing=(offers??[]).filter((o:any)=>o.request_type==="audit_followup"&&o.request_id===x.id); return <div key={x.id} className="rounded-2xl border border-line bg-surface p-5"><div className="grid gap-5 xl:grid-cols-[1fr_1fr]"><div><div className="font-medium text-parchment">{x.title}</div><div className="mt-1 text-xs text-parchment-dim">{x.audit?.property_address} · customer approved {formatServicePrice(x.customer_price_cents)} · {existing.length} provider offer(s)</div><p className="mt-2 text-xs leading-5 text-parchment-dim">{x.description}</p></div><ProviderOfferForm requestType="audit_followup" requestId={x.id} providers={verified} payout={x.target_provider_payout_cents??6000} label="Route approved work" /></div></div>;})}
    </div></section>

    <section className="mt-10"><h2 className="font-display text-2xl text-parchment">Property-manager requests</h2><div className="mt-3 space-y-3">
      {(pmRequests??[]).length===0?<Empty>No property-manager requests.</Empty>:(pmRequests??[]).map((r:any)=><div key={r.id} className="rounded-2xl border border-line bg-surface p-5"><div className="grid gap-5 xl:grid-cols-[1fr_1fr]"><div><div className="font-medium text-parchment">{r.organization?.name} · {r.property?.name} {r.unit_label?`· ${r.unit_label}`:""}</div><div className="mt-1 text-xs text-parchment-dim">{r.service_type} · {r.property?.address} · {r.status}</div>{r.notes&&<p className="mt-2 text-xs text-parchment-dim">{r.notes}</p>}</div>{["requested","offered"].includes(r.status)&&<ProviderOfferForm requestType="pm_request" requestId={r.id} providers={verified} payout={6000} label="Offer job" />}</div></div>)}
    </div></section>

    <section className="mt-10"><h2 className="font-display text-2xl text-parchment">Brokerage bulk orders</h2><div className="mt-3 space-y-3">
      {(bulkOrders??[]).length===0?<Empty>No brokerage orders.</Empty>:(bulkOrders??[]).map((o:any)=><div key={o.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-medium text-parchment">{o.brokerage?.name} · {o.quantity} × {o.plan_id}</div><div className="mt-1 text-xs text-parchment-dim">{formatServicePrice(o.total_price_cents)} total · {o.discount_pct > 0 ? `${o.discount_pct}% partner discount · ` : ""}{o.status}</div></div>{o.status==="pending_invoice"&&<form action={markBulkOrderPaid}><input type="hidden" name="order_id" value={o.id}/><button className="rounded-full bg-brass px-4 py-2 text-xs font-semibold text-ink">Mark paid + issue codes</button></form>}</div>)}
    </div></section>
  </div></main><Footer /></div>;
}

function ProviderOfferForm({requestType,requestId,providers,payout,label}:{requestType:string;requestId:string;providers:any[];payout:number;label:string}) { return <form action={offerV4Request} className="grid gap-2 sm:grid-cols-[1fr_110px_auto]"><input type="hidden" name="request_type" value={requestType}/><input type="hidden" name="request_id" value={requestId}/><select name="provider_id" required className="rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"><option value="">Choose provider</option>{providers.map((p:any)=><option key={p.id} value={p.id}>{p.business_name}{p.is_available?" · available":""}</option>)}</select><input name="payout_cents" type="number" min="1" defaultValue={payout} className="rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"/><button className="rounded-full bg-brass px-4 py-2 text-xs font-semibold text-ink">{label}</button></form>; }
function Empty({children}:{children:ReactNode}) { return <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-parchment-dim">{children}</div>; }
function Notice({children}:{children:ReactNode}) { return <div className="mt-5 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{children}</div>; }
function ErrorBox({children}:{children:ReactNode}) { return <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{children}</div>; }
