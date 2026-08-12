import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { submitAuditReport } from "./actions";

export default async function ProviderAuditPage({ params, searchParams }: { params: Promise<{ offerId: string }>; searchParams: Promise<{ notice?: string; error?: string }> }) {
  const { offerId } = await params;
  const { notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/provider/audits/${offerId}`);

  const { data: provider } = await supabase.from("provider_profiles").select("id,business_name").eq("claimed_user_id", user.id).eq("claim_status", "verified").maybeSingle();
  if (!provider) redirect("/provider?error=Verified provider account required.");
  const { data: offer } = await supabase.from("provider_job_offers").select("*").eq("id", offerId).eq("provider_id", provider.id).eq("request_type", "lock_audit").maybeSingle();
  if (!offer || offer.status !== "accepted") redirect("/provider?error=Accepted audit offer required.");
  const { data: audit } = await supabase.from("lock_audits").select("*").eq("id", offer.request_id).maybeSingle();
  if (!audit) redirect("/provider?error=Audit record not found.");

  return <div className="mx-auto max-w-3xl px-5 py-12">
    <Link href="/provider" className="text-xs text-parchment-dim">← Provider dashboard</Link>
    <div className="mt-4 font-mono text-[10px] uppercase tracking-wide text-brass">Lock & Access Audit</div>
    <h1 className="mt-2 font-display text-3xl text-parchment">Inspection report</h1>
    <p className="mt-2 text-sm text-parchment-dim">{audit.property_address}</p>
    <div className="mt-5 rounded-xl border border-brass/25 bg-brass/[0.06] p-4 text-sm leading-6 text-parchment-dim"><strong className="text-parchment">No-selling rule:</strong> inspect, document and submit the report to Keepwell. Do not quote, upsell, take a deposit or sell remedial work during the audit. Keepwell issues the official customer offer after review.</div>
    {notice && <div className="mt-5 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{notice}</div>}
    {error && <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}
    {audit.report_submitted_at ? <div className="mt-7 rounded-2xl border border-line bg-surface p-6"><div className="font-medium text-parchment">Report submitted</div><p className="mt-2 text-sm text-parchment-dim">Keepwell now controls review, recommendations and any customer quote.</p></div> : <form action={submitAuditReport} className="mt-7 space-y-4 rounded-2xl border border-line bg-surface p-6">
      <input type="hidden" name="offer_id" value={offerId} />
      <Field name="exterior_doors" label="Exterior doors & lock condition" />
      <Field name="cylinders" label="Cylinders / rekey observations" />
      <Field name="strike_plates" label="Strike plates / frame observations" />
      <Field name="smart_access" label="Smart/keypad access observations" />
      <Field name="spare_key_risk" label="Spare-key / access-control observations" />
      <Field name="recommendations" label="Recommended remedial actions for Keepwell review" rows={5} />
      <label className="flex items-center gap-2 text-sm text-parchment"><input type="checkbox" name="urgent_issue" value="yes" className="accent-brass" /> Flag a condition that Keepwell should review urgently</label>
      <button className="w-full rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink">Submit report to Keepwell</button>
    </form>}
  </div>;
}

function Field({ name, label, rows = 3 }: { name: string; label: string; rows?: number }) { return <label className="block"><span className="mb-1 block text-xs text-parchment-dim">{label}</span><textarea name={name} rows={rows} required maxLength={2000} className="w-full rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" /></label>; }
