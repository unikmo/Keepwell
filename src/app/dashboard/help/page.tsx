import Link from "next/link";
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
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col items-center text-center">
      <Link href="/dashboard" className="self-start text-xs text-parchment-dim hover:text-parchment">
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
