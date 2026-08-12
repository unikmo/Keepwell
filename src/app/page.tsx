import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPlans, formatUsd } from "@/lib/plans";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

const QUICK_SERVICE_IDS = ["home_lockout_day", "standard_rekey", "standard_lock_change"];

const ACCESS_PATHS = [
  { label: "Smart or keypad access", detail: "Check the code or access instruction saved for this property." },
  { label: "Trusted key holder", detail: "Reach the neighbor, friend or family member who already has a spare." },
  { label: "Lockbox or spare-key instructions", detail: "Use the location and retrieval note you stored before the emergency." },
];

const STEPS = [
  { n: "01", title: "Check access first", body: "Use Digital Sentinel and trusted people before paying for a provider visit." },
  { n: "02", title: "See one fixed price", body: "If you still need help, choose the standard service and see the all-in price before requesting it." },
  { n: "03", title: "An independent provider accepts", body: "Keepwell routes the request through the local provider network and keeps the outcome with the property." },
];

const BUSINESS_PATHS = [
  {
    eyebrow: "Property teams",
    title: "A cleaner access workflow across multiple units.",
    body: "Route lockouts, rekeys and access work without giving providers ownership of the resident relationship.",
    href: "/for-property-managers",
    cta: "For property managers",
  },
  {
    eyebrow: "Closing gifts",
    title: "Give new homeowners a useful access layer.",
    body: "Brokerages can purchase memberships in bulk while each recipient keeps control of their own account and access data.",
    href: "/for-real-estate-agents",
    cta: "For real estate professionals",
  },
];

