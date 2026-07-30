import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Keyhole } from "@/components/Keyhole";
import { createDispatchRequest } from "./actions";

const ISSUES = [
  "Locked out of my home",
  "Locked my car (at home)",
  "Something else",
];

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; step?: string }>;
}) {
  const { error, step } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: subscription }, { data: contacts }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("lockbox_status")
      .eq("member_id", user!.id)
      .eq("status", "active")
      .maybeSingle(),
    supabase.from("trusted_contacts").select("id, name").eq("member_id", user!.id).limit(3),
  ]);

  const hasLockbox = subscription?.lockbox_status === "shipped" || subscription?.lockbox_status === "installed";
  const hasTrustedContacts = (contacts?.length ?? 0) > 0;

  // Required by the Implementation Spec: surface a registered lockbox (or
  // trusted contact) before offering dispatch, with this exact copy.
  if (step !== "dispatch") {
    return (
      <div className="flex flex-col items-center text-center">
        <Link href="/dashboard" className="self-start text-xs text-parchment-dim hover:text-parchment">
          ← Back
        </Link>

        <Keyhole className="mt-6 h-16 w-12 text-brass" />
        <h1 className="mt-4 font-display text-2xl font-medium text-parchment">What&rsquo;s going on?</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-parchment-dim">
          Check your Vault first — a lockbox or trusted contact might solve this for free, right
          now.
        </p>

        <div className="mt-6 w-full max-w-sm space-y-3">
          {hasLockbox ? (
            <Link
              href="/dashboard/trusted"
              className="flex items-center justify-between rounded-xl border border-verdigris/30 bg-verdigris/[0.06] p-4 text-left text-sm text-parchment transition hover:border-verdigris/60"
            >
              <span>
                <span className="font-medium">You have a registered lockbox</span>
                <span className="mt-0.5 block text-xs text-parchment-dim">
                  View your code — this might resolve it instantly, at no cost.
                </span>
              </span>
              <span className="text-verdigris">→</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/lockbox"
              className="flex items-center justify-between rounded-xl border border-dashed border-line p-4 text-left text-sm text-parchment transition hover:border-brass/40"
            >
              <span>
                <span className="font-medium">No lockbox registered yet</span>
                <span className="mt-0.5 block text-xs text-parchment-dim">
                  Add one so lockouts can resolve without waiting on dispatch.
                </span>
              </span>
              <span className="text-brass">→</span>
            </Link>
          )}

          {hasTrustedContacts ? (
            <Link
              href="/dashboard/trusted"
              className="flex items-center justify-between rounded-xl border border-verdigris/30 bg-verdigris/[0.06] p-4 text-left text-sm text-parchment transition hover:border-verdigris/60"
            >
              <span>
                <span className="font-medium">You have trusted contacts</span>
                <span className="mt-0.5 block text-xs text-parchment-dim">
                  {contacts!.length} {contacts!.length === 1 ? "person" : "people"} who might already
                  have access.
                </span>
              </span>
              <span className="text-verdigris">→</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/trusted"
              className="flex items-center justify-between rounded-xl border border-dashed border-line p-4 text-left text-sm text-parchment transition hover:border-brass/40"
            >
              <span>
                <span className="font-medium">No trusted contacts yet</span>
                <span className="mt-0.5 block text-xs text-parchment-dim">
                  Add someone nearby who can let you in.
                </span>
              </span>
              <span className="text-brass">→</span>
            </Link>
          )}
        </div>

        <Link
          href="/dashboard/help?step=dispatch"
          className="mt-6 w-full max-w-sm rounded-full bg-ember px-6 py-3 text-center text-sm font-medium text-ink transition hover:brightness-110"
        >
          Still need help — dispatch a tech
        </Link>
        <p className="mt-2 text-[11px] text-parchment-dim">This uses 1 of your covered events.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href="/dashboard/help"
        className="self-start text-xs text-parchment-dim hover:text-parchment"
      >
        ← Back
      </Link>

      <Keyhole className="mt-6 h-16 w-12 text-brass" />
      <h1 className="mt-4 font-display text-2xl font-medium text-parchment">What&rsquo;s going on?</h1>
      <p className="mt-2 max-w-xs text-sm text-parchment-dim">
        Tell us what happened and we&rsquo;ll get a verified tech on the way.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
          {error}
        </div>
      )}

      <form action={createDispatchRequest} className="mt-8 w-full max-w-sm space-y-3">
        {ISSUES.map((issue, i) => (
          <label
            key={issue}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left text-sm text-parchment transition has-[:checked]:border-brass has-[:checked]:bg-brass/[0.08]"
          >
            <input type="radio" name="issue" value={issue} defaultChecked={i === 0} className="accent-brass" />
            {issue}
          </label>
        ))}

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-ember px-6 py-3 text-sm font-medium text-ink transition hover:brightness-110"
        >
          Continue
        </button>
        <p className="text-[11px] text-parchment-dim">This uses 1 of your covered events.</p>
      </form>
    </div>
  );
}
