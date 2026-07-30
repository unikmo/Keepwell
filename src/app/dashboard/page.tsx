import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Keyhole } from "@/components/Keyhole";

function greetingWord() {
  const hour = new Date().getHours();
  if (hour < 5) return "Late night";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: member }, { data: vaultItems }, { data: contacts }, { data: activity }] =
    await Promise.all([
      supabase.from("members").select("*").eq("id", user!.id).maybeSingle(),
      supabase.from("vault_items").select("id").eq("member_id", user!.id),
      supabase.from("trusted_contacts").select("id").eq("member_id", user!.id),
      supabase
        .from("activity_log")
        .select("*")
        .eq("member_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const firstName = (member?.full_name ?? user?.email ?? "there").split(" ")[0];
  const total = member?.covered_events_total ?? 3;
  const used = member?.covered_events_used ?? 0;
  const remaining = Math.max(total - used, 0);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-parchment">
          {greetingWord()}, {firstName}
        </h1>
        <div className="h-9 w-9 rounded-full border border-line bg-surface-raised" />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-surface-raised to-surface p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-verdigris/35 bg-verdigris/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris">
          <span className="h-1.5 w-1.5 rounded-full bg-verdigris" />
          You&rsquo;re covered
        </span>
        <div className="mt-3 font-display text-lg font-medium text-parchment">
          {member?.plan ?? "Household"} membership active
        </div>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-parchment-dim">
          Covers the whole house — lockouts, rekeys, and car-at-home, whenever they come up.
        </p>

        <div className="mt-5 flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < remaining ? "bg-brass" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="mt-2 font-mono text-[10.5px] tracking-wide text-parchment-dim">
          {remaining} OF {total} COVERED EVENTS REMAINING THIS YEAR
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/vault"
          className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm font-medium text-parchment transition hover:border-brass/40"
        >
          <span className="text-lg">🔑</span>
          Digital vault
          <span className="font-mono text-[11px] font-normal text-parchment-dim">
            {vaultItems?.length ?? 0} saved
          </span>
        </Link>
        <Link
          href="/dashboard/trusted"
          className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm font-medium text-parchment transition hover:border-brass/40"
        >
          <span className="text-lg">🤝</span>
          Trusted access
          <span className="font-mono text-[11px] font-normal text-parchment-dim">
            {contacts?.length ?? 0} people
          </span>
        </Link>
      </div>

      <div className="mt-8 font-mono text-[10.5px] uppercase tracking-wide text-parchment-dim">
        Recent activity
      </div>
      <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface px-4">
        {activity && activity.length > 0 ? (
          activity.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="text-parchment">{a.title}</div>
                {a.meta && <div className="mt-0.5 text-xs text-parchment-dim">{a.meta}</div>}
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-parchment-dim">
            Nothing yet — your activity will show up here.
          </div>
        )}
      </div>

      <Link
        href="/dashboard/help"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-ember shadow-[0_8px_24px_-4px_rgba(225,97,61,0.6)] transition hover:brightness-110"
        title="Get help"
      >
        <Keyhole className="h-5 w-4 text-ink" />
      </Link>
    </div>
  );
}
