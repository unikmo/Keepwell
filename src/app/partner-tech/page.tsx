import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Join the Keepwell Provider Network | Fixed-Payout Jobs",
  description:
    "Join Keepwell as an independent property-access provider. See the job scope and fixed payout before you accept home lockout, rekey, lock-change and smart-lock requests.",
  alternates: { canonical: "/partner-tech" },
};

export default function PartnerTechPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For independent providers"
          title="More jobs. No bidding. Know your payout before you accept."
          body="Keepwell routes clearly scoped property-access requests. You control availability, see the payout up front and accept only the jobs that fit your schedule and service area."
        />

        <section className="border-b border-line/70 py-16">
          <div className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-3">
            {[
              ["01", "Transparent payout", "See the service scope and fixed payout before you accept. No guessing what the job is worth."],
              ["02", "You stay in control", "Set availability and service area, then accept or decline each request based on your schedule."],
              ["03", "Cleaner customer expectations", "Keepwell shows the standard customer price and scope before the request, reducing avoidable pricing friction at the door."],
            ].map(([n, title, body]) => (
              <div key={n} className="rounded-2xl border border-line bg-surface p-6">
                <div className="font-mono text-xs text-brass">{n}</div>
                <h2 className="mt-3 font-display text-xl text-parchment">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-parchment-dim">{body}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 px-6 sm:flex-row sm:flex-wrap">
            <Link href="/providers/claim" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink">
              Claim an existing profile
            </Link>
            <Link href="/providers/register" className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/30 bg-surface/35 px-6 py-3 text-sm font-semibold text-parchment hover:border-sky/55">
              Register a new business
            </Link>
            <Link href="/provider" className="inline-flex min-h-12 items-center justify-center px-4 py-3 text-sm font-semibold text-parchment-dim hover:text-parchment">
              Provider login →
            </Link>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/15 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="eyebrow">Example provider economics</div>
            <h2 className="mt-3 max-w-2xl font-display text-3xl text-parchment">See what the customer pays—and what you earn.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-parchment-dim">
              The current payout schedule is shown transparently. Availability and live request volume vary by service area and time.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="divide-y divide-line">
                {SERVICE_MENU.map((service) => (
                  <div key={service.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1.3fr_.8fr_.7fr_.7fr] sm:items-center">
                    <div className="text-sm font-medium text-parchment">{service.title}</div>
                    <div className="text-xs text-parchment-dim">{service.timing}</div>
                    <div className="text-xs text-parchment-dim">Customer {formatServicePrice(service.customerPriceCents)}</div>
                    <div className="font-mono text-sm text-verdigris">You earn {formatServicePrice(service.providerPayoutCents)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">Provider standards</div>
            <h2 className="mt-3 font-display text-3xl text-parchment">A credible profile before the first job.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-parchment-dim">
              Provider activation is based on business ownership, service area and the credentials or insurance relevant to the work and jurisdiction. Keepwell only displays verification claims supported by the provider record.
            </p>
            <Link href="/providers/register" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink">Join the provider network</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
