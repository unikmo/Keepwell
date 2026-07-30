import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatUsd } from "@/lib/plans";
import { purchaseLockboxAddon } from "./actions";

export default async function LockboxAddonPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("lockbox_status, plan:plans(*)")
    .eq("member_id", user!.id)
    .eq("status", "active")
    .maybeSingle();

  const plan = subscription?.plan as
    | { lockbox_mode: string; lockbox_addon_price_cents: number | null }
    | undefined;

  const alreadyRegistered = subscription?.lockbox_status !== "none";
  const priceCents = plan?.lockbox_addon_price_cents ?? 1999;

  return (
    <div className="flex flex-col items-center text-center">
      <Link href="/dashboard/trusted" className="self-start text-xs text-parchment-dim hover:text-parchment">
        ← Back
      </Link>

      <div className="mt-6 text-3xl">🔒</div>
      <h1 className="mt-4 font-display text-2xl font-medium text-parchment">Lockbox code registration</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-parchment-dim">
        Register a lockbox code so a lockout can resolve instantly, without waiting on dispatch.
        This is a one-time optional add-on on your plan.
      </p>

      {alreadyRegistered ? (
        <div className="mt-8 w-full max-w-sm rounded-xl border border-verdigris/30 bg-verdigris/[0.06] p-4 text-sm text-parchment">
          You already have a lockbox registered on your account.
        </div>
      ) : (
        <form action={purchaseLockboxAddon} className="mt-8 w-full max-w-sm">
          <div className="rounded-xl border border-line bg-surface p-5 text-left">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-parchment">Lockbox code registration</span>
              <span className="font-mono text-lg text-brass">{formatUsd(priceCents)}</span>
            </div>
            <p className="mt-1 text-xs text-parchment-dim">One-time charge, added to your account.</p>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Add for {formatUsd(priceCents)}
          </button>
          <p className="mt-2 text-[11px] text-parchment-dim">
            Payment processing isn&rsquo;t connected yet — this reserves your registration; billing
            will follow before it goes live.
          </p>
        </form>
      )}
    </div>
  );
}
