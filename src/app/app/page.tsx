import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Keyhole } from "@/components/Keyhole";

function greetingWord() {
  const hour = new Date().getHours();
  if (hour < 5) return "Late night";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: member }, { data: subscription }, { data: sentinelItems }, { data: contacts }, { data: activity }] = await Promise.all([
    supabase.from("members").select("*").eq("id", user!.id).maybeSingle(),
    supabase.from("subscriptions").select("*, plan:plans(*)").eq("member_id", user!.id).eq("status", "active").maybeSingle(),
    supabase.from("vault_items").select("id").eq("member_id", user!.id),
    supabase.from("trusted_contacts").select("id").eq("member_id", user!.id),
    supabase.from("activity_log").select("*").eq("member_id", user!.id).order("created_at", { ascending: false }).limit(5),
  ]);

  const firstName = (member?.full_name ?? user?.email ?? "there").split(" ")[0];
  const plan = subscription?.plan as unknown as { id: string; name: string; priority_dispatch?: boolean; included_audit_interval_years?: number | null } | undefined;
  const planName = plan?.name ?? member?.plan ?? "Household";
  const benefitsDate = subscription?.benefits_eligible_at ? new Date(subscription.benefits_eligible_at) : null;
  const benefitsReady = !benefitsDate || benefitsDate.getTime() <= Date.now();
  const auditDate = subscription?.next_audit_eligible_at ? new Date(`${subscription.next_audit_eligible_at}T12:00:00`) : null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-parchment">{greetingWord()}, {firstName}</h1>
        <div className="h-9 w-9 rounded-full border border-line bg-surface-raised" />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-surface-raised to-surface p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-verdigris/35 bg-verdigris/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris"><span className="h-1.5 w-1.5 rounded-full bg-verdigris" />Membership active</span>
        <div className="mt-3 font-display text-lg font-medium text-parchment">{planName}</div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-parchment-dim">Digital Sentinel is available immediately. Keep your access details and trusted key holders ready before an emergency happens.</p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line/60 pt-4">
          <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${benefitsReady ? "bg-verdigris/10 text-verdigris" : "bg-brass/10 text-brass"}`}>{benefitsReady ? "Field benefits active" : `Field benefits start ${benefitsDate?.toLocaleDateString()}`}</span>
          {plan?.id === "household_plus" && auditDate && <span className="rounded-full bg-brass/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-brass">Audit available {auditDate.toLocaleDateString()}</span>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/app/vault" className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm font-medium text-parchment transition hover:border-brass/40"><span className="text-lg">🔐</span>Digital Sentinel<span className="font-mono text-[11px] font-normal text-parchment-dim">{sentinelItems?.length ?? 0} saved access items</span></Link>
        <Link href="/app/trusted" className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm font-medium text-parchment transition hover:border-brass/40"><span className="text-lg">🤝</span>Trusted access<span className="font-mono text-[11px] font-normal text-parchment-dim">{contacts?.length ?? 0} people</span></Link>
        {plan?.id === "household_plus" && <Link href="/app/audit" className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm font-medium text-parchment transition hover:border-brass/40"><span className="text-lg">🛡️</span>Lock & Access Audit<span className="font-mono text-[11px] font-normal text-parchment-dim">Included every 3 years</span></Link>}
      </div>

      <div className="mt-8 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">Recent activity</div>
      <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {activity && activity.length > 0 ? activity.map((a) => <div key={a.id} className="flex items-center justify-between py-3 text-sm"><div><div className="text-parchment">{a.title}</div>{a.meta && <div className="mt-0.5 text-xs text-parchment-dim">{a.meta}</div>}</div></div>) : <div className="py-6 text-center text-sm text-parchment-dim">Nothing yet — your activity will show up here.</div>}
      </div>

      <Link href="/app/help" className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-ember shadow-[0_8px_24px_-4px_rgba(225,97,61,0.6)] transition hover:brightness-110" title="Get help"><Keyhole className="h-5 w-4 text-ink" /></Link>
    </div>
  );
}
