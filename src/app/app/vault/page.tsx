import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addVaultItem, removeVaultItem } from "./actions";

export default async function VaultPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: items } = await supabase.from("vault_items").select("*").eq("member_id", user!.id).order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/app" className="text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-parchment">Access inventory</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-parchment-dim">Keep a simple inventory of the doors, locks and access points attached to your property.</p>

      <div className="mt-6 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">Property access items</div>
      <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {items && items.length > 0 ? items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-base">{item.icon}</div>
            <div className="flex-1"><div className="text-sm font-medium text-parchment">{item.name}</div></div>
            <form action={removeVaultItem}><input type="hidden" name="id" value={item.id} /><button type="submit" className="text-xs text-parchment-dim hover:text-ember">Remove</button></form>
          </div>
        )) : <div className="py-6 text-center text-sm text-parchment-dim">No access items saved yet.</div>}
      </div>

      <form action={addVaultItem} className="mt-6 space-y-3 rounded-xl border border-dashed border-line p-4">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <select name="icon" defaultValue="🔑" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment focus:border-brass focus:outline-none"><option value="🚪">🚪 Door</option><option value="🏠">🏠 Garage</option><option value="📬">📬 Mailbox</option><option value="🔐">🔐 Smart lock</option><option value="🔑">🔑 Other key</option></select>
          <input type="text" name="name" required maxLength={120} placeholder="e.g. Front door deadbolt" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none" />
        </div>
        <button type="submit" className="w-full rounded-lg border border-dashed border-line py-2.5 text-sm font-medium text-brass hover:border-brass">+ Add access item</button>
      </form>

      <div className="mt-4 rounded-xl border border-brass/20 bg-brass/[0.06] p-4 text-xs leading-relaxed text-parchment-dim"><strong className="text-parchment">Do not store door codes, alarm PINs, lockbox combinations or other access secrets here.</strong> Secret storage stays disabled until Keepwell has application-level encryption and the control has been independently reviewed.</div>
    </div>
  );
}
