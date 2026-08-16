import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}) {
  const { error, notice, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Trusted Locksmith
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium text-parchment">Welcome back</h1>
          <p className="mt-1 text-sm text-parchment-dim">Log in to your Trusted Locksmith account</p>
        </div>

        {notice && (
          <div className="mt-6 rounded-lg border border-verdigris/30 bg-verdigris/10 px-4 py-2.5 text-sm text-verdigris">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
            {error}
          </div>
        )}

        <form action={login} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next ?? "/app"} />
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-brass px-4 py-2.5 text-sm font-medium text-ink transition hover:brightness-110">
            Log in
          </button>
        </form>

        <div className="mt-6 grid gap-2 text-center text-xs text-parchment-dim">
          <p>New customer? <Link href="/signup" className="text-brass hover:underline">Create a membership account</Link></p>
          <p>Locksmith provider? <Link href="/providers/register" className="text-brass hover:underline">Create a provider account</Link></p>
        </div>
      </div>
    </div>
  );
}
