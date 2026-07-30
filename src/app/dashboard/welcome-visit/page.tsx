import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { scheduleWelcomeVisit } from "./actions";

export default async function WelcomeVisitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("welcome_visit_used")
    .eq("member_id", user!.id)
    .eq("status", "active")
    .maybeSingle();

  const minDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="flex flex-col items-center text-center">
      <Link href="/dashboard" className="self-start text-xs text-parchment-dim hover:text-parchment">
        ← Back
      </Link>

      <div className="mt-6 text-3xl">🛡️</div>
      <h1 className="mt-4 font-display text-2xl font-medium text-parchment">Your welcome visit</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-parchment-dim">
        A one-time guaranteed visit, included with your plan: a full home security audit, lockbox
        mount, and smart lock install — all in one appointment.
      </p>

      {subscription?.welcome_visit_used ? (
        <div className="mt-8 w-full max-w-sm rounded-xl border border-verdigris/30 bg-verdigris/[0.06] p-4 text-sm text-parchment">
          Your welcome visit has already been completed.
        </div>
      ) : (
        <form action={scheduleWelcomeVisit} className="mt-8 w-full max-w-sm space-y-3 text-left">
          <label className="block">
            <span className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Preferred date
            </span>
            <input
              type="date"
              name="date"
              min={minDate}
              required
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment focus:border-brass focus:outline-none"
            />
          </label>
          <div className="rounded-xl border border-brass/20 bg-brass/[0.06] p-4 text-xs leading-relaxed text-parchment-dim">
            This visit is fully covered — $0 due. A verified tech will confirm a two-hour window
            the day before.
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Confirm welcome visit
          </button>
        </form>
      )}
    </div>
  );
}