export default async function Home() {
  const plans = await getPlans();
  const quickServices = QUICK_SERVICE_IDS
    .map((id) => SERVICE_MENU.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-line/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(212,173,88,0.12),transparent_24rem)]" />
          <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
            <div>
              <div className="eyebrow">Property access, organized</div>
              <h1 className="mt-5 max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.035em] text-parchment sm:text-6xl lg:text-[76px]">
                Property access,
                <span className="block italic text-brass">without the scramble.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-parchment-dim lg:text-xl lg:leading-9">
                Check Digital Sentinel and trusted access first. If you still need help, request an independent local provider at one fixed all-in standard price.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-[15px] font-semibold text-ink transition hover:brightness-110">
                  Request service
                </Link>
                <Link href="/digital-sentinel" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface/35 px-7 py-3 text-[15px] font-semibold text-parchment transition hover:border-brass/45">
                  Explore Digital Sentinel
                </Link>
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-6 text-parchment-dim/80">
                Keepwell operates the platform. Property services are performed by independent local providers. Provider availability varies by area.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -inset-8 -z-10 rounded-full bg-brass/10 blur-3xl" />
              <div className="rounded-[32px] border border-line bg-surface/95 p-5 shadow-2xl sm:p-7 lg:p-8">
                <div className="flex items-center justify-between border-b border-line/70 pb-5">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-parchment-dim">My property</div>
                    <div className="mt-1.5 font-display text-2xl text-parchment">Home access overview</div>
                  </div>
                  <span className="rounded-full border border-verdigris/30 bg-verdigris/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-verdigris">Ready</span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <DashboardTile label="Need help" value="Request service" detail="Lockout · rekey · lock change" emphasized />
                  <DashboardTile label="Trusted access" value="2 people ready" detail="Spare key · authorization · emergency contact" />
                  <div className="rounded-2xl border border-brass/35 bg-brass/[0.08] p-5 sm:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-brass">Digital Sentinel</div>
                        <div className="mt-2 text-lg font-semibold text-parchment">4 protected access records</div>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-parchment-dim">Keypad codes, key locations, lockbox instructions and private reference photos—ready before you pay for a visit.</p>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brass/30 bg-ink/35 text-lg text-brass">⌁</span>
                    </div>
                  </div>
                  <DashboardTile label="Property history" value="3 service records" detail="What changed · when · provider outcome" />
                  <div className="rounded-2xl border border-line bg-ink/35 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-parchment-dim">Before dispatch</div>
                    <div className="mt-2 text-sm font-semibold text-parchment">Check access you already have.</div>
                    <div className="mt-1 text-sm leading-5 text-parchment-dim">Only request field service if those options do not solve it.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20">
          <div className="mx-auto grid max-w-[1400px] gap-px px-6 py-5 sm:grid-cols-3 sm:px-8 lg:px-10">
            {[
              ["One all-in price", "Provider travel/service call included"],
              ["Access first", "Try no-dispatch options before a paid visit"],
              ["Independent providers", "Provider identity appears after acceptance"],
            ].map(([title, body]) => (
              <div key={title} className="px-0 py-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <div className="text-sm font-semibold text-parchment">{title}</div>
                <div className="mt-1 text-sm leading-5 text-parchment-dim">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-10">
            <div>
              <div className="eyebrow">Digital Sentinel</div>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-parchment sm:text-5xl">
                Check the access you already have before paying for a visit.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-parchment-dim sm:text-lg sm:leading-8">
                The most useful lockout is the one you solve without dispatching anyone. Keep the access details and people that can get you back in attached to the property.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href="/digital-sentinel" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">See how Sentinel works</Link>
                <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-parchment">Membership from $29/year</Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-line bg-surface/75 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">Before you request a $99 daytime lockout</div>
                  <div className="mt-2 font-display text-2xl text-parchment">Try these first</div>
                </div>
                <span className="rounded-full border border-verdigris/30 bg-verdigris/10 px-3 py-1 text-xs font-medium text-verdigris">No dispatch</span>
              </div>
              <div className="mt-4 space-y-3">
                {ACCESS_PATHS.map((path, index) => (
                  <div key={path.label} className="grid grid-cols-[34px_1fr] gap-4 rounded-2xl border border-line/80 bg-ink/30 p-4">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-brass/30 font-mono text-[11px] text-brass">0{index + 1}</div>
                    <div>
                      <div className="text-[15px] font-semibold text-parchment">{path.label}</div>
                      <div className="mt-1 text-sm leading-6 text-parchment-dim">{path.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-brass/30 bg-brass/[0.07] p-4">
                <div>
                  <div className="text-sm font-semibold text-parchment">Still locked out?</div>
                  <div className="mt-1 text-sm text-parchment-dim">Request the fixed-price provider service.</div>
                </div>
                <Link href="/book/details?service_id=home_lockout_day" className="shrink-0 text-sm font-semibold text-brass hover:underline">$99 →</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20 py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="eyebrow">Fixed standard prices</div>
                <h2 className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-[-0.02em] text-parchment sm:text-5xl">Know the standard price before you request service.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-parchment-dim lg:text-right">No separate driving fee. Standard prices include the provider travel/service call. Any excluded hardware or out-of-scope work must be disclosed before it is performed.</p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {quickServices.map((service) => (
                <div key={service.id} className="group rounded-[24px] border border-line bg-ink/35 p-6 transition hover:-translate-y-0.5 hover:border-brass/45">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">{service.timing}</div>
                      <h3 className="mt-3 font-display text-2xl text-parchment">{service.title}</h3>
                    </div>
                    <div className="font-display text-4xl text-brass">{formatServicePrice(service.customerPriceCents)}</div>
                  </div>
                  <div className="mt-5 border-t border-line/70 pt-4 text-sm leading-6 text-parchment-dim">Provider travel/service call included.</div>
                  <Link href={`/book/details?service_id=${service.id}`} className="mt-5 inline-flex text-sm font-semibold text-brass hover:underline">Request this service →</Link>
                </div>
              ))}
            </div>
            <div className="mt-6"><Link href="/services" className="text-sm font-semibold text-parchment hover:text-brass">See every service and price →</Link></div>
          </div>
        </section>

        <section className="border-b border-line/70 py-14 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
              <div>
                <div className="eyebrow">How it works</div>
                <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.02em] text-parchment">Access first. Field service second.</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {STEPS.map((step) => (
                  <div key={step.n} className="border-t border-line pt-5">
                    <div className="font-mono text-[11px] text-brass">{step.n}</div>
                    <h3 className="mt-3 text-base font-semibold text-parchment">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-parchment-dim">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/20 py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <div className="eyebrow">Membership</div>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.02em] text-parchment sm:text-5xl">Useful before the emergency, not only during it.</h2>
              <p className="mt-5 text-base leading-7 text-parchment-dim sm:text-lg">Digital Sentinel activates immediately. Field-service membership benefits begin after the applicable 14-day waiting period. One-off service remains available without membership.</p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const plus = plan.id === "household_plus";
                const benefits = plan.id === "individual"
                  ? ["Digital Sentinel", "1 trusted key holder", "Fixed all-in service pricing"]
                  : plan.id === "household"
                    ? ["Everything in Individual", "Household access profiles", "Unlimited trusted contacts"]
                    : ["Everything in Household", "Priority matching when available", "Lock & Access Audit every 3 years"];

                return (
                  <div key={plan.id} className={`rounded-[26px] border p-6 ${plus ? "border-brass/45 bg-brass/[0.07]" : "border-line bg-ink/35"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.15em] ${plus ? "text-brass" : "text-parchment-dim"}`}>{plus ? "Most complete" : "Annual membership"}</div>
                        <h3 className="mt-2 font-display text-2xl text-parchment">{plan.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-4xl text-parchment">{formatUsd(plan.price_cents)}</div>
                        <div className="mt-1 text-xs text-parchment-dim">per year</div>
                      </div>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-parchment-dim">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-3"><span className="mt-0.5 text-brass">✓</span><span>{benefit}</span></li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink">Compare membership</Link>
              <Link href="/book" className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-parchment">Request one-off service</Link>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 py-14 sm:py-16">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-4 lg:grid-cols-2">
              {BUSINESS_PATHS.map((path) => (
                <Link key={path.href} href={path.href} className="group rounded-[26px] border border-line bg-surface/45 p-6 transition hover:border-brass/45 sm:p-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-brass">{path.eyebrow}</div>
                  <h2 className="mt-3 max-w-xl font-display text-3xl text-parchment">{path.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-parchment-dim">{path.body}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-brass">{path.cta} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
            <div className="eyebrow">Start with one property</div>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-parchment sm:text-5xl">When access matters, the workflow should already exist.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-parchment-dim">Set up your access information now, or request fixed-price service when you need a provider.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/digital-sentinel" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-[15px] font-semibold text-ink">Set up Digital Sentinel</Link>
              <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-7 py-3 text-[15px] font-semibold text-parchment">Request service</Link>
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
    <div className={`rounded-2xl border p-5 ${emphasized ? "border-brass/35 bg-brass/[0.07]" : "border-line bg-ink/35"}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-parchment-dim">{label}</div>
      <div className={`mt-2 text-[15px] font-semibold ${emphasized ? "text-brass" : "text-parchment"}`}>{value}</div>
      <div className="mt-1.5 text-sm leading-5 text-parchment-dim">{detail}</div>
    </div>
  );
}
