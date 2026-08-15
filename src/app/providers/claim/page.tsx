import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { claimProvider } from "./actions";

export const metadata: Metadata = { title: "Claim a provider profile", robots: { index: false } };

export default async function ClaimProviderPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; error?: string }>;
}) {
  const { provider: providerParam, error } = await searchParams;
  const supabase = await createClient();

  const { data: providers } = await supabase
    .from("provider_profiles")
    .select("id,slug,business_name,city,state,claim_status")
    .order("business_name");

  let provider = null as any;
  if (providerParam) {
    provider = (providers ?? []).find((item: any) => item.id === providerParam || item.slug === providerParam);
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!provider) {
    return (
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="eyebrow">Claim your profile</div>
            <h1 className="mt-3 font-display text-4xl text-parchment">Find your business</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">
              Your business may already have a basic Keepwell profile built from public business information. Find it here and claim it so you can verify the details and control the provider account.
            </p>
            <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
              {(providers ?? []).map((item: any) => (
                <Link key={item.id} href={`/providers/claim?provider=${item.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-raised">
                  <span>
                    <span className="block text-sm font-medium text-parchment">{item.business_name}</span>
                    <span className="mt-1 block text-xs text-parchment-dim">{[item.city, item.state].filter(Boolean).join(", ") || "Service area not listed"} · {item.claim_status.replaceAll("_", " ")}</span>
                  </span>
                  <span className="text-brass">Claim →</span>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm text-parchment-dim">Do not see your business? <Link href="/providers/register" className="font-semibold text-brass hover:underline">Register a new provider account →</Link></p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: existingClaim } = user
    ? await supabase.from("provider_claims").select("id,status").eq("provider_id", provider.id).eq("user_id", user.id).maybeSingle()
    : { data: null };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl px-6">
          <Link href="/providers/claim" className="text-xs text-parchment-dim hover:text-parchment">← All provider profiles</Link>
          <div className="mt-6 eyebrow">Profile claim</div>
          <h1 className="mt-3 font-display text-4xl text-parchment">{provider.business_name}</h1>
          <p className="mt-2 text-sm text-parchment-dim">{[provider.city, provider.state].filter(Boolean).join(", ") || "Service area not listed"} · Status: {provider.claim_status.replaceAll("_", " ")}</p>

          {error && <div className="mt-6 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</div>}

          {existingClaim ? (
            <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
              <div className="font-medium text-parchment">Claim already submitted</div>
              <p className="mt-2 text-sm leading-6 text-parchment-dim">Current status: {existingClaim.status}. Use your provider dashboard for updates.</p>
              <Link href="/provider" className="mt-5 inline-flex rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Open provider dashboard</Link>
            </div>
          ) : !user ? (
            <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
              <div className="font-medium text-parchment">Create or sign in to a provider account</div>
              <p className="mt-2 text-sm leading-6 text-parchment-dim">Provider accounts are separate from customer membership accounts. After signing in, you can submit the ownership claim for review.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href={`/providers/register?provider=${provider.id}`} className="rounded-full bg-brass px-5 py-2.5 text-center text-sm font-semibold text-ink">Create provider account</Link>
                <Link href={`/login?next=${encodeURIComponent(`/providers/claim?provider=${provider.id}`)}`} className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-parchment">Log in</Link>
              </div>
            </div>
          ) : (
            <form action={claimProvider} className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6">
              <input type="hidden" name="provider_id" value={provider.id} />
              <Field label="Your name"><input className="input" name="contact_name" required defaultValue={String(user.user_metadata?.full_name ?? "")} /></Field>
              <Field label="Business email"><input className="input" type="email" name="business_email" required defaultValue={user.email ?? ""} /></Field>
              <Field label="Business phone"><input className="input" type="tel" name="business_phone" required /></Field>
              <Field label="Your relationship to the business">
                <select className="input" name="relationship" required defaultValue="owner">
                  <option value="owner">Owner</option>
                  <option value="authorized_manager">Authorized manager</option>
                  <option value="employee">Employee authorized to claim</option>
                </select>
              </Field>
              <Field label="Verification note (optional)"><textarea className="input min-h-24" name="notes" placeholder="Website domain, public business email, or anything that helps verify your connection to the business." /></Field>
              <button className="w-full rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink">Submit profile claim</button>
              <p className="text-xs leading-5 text-parchment-dim">Submitting a claim does not activate the profile. Keepwell reviews the business connection before the provider can receive job offers.</p>
            </form>
          )}
        </div>
      </main>
      <Footer />
      <style>{`.input{width:100%;border:1px solid var(--line);background:var(--surface-raised);border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;color:var(--parchment);outline:none}.input:focus{border-color:var(--brass)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[.12em] text-parchment-dim">{label}</span>{children}</label>;
}
