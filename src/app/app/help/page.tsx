import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Keyhole } from "@/components/Keyhole";

export default async function HelpPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subscription }, { data: contacts }, { data: sentinel }] = await Promise.all([
    supabase.from("subscriptions").select("plan_id,benefits_eligible_at,lockbox_status").eq("member_id", user!.id).eq("status", "active").maybeSingle(),
    supabase.from("trusted_contacts").select("id,name,relationship,phone,has_spare_key,can_authorize").eq("member_id", user!.id).order("has_spare_key", { ascending: false }).limit(5),
    supabase.from("vault_items").select("id,name,item_type").eq("member_id", user!.id).limit(5),
  ]);

  const benefitsDate = subscription?.benefits_eligible_at ? new Date(subscription.benefits_eligible_at) : null;
  const benefitsReady = !benefitsDate || benefitsDate.getTime() <= Date.now();
  const keyHolders = (contacts ?? []).filter((c: any) => c.has_spare_key);

  return (
    <div className="flex flex-col items-center text-center">
      <Link href="/app" className="self-start text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <Keyhole className="mt-6 h-14 w-10 text-brass" />
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-brass">Resolve before dispatch</div>
      <h1 className="mt-2 font-display text-3xl font-medium text-parchment">Check Digital Sentinel first.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-parchment-dim">A saved code, spare-key location or nearby key holder can resolve a lockout immediately and at no additional cost.</p>

      <div className="mt-7 w-full max-w-md space-y-3">
        <Option href="/app/vault" active={(sentinel?.length ?? 0) > 0} title={(sentinel?.length ?? 0) > 0 ? `Digital Sentinel · ${sentinel!.length} saved` : "Digital Sentinel is empty"} body={(sentinel?.length ?? 0) > 0 ? "Review saved access instructions, codes or photos." : "Add access details now so they are ready next time."} />
        <Option href="/app/trusted" active={keyHolders.length > 0} title={keyHolders.length > 0 ? `${keyHolders.length} spare-key holder${keyHolders.length === 1 ? "" : "s"}` : "No spare-key holder recorded"} body={keyHolders.length > 0 ? keyHolders.map((c: any) => c.name).join(" · ") : "Add a neighbor, family member or friend who keeps a spare."} />
      </div>

      {keyHolders.length > 0 && <div className="mt-4 w-full max-w-md space-y-2">{keyHolders.filter((c:any)=>c.phone).map((c:any)=><a key={c.id} href={`tel:${c.phone}`} className="flex min-h-11 items-center justify-between rounded-xl border border-verdigris/25 bg-verdigris/[0.06] px-4 text-sm text-parchment"><span>Call {c.name}</span><span className="text-verdigris">{c.phone}</span></a>)}</div>}

      <Link href="/book" className="mt-6 inline-flex w-full max-w-md min-h-12 items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink">Still locked out · see fixed price</Link>
      <p className="mt-2 max-w-md text-[11px] leading-5 text-parchment-dim">One-off Keepwell service is always available at the published all-in price. Membership does not hide or replace the standard service price.</p>
      {!benefitsReady && subscription?.plan_id === "household_plus" && <p className="mt-2 max-w-md text-[11px] leading-5 text-brass">Household+ field benefits such as the included audit/priority layer begin {benefitsDate?.toLocaleDateString()}. You can still use fixed-price service now.</p>}
    </div>
  );
}

function Option({ href, active, title, body }: { href: string; active: boolean; title: string; body: string }) {
  return <Link href={href} className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition ${active ? "border-verdigris/30 bg-verdigris/[0.06]" : "border-line bg-surface"}`}><span><span className="font-medium text-parchment">{title}</span><span className="mt-1 block text-xs leading-5 text-parchment-dim">{body}</span></span><span className={active ? "text-verdigris" : "text-brass"}>→</span></Link>;
}
