import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatServicePrice, LOCK_AUDIT } from "@/lib/service-menu";
import { acceptAuditOffer, requestLockAudit } from "./actions";

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subscription }, { data: audits }] = await Promise.all([
    supabase.from("subscriptions").select("*,plan:plans(*)").eq("member_id", user!.id).eq("status", "active").maybeSingle(),
    supabase.from("lock_audits").select("*").eq("member_id", user!.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const plan = subscription?.plan as any;
  const latest = audits?.[0] as any;
  const { data: offer } = latest ? await supabase.from("audit_offers").select("*").eq("audit_id", latest.id).order("created_at", { ascending: false }).limit(1).maybeSingle() : { data: null as any };
  const benefitsReady = !subscription?.benefits_eligible_at || new Date(subscription.benefits_eligible_at) <= new Date();
  const auditReady = !subscription?.next_audit_eligible_at || new Date(`${subscription.next_audit_eligible_at}T23:59:59`) <= new Date();
  const firstAudit = !subscription?.last_audit_completed_at;
  const activeAudit = Boolean(latest?.status?.match(/requested|offered|accepted|report_submitted/));
  const canRequest = plan?.id === "household_plus" && !activeAudit && (firstAudit || auditReady);
  const earliestFirstAuditDate = subscription?.benefits_eligible_at ? new Date(subscription.benefits_eligible_at).toISOString().slice(0, 10) : undefined;

  return (
    <div>
      <Link href="/app" className="text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[.13em] text-brass">Household+ benefit</div>
      <h1 className="mt-2 font-display text-3xl text-parchment">Lock & Access Audit</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">One audit is included every three years with Household+. The independent provider inspects and submits a standardized report only. They do not quote, sell or pressure you into remedial work during the visit.</p>

      {notice && <div className="mt-5 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{notice}</div>}
      {error && <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <Card label="Standalone value" value={formatServicePrice(LOCK_AUDIT.customerPriceCents)} />
        <Card label="Household+" value="Included / 3 years" />
        <Card label="Provider role" value="Inspect + report" />
      </div>

      {plan?.id !== "household_plus" ? <div className="mt-7 rounded-2xl border border-line bg-surface p-6"><div className="font-medium text-parchment">Household+ required</div><p className="mt-2 text-sm text-parchment-dim">Upgrade to Household+ to include one Lock & Access Audit every three years.</p><Link href="/pricing" className="mt-4 inline-flex text-sm text-brass">Compare plans →</Link></div> : !firstAudit && !auditReady ? <div className="mt-7 rounded-2xl border border-line bg-surface p-6"><div className="font-medium text-parchment">Next included audit</div><p className="mt-2 text-sm text-parchment-dim">Available {new Date(`${subscription.next_audit_eligible_at}T12:00:00`).toLocaleDateString()} — three years after the previous completed audit.</p></div> : canRequest ? <form action={requestLockAudit} className="mt-7 space-y-3 rounded-2xl border border-line bg-surface p-6"><h2 className="font-display text-2xl text-parchment">{firstAudit && !benefitsReady ? "Schedule your first included audit" : "Request your included audit"}</h2>{firstAudit && !benefitsReady && <p className="text-xs leading-5 text-brass">You can schedule now. The audit itself cannot take place before {new Date(subscription.benefits_eligible_at).toLocaleDateString()}.</p>}<input name="property_address" required placeholder="Property address" className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment" /><label className="block text-xs text-parchment-dim">Preferred date (optional)<input type="date" name="preferred_date" min={firstAudit ? earliestFirstAuditDate : undefined} className="mt-1 w-full rounded-xl border border-line bg-surface-raised px-3 py-2.5 text-sm text-parchment" /></label><button className="w-full rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink">{firstAudit && !benefitsReady ? "Schedule audit" : "Request audit"}</button></form> : null}

      {latest && <div className="mt-7 rounded-2xl border border-line bg-surface p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl text-parchment">Latest audit</h2><span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-parchment-dim">{latest.status}</span></div><p className="mt-3 text-sm text-parchment-dim">{latest.property_address}</p>{latest.provider_report && <div className="mt-5 rounded-xl border border-verdigris/20 bg-verdigris/[0.05] p-4"><div className="font-medium text-parchment">Provider report received</div><p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-parchment-dim">{latest.customer_report_summary || "Keepwell is reviewing the provider findings before issuing any recommendation."}</p></div>}</div>}

      {offer && <div className="mt-5 rounded-2xl border border-brass/25 bg-brass/[0.06] p-6"><div className="font-mono text-[10px] uppercase tracking-wide text-brass">Official Keepwell follow-up offer</div><h2 className="mt-2 font-display text-2xl text-parchment">{offer.title}</h2><p className="mt-2 text-sm leading-6 text-parchment-dim">{offer.description}</p><div className="mt-4 font-mono text-3xl text-brass">{formatServicePrice(offer.customer_price_cents)}</div><p className="mt-2 text-xs text-parchment-dim">This offer comes from Keepwell after review of the provider's report. The audit provider was not permitted to sell or quote this work during the visit.</p>{offer.status === "offered" && <form action={acceptAuditOffer} className="mt-5"><input type="hidden" name="offer_id" value={offer.id} /><button className="rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Approve follow-up work</button></form>}</div>}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-line bg-surface p-4"><div className="font-mono text-[9px] uppercase tracking-wide text-parchment-dim">{label}</div><div className="mt-2 text-lg text-parchment">{value}</div></div>; }
