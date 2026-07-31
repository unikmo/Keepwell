import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Welcome back</h1>
          <p className="mt-1 text-sm text-parchment-dim">Log in to your membership</p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            title="Coming soon"
            className="w-full cursor-not-allowed rounded-full border border-line px-4 py-2.5 text-sm font-medium text-parchment-dim"
          >
            Continue with Apple
          </button>
          <button
            type="button"
            title="Coming soon"
            className="w-full cursor-not-allowed rounded-full border border-line px-4 py-2.5 text-sm font-medium text-parchment-dim"
          >
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs font-mono uppercase tracking-wide text-parchment-dim">
          <span className="h-px flex-1 bg-line" />
          Or
          <span className="h-px flex-1 bg-line" />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/app"} />
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
              placeholder="••••••••"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-brass px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          New here?{" "}
          <Link href="/signup" className="text-brass hover:underline">
            Create a membership
          </Link>{" "}
          · <span className="hover:underline">Forgot password</span>
        </p>
      </div>
    </div>
  );
}
