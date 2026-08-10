import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Provider profile", robots: { index: false, follow: true } };

export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: provider } = await supabase.from("provider_profiles").select("*").eq("slug", slug).maybeSingle();
  if (!provider) notFound();

  const verified = provider.claim_status === "verified";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/providers" className="text-xs text-parchment-dim hover:text-parchment">← Provider directory</Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${verified ? "bg-verdigris/10 text-verdigris" : "bg-brass/10 text-brass"}`}>
              {verified ? "Keepwell verified" : "Unclaimed profile"}
            </span>
            {provider.is_available && verified ? <span className="rounded-full bg-verdigris/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris">Available</span> : null}
          </div>
          <h1 className="mt-4 font-display text-5xl text-parchment">{provider.business_name}</h1>
          <p className="mt-2 text-sm text-parchment-dim">{[provider.city, provider.state, provider.postal_code].filter(Boolean).join(", ") || "Greater Boston"}</p>
          <p className="mt-6 text-sm leading-7 text-parchment-dim">
            {provider.description || (verified
              ? "This business has claimed and verified its Keepwell provider profile."
              : "Keepwell created this profile from public business information to build the initial marketplace directory. The business has not yet claimed or activated it.")}
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <div className="font-mono text-[10px] uppercase tracking-[.12em] text-parchment-dim">Marketplace status</div>
            <p className="mt-2 text-sm leading-6 text-parchment-dim">
              {verified
                ? "Verified profiles can receive Keepwell job offers when they set availability on."
                : "Unclaimed profiles cannot receive customer jobs. Claim and verification must happen first."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {!verified && (
                <Link href={`/providers/claim?provider=${provider.id}`} className="rounded-full bg-brass px-5 py-2.5 text-center text-sm font-semibold text-ink">
                  Claim this business
                </Link>
              )}
              <Link href="/book" className="rounded-full border border-line px-5 py-2.5 text-center text-sm font-semibold text-parchment">
                Request service through Keepwell
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
