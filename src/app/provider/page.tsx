import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { formatServicePrice } from "@/lib/service-menu";
import { respondToOffer, setAvailability } from "./actions";

export const metadata: Metadata = { title: "Provider dashboard", robots: { index: false } };

export default async function ProviderDashboard({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const { notice, error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/provider");

  const { data: profile } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("claimed_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: claim } = await supabase
      .from("provider_claims")
      .select("id,provider_id,status,submitted_at")
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let claimedBusiness = null as any;
    if (claim?.provider_id) {
      const { data } = await supabase.from("provider_profiles").select("business_name,city,state").eq("id", claim.provider_id).maybeSingle();
      claimedBusiness = data;
    }

    return (
      <div className="flex min-h-screen flex-col">
        <Nav />
        <main className="flex-1 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <div className="eyebrow">Provider dashboard</div>
            <h1 className="mt-3 font-display text-4xl text-parchment">Provider activation</h1>
            {notice && <Notice>{notice}</Notice>}
            {error && <ErrorBox>{error}</ErrorBox>}
            {claim ? (
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
                <div className="font-medium text-parchment">{claimedBusiness?.business_name ?? "Provider claim"}</div>
                <p className="mt-2 text-sm leading-6 text-parchment-dim">
                  Claim status: <strong className="text-parchment">{claim.status}</strong>. Job offers stay disabled until Keepwell verifies ownership.
                </p>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
                <p className="text-sm leading-6 text-parchment-dim">No provider profile is linked to this account yet.</p>
                <Link href="/providers/claim" className="mt-5 inline-flex rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Find & claim my profile</Link>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: offers } = await supabase
    .from("provider_job_offers")
    .select("*")
    .eq("provider_id", profile.id)
    .order("offered_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow">Provider dashboard</div>
              <h1 className="mt-2 font-display text-4xl text-parchment">{profile.business_name}</h1>
              <p className="mt-2 text-sm text-parchment-dim">Verified provider · {[profile.city, profile.state].filter(Boolean).join(", ")}</p>
            </div>
            <form action={setAvailability}>
              <input type="hidden" name="is_available" value={profile.is_available ? "false" : "true"} />
              <button className={`rounded-full px-5 py-2.5 text-sm font-semibold ${profile.is_available ? "border border-line text-parchment" : "bg-brass text-ink"}`}>
                {profile.is_available ? "Pause availability" : "Go available"}
              </button>
            </form>
          </div>

          {notice && <Notice>{notice}</Notice>}
          {error && <ErrorBox>{error}</ErrorBox>}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Availability" value={profile.is_available ? "ON" : "OFF"} />
            <Stat label="Open offers" value={String((offers ?? []).filter((o: any) => o.status === "offered").length)} />
            <Stat label="Accepted" value={String((offers ?? []).filter((o: any) => o.status === "accepted").length)} />
          </div>

          <section className="mt-10">
            <div className="font-mono text-[10px] uppercase tracking-[.12em] text-parchment-dim">Job offers</div>
            <div className="mt-3 space-y-4">
              {(offers ?? []).length === 0 ? (
                <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-parchment-dim">No offers yet.</div>
              ) : (
                (offers ?? []).map((offer: any) => {
                  const summary = offer.request_summary ?? {};
                  return (
                    <div key={offer.id} className="rounded-2xl border border-line bg-surface p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-medium text-parchment">{summary.service_title ?? summary.issue ?? "Property access request"}</div>
                          <div className="mt-1 text-xs text-parchment-dim">{summary.address ?? "Address available after acceptance where applicable"}</div>
                          <div className="mt-3 font-mono text-2xl text-verdigris">Payout {formatServicePrice(offer.payout_cents)}</div>
                          <p className="mt-2 max-w-2xl text-xs leading-5 text-parchment-dim">{summary.scope ?? "Review the request scope before accepting."}</p>
                        </div>
                        <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-parchment-dim">{offer.status}</span>
                      </div>

                      {offer.status === "offered" && (
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <form action={respondToOffer} className="flex gap-2">
                            <input type="hidden" name="offer_id" value={offer.id} />
                            <input type="hidden" name="decision" value="accept" />
                            <input name="eta_minutes" type="number" min={5} max={240} defaultValue={30} className="w-24 rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-parchment" aria-label="ETA minutes" />
                            <button className="flex-1 rounded-full bg-brass px-4 py-2.5 text-sm font-semibold text-ink">Accept · set ETA</button>
                          </form>
                          <form action={respondToOffer}>
                            <input type="hidden" name="offer_id" value={offer.id} />
                            <input type="hidden" name="decision" value="decline" />
                            <button className="w-full rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-parchment">Decline</button>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-line bg-surface p-5"><div className="font-mono text-[10px] uppercase tracking-[.12em] text-parchment-dim">{label}</div><div className="mt-2 font-display text-3xl text-parchment">{value}</div></div>;
}
function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-xl border border-verdigris/30 bg-verdigris/10 p-3 text-sm text-verdigris">{children}</div>;
}
function ErrorBox({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-xl border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{children}</div>;
}
