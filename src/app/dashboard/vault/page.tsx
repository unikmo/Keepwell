import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addVaultItem, removeVaultItem } from "./actions";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("vault_items")
    .select("*")
    .eq("member_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <Link href="/dashboard" className="text-xs text-parchment-dim hover:text-parchment">
        ← Back
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-parchment">Vault</h1>
      <div className="mt-6 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">
        Keys & access
      </div>

      <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-base">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-parchment">{item.name}</div>
                {item.meta && (
                  <div className="mt-0.5 font-mono text-[11px] text-parchment-dim">{item.meta}</div>
                )}
              </div>
              <span className="text-parchment-dim">🔒</span>
              <form action={removeVaultItem}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-xs text-parchment-dim hover:text-ember">
                  Remove
                </button>
              </form>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-parchment-dim">
            No keys or codes saved yet.
          </div>
        )}
      </div>

      <form
        action={addVaultItem}
        className="mt-6 space-y-3 rounded-xl border border-dashed border-line p-4"
      >
        <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
          <select
            name="icon"
            defaultValue="🔑"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment focus:border-brass focus:outline-none"
          >
            <option value="🚪">🚪 Door</option>
            <option value="🏠">🏠 Garage</option>
            <option value="📬">📬 Mailbox</option>
            <option value="🔐">🔐 Smart lock</option>
            <option value="🔑">🔑 Other key</option>
          </select>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Front door"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
          />
          <input
            type="text"
            name="meta"
            placeholder="e.g. •••• 4 digits"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg border border-dashed border-line py-2.5 text-sm font-medium text-brass hover:border-brass"
        >
          + Add a key or code
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-brass/20 bg-brass/[0.06] p-4 text-xs leading-relaxed text-parchment-dim">
        Everything here is encrypted on your device. Nothing is stored as legal or estate
        documentation — just the everyday keys and codes for your home.
      </div>
    </div>
  );
}
