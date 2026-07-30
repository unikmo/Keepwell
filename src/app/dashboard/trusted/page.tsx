import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addTrustedContact, removeTrustedContact } from "./actions";

export default async function TrustedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: contacts }, { data: subscription }] = await Promise.all([
    supabase
      .from("trusted_contacts")
      .select("*")
      .eq("member_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("lockbox_status")
      .eq("member_id", user!.id)
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const hasLockbox = subscription?.lockbox_status === "shipped" || subscription?.lockbox_status === "installed";

  return (
    <div>
      <Link href="/dashboard" className="text-xs text-parchment-dim hover:text-parchment">
        ← Back
      </Link>
      <h1 className="mt-3 font-display text-2xl font-medium text-parchment">Trusted access</h1>
      <div className="mt-6 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">
        People you&rsquo;ve added
      </div>

      <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {contacts && contacts.length > 0 ? (
          contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-3">
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-verdigris to-[#2c6b5f]" />
              <div className="flex-1">
                <div className="text-sm font-medium text-parchment">{c.name}</div>
                {c.relationship && (
                  <div className="mt-0.5 text-xs text-parchment-dim">{c.relationship}</div>
                )}
              </div>
              <span className="rounded-md bg-verdigris/10 px-2 py-1 font-mono text-[9.5px] uppercase tracking-wide text-verdigris">
                {c.permission}
              </span>
              <form action={removeTrustedContact}>
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="text-xs text-parchment-dim hover:text-ember">
                  Remove
                </button>
              </form>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-parchment-dim">
            No trusted contacts yet.
          </div>
        )}
      </div>

      <form
        action={addTrustedContact}
        className="mt-6 space-y-3 rounded-xl border border-dashed border-line p-4"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
          />
          <input
            type="text"
            name="relationship"
            placeholder="e.g. Neighbor · Next door"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
          />
          <select
            name="permission"
            defaultValue="Key holder"
            className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment focus:border-brass focus:outline-none"
          >
            <option>Key holder</option>
            <option>Can authorize</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg border border-dashed border-line py-2.5 text-sm font-medium text-brass hover:border-brass"
        >
          + Add a trusted contact
        </button>
      </form>

      {hasLockbox ? (
        <div className="mt-4 rounded-xl bg-surface-raised p-4">
          <div className="text-sm font-semibold text-parchment">Lockbox code</div>
          <p className="mt-1 text-[10.5px] leading-relaxed text-parchment-dim">
            If you&rsquo;re locked out, this resolves it instantly — no dispatch needed.
          </p>
          <div className="mt-2 font-mono text-2xl tracking-[0.15em] text-brass">4 · 8 · 1 · 9</div>
        </div>
      ) : (
        <Link
          href="/dashboard/lockbox"
          className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-line p-4 text-left transition hover:border-brass/40"
        >
          <span>
            <span className="text-sm font-semibold text-parchment">No lockbox registered</span>
            <span className="mt-0.5 block text-[10.5px] leading-relaxed text-parchment-dim">
              Add one so a lockout can resolve for free, without waiting on dispatch.
            </span>
          </span>
          <span className="text-brass">→</span>
        </Link>
      )}
    </div>
  );
}
