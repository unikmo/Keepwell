import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addTrustedContact, removeTrustedContact } from "./actions";

export default async function TrustedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: contacts }, { data: subscription }] = await Promise.all([
    supabase.from("trusted_contacts").select("*").eq("member_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("lockbox_status").eq("member_id", user!.id).eq("status", "active").maybeSingle(),
  ]);

  const hasLockbox = subscription?.lockbox_status === "shipped" || subscription?.lockbox_status === "installed";

  return (
    <div>
      <Link href="/app" className="text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-parchment">Trusted access network</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-parchment-dim">Record the people who can help before you need a locksmith: a neighbor with a spare key, family member, friend, caretaker or property manager. Being listed here does not give them automatic access to Digital Sentinel secrets.</p>

      <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {contacts && contacts.length > 0 ? contacts.map((c: any) => (
          <div key={c.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-verdigris to-[#2c6b5f]" />
            <div className="flex-1">
              <div className="text-sm font-medium text-parchment">{c.name}</div>
              <div className="mt-0.5 text-xs text-parchment-dim">{[c.relationship, c.has_spare_key ? "Has spare key" : null, c.can_authorize ? "Can authorize" : null].filter(Boolean).join(" · ")}</div>
              {c.access_note && <div className="mt-1 text-xs text-parchment-dim">{c.access_note}</div>}
              <div className="mt-2 flex flex-wrap gap-3 text-xs">{c.phone && <a href={`tel:${c.phone}`} className="text-brass">Call {c.phone}</a>}{c.email && <a href={`mailto:${c.email}`} className="text-brass">Email</a>}</div>
            </div>
            <form action={removeTrustedContact}><input type="hidden" name="id" value={c.id} /><button type="submit" className="text-xs text-parchment-dim hover:text-ember">Remove</button></form>
          </div>
        )) : <div className="py-6 text-center text-sm text-parchment-dim">No trusted contacts yet.</div>}
      </div>

      <form action={addTrustedContact} className="mt-6 space-y-3 rounded-xl border border-dashed border-line p-4">
        <div className="grid gap-3 sm:grid-cols-2"><input type="text" name="name" required placeholder="Name" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" /><input type="text" name="relationship" placeholder="Neighbor · Sister · Property manager" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" /></div>
        <div className="grid gap-3 sm:grid-cols-2"><input type="tel" name="phone" placeholder="Phone" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" /><input type="email" name="email" placeholder="Email (optional)" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" /></div>
        <textarea name="access_note" rows={2} placeholder="e.g. Lives next door; has spare front-door key" className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" />
        <div className="grid gap-2 sm:grid-cols-2"><label className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised p-3 text-xs text-parchment"><input type="checkbox" name="has_spare_key" className="accent-brass" /> Has a spare key</label><label className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised p-3 text-xs text-parchment"><input type="checkbox" name="can_authorize" className="accent-brass" /> Can authorize access</label></div>
        <button type="submit" className="w-full rounded-lg border border-dashed border-line py-2.5 text-sm font-medium text-brass hover:border-brass">+ Add trusted contact</button>
      </form>

      <div className="mt-5 rounded-xl border border-line bg-surface p-4">
        <div className="text-sm font-semibold text-parchment">{hasLockbox ? "Lockbox registered" : "No lockbox registered"}</div>
        <p className="mt-1 text-xs leading-5 text-parchment-dim">Store the actual lockbox code and location securely in Digital Sentinel rather than displaying it openly on this page.</p>
        <Link href="/app/vault" className="mt-3 inline-flex text-xs font-medium text-brass">Open Digital Sentinel →</Link>
      </div>
    </div>
  );
}
