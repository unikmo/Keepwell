import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { signup } from "./actions";

const PLAN_LABELS: Record<string, string> = {
  individual: "Individual",
  household: "Household",
  household_plus: "Household +",
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; plan?: string }> }) {
  const { error, plan } = await searchParams;
  const planId = plan && PLAN_LABELS[plan] ? plan : "household";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-sky/15 bg-surface p-6 shadow-[0_24px_70px_rgba(3,18,37,0.28)] sm:p-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-sky/25 bg-surface-raised"><Keyhole className="h-4 w-3 text-brass" /></span>
            Trusted Locksmith
          </Link>
          <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-brass">{PLAN_LABELS[planId]}</div>
          <h1 className="mt-2 font-display text-3xl font-medium text-parchment">Create your Trusted Locksmith account</h1>
          <p className="mt-2 text-sm leading-6 text-parchment-dim">Keep Digital Access details, trusted people and your selected membership plan together in one account.</p>
        </div>

        {error && <div className="mt-6 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div>}

        <form action={signup} className="mt-7 space-y-4">
          <input type="hidden" name="plan" value={planId} />
          <Field label="Full name"><input type="text" name="name" required autoComplete="name" placeholder="Your full name" className="input" /></Field>
          <Field label="Email"><input type="email" name="email" required autoComplete="email" placeholder="you@email.com" className="input" /></Field>
          <Field label="Password"><input type="password" name="password" required minLength={6} autoComplete="new-password" placeholder="At least 6 characters" className="input" /></Field>
          <button type="submit" className="mt-2 w-full rounded-full bg-brass px-4 py-3 text-sm font-semibold text-ink shadow-[0_8px_22px_rgba(214,173,87,0.14)] transition hover:brightness-110">Create account</button>
        </form>

        <p className="mt-4 text-center text-[11px] leading-5 text-parchment-dim/75">Your plan choice is saved with the account. This screen does not process a card payment.</p>
        <p className="mt-5 text-center text-xs leading-5 text-parchment-dim">By continuing, you agree to the <Link href="/terms" className="text-brass hover:underline">Terms</Link> and acknowledge the <Link href="/privacy" className="text-brass hover:underline">Privacy Policy</Link>.</p>
        <p className="mt-4 text-center text-xs text-parchment-dim">Already have an account? <Link href="/login" className="text-brass hover:underline">Log in</Link></p>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--line);background:var(--surface-raised);border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;color:var(--parchment);outline:none}.input:focus{border-color:var(--sky)}.input::placeholder{color:color-mix(in srgb,var(--parchment-dim) 60%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">{label}</span>{children}</label>;
}
