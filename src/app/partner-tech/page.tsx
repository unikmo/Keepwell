import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Join the Keepwell provider network",
  description:
    "Claim a preloaded provider profile or register a new business to receive clearly scoped Keepwell requests with fixed payout shown before acceptance.",
  alternates: { canonical: "/partner-tech" },
};

export default function PartnerTechPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For independent providers"
          title="Your business may already be listed. Claim it, verify it, then choose the jobs you want."
          body="Keepwell preloads public business profiles to build marketplace supply. Providers claim their profile, complete verification and use a provider dashboard to control availability and accept or decline fixed-payout requests."
        />

        <section className="border-b border-line/70 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-3">
            {[
              ["1", "Find or create your profile", "Search the preloaded provider directory. If your business is already there, claim it instead of creating a duplicate."],
              ["2", "Confirm ownership", "Create a provider account and submit business contact details. Keepwell reviews the claim before activation."],
              ["3", "Use the provider dashboard", "Set availability, see the scope and fixed payout, then accept or decline each offered job."],
            ].map(([n, title, body]) => (
              <div key={n} className="rounded-2xl border border-line bg-surface p-6">
                <div className="font-mono text-xs text-brass">{n.padStart(2, "0")}</div>
                <h2 className="mt-3 font-display text-xl text-parchment">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-parchment-dim">{body}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 px-6 sm:flex-row">
            <Link href="/providers/claim" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink">
              Find & claim my profile
            </Link>
            <Link href="/provider" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-parchment">
              Provider dashboard
            </Link>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/15 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="eyebrow">Example provider economics</div>
            <h2 className="mt-3 max-w-2xl font-display text-3xl text-parchment">Payout is shown before acceptance</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">
              The pilot payout schedule is an operating starting point, not a promise that every service category is live in every ZIP.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="divide-y divide-line">
                {SERVICE_MENU.map((service) => (
                  <div key={service.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1.3fr_.8fr_.7fr_.7fr] sm:items-center">
                    <div className="text-sm font-medium text-parchment">{service.title}</div>
                    <div className="text-xs text-parchment-dim">{service.timing}</div>
                    <div className="text-xs text-parchment-dim">Customer {formatServicePrice(service.customerPriceCents)}</div>
                    <div className="font-mono text-sm text-verdigris">Payout {formatServicePrice(service.providerPayoutCents)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">Provider standards</div>
            <h2 className="mt-3 font-display text-3xl text-parchment">Verification before activation</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-parchment-dim">
              Keepwell verifies identity/business ownership, service area, insurance where required by platform policy, and applicable credentials where the service or jurisdiction requires them. We do not invent credential requirements that do not exist.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
