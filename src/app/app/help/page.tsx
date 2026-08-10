import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Keyhole } from "@/components/Keyhole";
import { createDispatchRequest } from "./actions";

const ISSUES = ["Locked out of my home", "Locked my car at home", "Something else"];

export default async function HelpPage({ searchParams }: { searchParams: Promise<{ error?: string; step?: string }> }) {
  const { error, step } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subscription }, { data: contacts }] = await Promise.all([
    supabase.from("subscriptions").select("lockbox_status").eq("member_id", user!.id).eq("status", "active").maybeSingle(),
    supabase.from("trusted_contacts").select("id, name").eq("member_id", user!.id).limit(3),
  ]);

  const hasLockbox = subscription?.lockbox_status === "shipped" || subscription?.lockbox_status === "installed";
  const hasTrustedContacts = (contacts?.length ?? 0) > 0;

  if (step !== "dispatch") {
    return (
      <div className="flex flex-col items-center text-center">
        <Link href="/app" className="self-start text-xs text-parchment-dim hover:text-parchment">← Back</Link>
        <Keyhole className="mt-6 h-14 w-10 text-brass" />
        <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-brass">Resolve locally first</div>
        <h1 className="mt-2 font-display text-3xl font-medium text-parchment">Can trusted access solve this?</h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-parchment-dim">Before creating a provider request, check the access options already attached to the property.</p>

        <div className="mt-7 w-full max-w-md space-y-3">
          <Option href="/app/trusted" active={hasLockbox} title={hasLockbox ? "Registered lockbox available" : "No lockbox registered"} body={hasLockbox ? "Open trusted access to review the registered information." : "Add a lockbox later to create another self-resolution path."} />
          <Option href="/app/trusted" active={hasTrustedContacts} title={hasTrustedContacts ? "Trusted contacts available" : "No trusted contacts yet"} body={hasTrustedContacts ? `${contacts!.length} ${contacts!.length === 1 ? "person is" : "people are"} attached to this account.` : "Add a nearby person who may be able to help before a paid visit is needed."} />
        </div>

        <Link href="/app/help?step=dispatch" className="mt-6 inline-flex w-full max-w-md min-h-12 items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink">Still need service</Link>
        <p className="mt-2 max-w-md text-[11px] leading-5 text-parchment-dim">Submitting creates a provider request. A covered event should only be consumed according to the final marketplace completion rules.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Link href="/app/help" className="self-start text-xs text-parchment-dim hover:text-parchment">← Back</Link>
      <Keyhole className="mt-6 h-14 w-10 text-brass" />
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-brass">Member service request</div>
      <h1 className="mt-2 font-display text-3xl font-medium text-parchment">What do you need help with?</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-parchment-dim">Keepwell will create the marketplace request. Provider identity and ETA only appear after a real provider accepts.</p>

      {error && <div className="mt-5 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div>}

      <form action={createDispatchRequest} className="mt-7 w-full max-w-md space-y-3">
        {ISSUES.map((issue, i) => (
          <label key={issue} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left text-sm text-parchment transition has-[:checked]:border-brass has-[:checked]:bg-brass/[0.08]">
            <input type="radio" name="issue" value={issue} defaultChecked={i === 0} className="accent-brass" />
            {issue}
          </label>
        ))}
        <button type="submit" className="mt-2 w-full rounded-full bg-ember px-6 py-3 text-sm font-semibold text-ink">Submit service request</button>
      </form>
    </div>
  );
}

function Option({ href, active, title, body }: { href: string; active: boolean; title: string; body: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition ${active ? "border-verdigris/30 bg-verdigris/[0.06]" : "border-line bg-surface"}`}>
      <span><span className="font-medium text-parchment">{title}</span><span className="mt-1 block text-xs leading-5 text-parchment-dim">{body}</span></span>
      <span className={active ? "text-verdigris" : "text-brass"}>→</span>
    </Link>
  );
}
