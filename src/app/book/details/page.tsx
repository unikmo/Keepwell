import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";

export const metadata: Metadata = { title: "Service request details", robots: { index: false } };

const JOB_LABELS: Record<string, string> = {
  lockout: "I'm locked out",
  rekey: "Rekey my locks",
  lock_upgrade: "Change or upgrade a lock",
};

export default async function BookDetailsPage({ searchParams }: { searchParams: Promise<{ job_type?: string }> }) {
  const { job_type } = await searchParams;
  const jobType = job_type && JOB_LABELS[job_type] ? job_type : "lockout";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment"><Keyhole className="h-5 w-4 text-brass" />Keepwell</Link>
          <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-brass">{JOB_LABELS[jobType]}</div>
          <h1 className="mt-2 font-display text-3xl font-medium text-parchment">Where is the property?</h1>
          <p className="mt-2 text-sm leading-6 text-parchment-dim">These details are used to create and route the request. They do not mean a provider has already been assigned.</p>
        </div>

        <form action="/book/review" className="mt-7 space-y-4">
          <input type="hidden" name="job_type" value={jobType} />
          <Field label="Service address"><input type="text" name="address" required autoComplete="street-address" placeholder="Street, city, state, ZIP" className="input" /></Field>
          <Field label="Mobile phone"><input type="tel" name="phone" required autoComplete="tel" placeholder="Your mobile number" className="input" /></Field>
          <Field label="Email"><input type="email" name="email" autoComplete="email" placeholder="you@email.com" className="input" /></Field>
          <button type="submit" className="w-full rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink">Review request</button>
        </form>
        <p className="mt-5 text-center text-xs text-parchment-dim"><Link href="/book" className="hover:text-parchment">← Change service type</Link></p>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--line);background:var(--surface-raised);border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;color:var(--parchment);outline:none}.input:focus{border-color:var(--brass)}.input::placeholder{color:color-mix(in srgb,var(--parchment-dim) 60%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">{label}</span>{children}</label>;
}
