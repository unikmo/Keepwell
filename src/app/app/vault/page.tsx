import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addVaultItem, removeVaultItem, revealSentinelSecret } from "./actions";
import { decryptSentinelSecret, verifySentinelRevealToken } from "@/lib/sentinel-crypto";

export default async function VaultPage({ searchParams }: { searchParams: Promise<{ reveal_token?: string; notice?: string; error?: string }> }) {
  const { reveal_token, notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("vault_items")
    .select("id,name,icon,item_type,notes,photo_path,secret_ciphertext,created_at")
    .eq("member_id", user!.id)
    .order("created_at", { ascending: false });

  let revealedSecret: string | null = null;
  let revealedItemId: string | null = null;
  if (reveal_token) {
    const verified = verifySentinelRevealToken(reveal_token, user!.id);
    if (verified) {
      const item = (items ?? []).find((candidate: any) => candidate.id === verified.itemId);
      if (item?.secret_ciphertext) {
        try {
          revealedSecret = decryptSentinelSecret(item.secret_ciphertext);
          revealedItemId = item.id;
          await supabase.from("activity_log").insert({ member_id: user!.id, title: "Digital Sentinel secret revealed", meta: item.name });
        } catch {
          revealedSecret = "Unable to decrypt this item.";
          revealedItemId = item.id;
        }
      }
    }
  }

  const photoUrls = new Map<string, string>();
  await Promise.all((items ?? []).filter((item: any) => item.photo_path).map(async (item: any) => {
    const { data } = await supabase.storage.from("keepwell-sentinel").createSignedUrl(item.photo_path, 300);
    if (data?.signedUrl) photoUrls.set(item.id, data.signedUrl);
  }));

  return (
    <div>
      <Link href="/app" className="text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[.13em] text-brass">Digital Sentinel</div>
      <h1 className="mt-2 font-display text-3xl font-medium text-parchment">Your private access box</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-parchment-dim">Store access instructions, key locations, lockbox or keypad codes and supporting photos. Sensitive codes are stored as server-encrypted ciphertext. Revealing a secret requires password re-verification and uses a two-minute server-signed reveal token bound to your account and item. Reference photos are kept in a private bucket with short-lived signed access.</p>

      {notice && <div className="mt-5 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{notice}</div>}
      {error && <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}

      <div className="mt-7 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {items && items.length > 0 ? items.map((item: any) => (
          <div key={item.id} className="py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-base">{item.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium text-parchment">{item.name}</span><span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-parchment-dim">{item.item_type ?? "access"}</span></div>
                {item.notes && <p className="mt-1 text-xs leading-5 text-parchment-dim">{item.notes}</p>}
                {photoUrls.get(item.id) && <img src={photoUrls.get(item.id)} alt="Saved access reference" className="mt-3 max-h-44 rounded-xl border border-line object-cover" />}
                {revealedItemId === item.id && <div className="mt-3 rounded-lg border border-brass/25 bg-brass/[0.07] p-3"><div className="font-mono text-[9px] uppercase tracking-wide text-parchment-dim">Sensitive access detail</div><div className="mt-1 break-all font-mono text-lg text-brass">{revealedSecret || "No secret saved"}</div><div className="mt-1 text-[10px] text-parchment-dim">Reveal is logged. Avoid sharing this screen unnecessarily.</div></div>}
              </div>
              <div className="flex flex-col gap-2 text-right">
                {item.secret_ciphertext ? <form action={revealSentinelSecret} className="flex flex-col items-end gap-1"><input type="hidden" name="item_id" value={item.id} /><input name="password" type="password" required autoComplete="current-password" placeholder="Account password" className="w-36 rounded-lg border border-line bg-surface-raised px-2 py-1.5 text-[11px] text-parchment placeholder:text-parchment-dim/60" /><button className="text-xs text-brass hover:text-parchment">Verify & reveal</button></form> : <span className="text-[10px] text-parchment-dim">No secret</span>}
                <form action={removeVaultItem}><input type="hidden" name="id" value={item.id} /><button type="submit" className="text-xs text-parchment-dim hover:text-ember">Remove</button></form>
              </div>
            </div>
          </div>
        )) : <div className="py-8 text-center text-sm text-parchment-dim">No Digital Sentinel items saved yet.</div>}
      </div>

      <form action={addVaultItem} className="mt-6 space-y-3 rounded-xl border border-dashed border-line p-4">
        <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
          <select name="item_type" defaultValue="key_location" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"><option value="key_location">Key location</option><option value="lockbox">Lockbox</option><option value="keypad">Keypad</option><option value="smart_lock">Smart lock</option><option value="garage">Garage</option><option value="other">Other</option></select>
          <input type="text" name="name" required maxLength={120} placeholder="e.g. Front-door lockbox" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60" />
        </div>
        <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
          <select name="icon" defaultValue="🔑" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment"><option value="🔑">🔑</option><option value="🚪">🚪</option><option value="🔐">🔐</option><option value="🏠">🏠</option><option value="📬">📬</option></select>
          <input type="text" name="secret" maxLength={500} autoComplete="off" placeholder="Optional sensitive code / recovery detail" className="rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60" />
        </div>
        <textarea name="notes" maxLength={1200} rows={3} placeholder="Instructions, spare-key location, who can help, etc." className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/60" />
        <label className="block rounded-lg border border-line bg-surface-raised px-3 py-2 text-xs text-parchment-dim">Optional reference photo<input type="file" name="photo" accept="image/*" className="mt-2 block w-full text-xs" /></label>
        <button type="submit" className="w-full rounded-lg border border-dashed border-line py-2.5 text-sm font-medium text-brass hover:border-brass">+ Save to Digital Sentinel</button>
      </form>

      <div className="mt-4 rounded-xl border border-brass/20 bg-brass/[0.06] p-4 text-xs leading-relaxed text-parchment-dim"><strong className="text-parchment">Access-control rule:</strong> trusted contacts are recorded separately. A neighbor or family member can be marked as a spare-key holder without automatically receiving access to your saved Digital Sentinel secrets.</div>
    </div>
  );
}
