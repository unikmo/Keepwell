import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPlans, formatUsd } from "@/lib/plans";

const SERVICES = [
  { title: "Lockout help", body: "Start a request when you cannot access your home or property." },
  { title: "Rekey", body: "Request a standard rekey after a move, turnover, key loss or access change." },
  { title: "Lock changes", body: "Coordinate replacement or upgrade work with clear scope before work begins." },
  { title: "Trusted access", body: "Keep the people and access details that can solve a problem before a service visit is needed." },
];

const AUDIENCES = [
  { title: "Homeowners", body: "One place for access help, trusted contacts and a record of what was changed at home.", href: "/services" },
  { title: "Second-home owners", body: "Keep remote-property access organized when you are not there to solve the problem yourself.", href: "/second-homes" },
  { title: "Landlords", body: "Coordinate rekeys and access work across rentals without rebuilding the process every time.", href: "/landlords" },
  { title: "Property managers", body: "Give residents and teams a consistent workflow for access requests and property service records.", href: "/for-property-managers" },
];

const STEPS = [
  { n: "01", title: "Tell Keepwell what happened", body: "Choose the property and service needed. You see the scope before submitting." },
  { n: "02", title: "An independent provider accepts", body: "Keepwell routes the request through the local provider network. Availability varies by market." },
  { n: "03", title: "Keep the record", body: "The service request, trusted access information and property history stay together for next time." },
];

export default async function Home() {
  const plans = await getPlans();
  const entryPlan = plans[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-line/70">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <div className="eyebrow">Property access, organized</div>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.02] tracking-[-0.025em] text-parchment sm:text-6xl lg:text-7xl">
                Property access,
                <span className="block italic text-brass">without the scramble.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-parchment-dim sm:text-lg">
                Keepwell is the platform for lockouts, rekeys, trusted access and property service history. Request help from independent local providers and keep the critical details for every property in one place.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
                  Request service
                </Link>
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-parchment transition hover:border-parchment-dim">
                  Explore membership
                </Link>
              </div>
              <p className="mt-5 max-w-2xl text-xs leading-5 text-parchment-dim/80">
                Keepwell operates the platform. Property services are performed by independent local providers. Provider availability varies by area.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-10 -z-10 rounded-full bg-brass/10 blur-3xl" />
              <div className="rounded-[28px] border border-line bg-surface/90 p-4 shadow-2xl sm:p-6">
                <div className="flex items-center justify-between border-b border-line/70 pb-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-parchment-dim">My property</div>
                    <div className="mt-1 font-display text-xl text-parchment">Home access overview</div>
                  </div>
                  <span className="rounded-full border border-verdigris/30 bg-verdigris/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-verdigris">Ready</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DashboardTile label="Need help" value="Request service" detail="Lockout · rekey · lock change" emphasized />
                  <DashboardTile label="Trusted access" value="2 contacts" detail="People who can help locally" />
                  <DashboardTile label="Access vault" value="4 records" detail="Codes, notes and lock details" />
                  <DashboardTile label="Property history" value="3 records" detail="Changes and service activity" />
                </div>
                <div className="mt-4 rounded-2xl border border-line bg-ink/45 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-parchment-dim">Platform principle</div>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">
                    Resolve with trusted access first. When a service visit is needed, create one clear request and keep the outcome attached to the property.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/25 py-8">
          <div className="mx-auto grid max-w-7xl gap-3 px-6 text-center sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {["Upfront service scope", "Independent local providers", "Property access records", "Built for repeat ownership needs"].map((item) => (
              <div key={item} className="rounded-xl border border-line/70 bg-ink/30 px-4 py-3 text-xs text-parchment-dim">{item}</div>
            ))}
          </div>
        </section>

        <section className="border-b border-line/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="eyebrow">Start with the need</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">One platform for the moments access gets complicated</h2>
              <p className="mt-4 leading-7 text-parchment-dim">The service request is only one part. Keepwell connects the immediate job to the access information and property history that make the next problem easier.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((service) => (
                <div key={service.title} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="h-1.5 w-10 rounded-full bg-brass" />
                  <h3 className="mt-5 font-display text-xl font-medium text-parchment">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{service.body}</p>
                </div>
              ))}
            </div>
            <Link href="/services" className="mt-7 inline-flex text-sm font-medium text-brass hover:underline">See service categories →</Link>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="eyebrow">How it works</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">One request. One property record. No mystery about who does what.</h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="border-t border-line pt-5">
                  <div className="font-mono text-xs text-brass">{step.n}</div>
                  <h3 className="mt-3 font-display text-xl text-parchment">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <div className="eyebrow">Built around ownership</div>
                <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">Different properties. Same need for clean access coordination.</h2>
              </div>
              <p className="max-w-2xl leading-7 text-parchment-dim lg:justify-self-end">Keepwell is designed to become more useful as ownership gets more complex: more people, more keys, more properties and more service events.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {AUDIENCES.map((audience) => (
                <Link key={audience.title} href={audience.href} className="group rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-brass/45">
                  <h3 className="font-display text-xl text-parchment">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{audience.body}</p>
                  <span className="mt-5 inline-block text-sm text-brass">Explore →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8">
            <div>
              <div className="eyebrow">Membership</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">Use Keepwell once, or keep your property protected year-round.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-parchment-dim">One-off service requests remain available. Membership adds ongoing access tools and plan benefits for owners who want Keepwell ready before something happens.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">See membership</Link>
                <Link href="/book" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment">Request one-off service</Link>
              </div>
            </div>
            <div className="rounded-3xl border border-brass/25 bg-brass/[0.06] p-7 sm:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-brass">Starting plan</div>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-5xl text-parchment">{entryPlan ? formatUsd(entryPlan.price_cents) : "$29"}</span>
                <span className="pb-1 text-sm text-parchment-dim">/ year</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-parchment-dim">A low-friction entry point for owners who want access tools and covered-event benefits configured before they need them.</p>
              <p className="mt-5 text-xs leading-5 text-parchment-dim/80">Coverage and service availability are subject to plan terms and local provider availability.</p>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <div className="eyebrow">Start with one property</div>
            <h2 className="mt-3 font-display text-4xl font-medium text-parchment sm:text-5xl">When access matters, the workflow should already exist.</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-parchment-dim">Request service now, or set up Keepwell before the next lockout, turnover or access change.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink">Request service</Link>
              <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-parchment">View membership</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function DashboardTile({ label, value, detail, emphasized = false }: { label: string; value: string; detail: string; emphasized?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${emphasized ? "border-brass/35 bg-brass/[0.07]" : "border-line bg-ink/35"}`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-parchment-dim">{label}</div>
      <div className={`mt-2 text-sm font-semibold ${emphasized ? "text-brass" : "text-parchment"}`}>{value}</div>
      <div className="mt-1 text-xs leading-5 text-parchment-dim">{detail}</div>
    </div>
  );
}
