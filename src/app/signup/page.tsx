import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; plan?: string }>;
}) {
  const { error, plan } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Create your membership</h1>
          <p className="mt-1 text-sm text-parchment-dim">
            {plan ? `${plan} plan · ` : ""}Three minutes, no truck roll required.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
            {error}
          </div>
        )}

        <form action={signup} className="mt-6 space-y-4">
          <input type="hidden" name="plan" value={plan ?? "Household"} />
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Full name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Marcus Bell"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-brass px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Create membership
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          Already covered?{" "}
          <Link href="/login" className="text-brass hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
