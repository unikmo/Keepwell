import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPlans, formatUsd } from "@/lib/plans";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

const HERO_IMAGE = "https://images.unsplash.com/photo-1711098256657-f40961037781?auto=format&fit=crop&fm=jpg&q=82&w=1800";
const KEY_IMAGE = "https://images.unsplash.com/photo-1733244766159-f58f4184fd38?auto=format&fit=crop&fm=jpg&q=82&w=1800";
const QUICK_SERVICE_IDS = ["home_lockout_day", "standard_rekey", "standard_lock_change"];

export default async function Home() {
  const plans = await getPlans();
  const quickServices = QUICK_SERVICE_IDS
    .map((id) => SERVICE_MENU.find((service) => service.id === id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <section className="border-b border-line/70">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 sm:px-8 sm:py-18 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-10 lg:py-20">
            <div className="max-w-2xl">
              <div className="eyebrow">Property access, organized</div>
              <h1 className="mt-5 font-display text-5xl font-medium leading-[.98] tracking-[-.035em] text-parchment sm:text-6xl lg:text-[72px]">
                Property access,
                <span className="block italic text-brass">without the scramble.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-parchment-dim">
                Check the access you already have. If you still need help, request an independent local provider at one fixed all-in standard price.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/digital-sentinel" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-[15px] font-semibold text-ink shadow-[0_10px_28px_rgba(214,173,87,0.16)] transition hover:brightness-110">
                  Set up Digital Sentinel
                </Link>
                <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/30 bg-surface/35 px-7 py-3 text-[15px] font-semibold text-parchment transition hover:border-sky/55 hover:bg-surface/55">
                  Request service
                </Link>
              </div>
              <p className="mt-5 text-sm leading-6 text-parchment-dim/85">
                Keepwell operates the platform. Field work is performed by independent local providers.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[34px] border border-sky/20 bg-surface-raised shadow-[0_28px_70px_rgba(3,18,37,0.32)]">
              <img src={HERO_IMAGE} alt="Modern residential front entrance" className="h-[430px] w-full object-cover sm:h-[520px]" loading="eager" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-ink/90 p-5 backdrop-blur-md sm:inset-x-6 sm:bottom-6">
                <div className="font-mono text-[10px] uppercase tracking-[.16em] text-brass">Before you call anyone</div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-display text-2xl text-parchment">Check Digital Sentinel first.</div>
                  <span className="text-sm text-parchment-dim">Codes · spare keys · trusted people</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/55">
          <div className="mx-auto grid max-w-[1400px] gap-5 px-6 py-6 sm:grid-cols-3 sm:px-8 lg:px-10">
            {[
              ["One all-in price", "Travel/service call included"],
              ["Access first", "Try no-dispatch options before paying"],
              ["Independent providers", "Identity appears after acceptance"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-sky/10 bg-ink/10 px-4 py-3 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
                <div className="text-sm font-semibold text-parchment">{title}</div>
                <div className="mt-1 text-sm text-parchment-dim">{body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-[#c7d9ec] bg-mist py-16 text-navy-text sm:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-6 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:px-10">
            <div className="overflow-hidden rounded-[30px] border border-[#c7d9ec] bg-white shadow-[0_24px_60px_rgba(28,65,105,0.14)]">
              <img src={KEY_IMAGE} alt="House keys held near an open front door" className="h-[420px] w-full object-cover sm:h-[500px]" loading="lazy" />
            </div>
            <div className="max-w-xl">
              <div className="font-mono text-xs uppercase tracking-[.14em] text-[#7d6330]">Digital Sentinel</div>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.04] tracking-[-.025em] text-navy-text sm:text-5xl">
                Solve the lockout before it becomes a service call.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#46617f]">
                Keep the few access details that matter attached to the property, ready when you need them.
              </p>
              <div className="mt-7 divide-y divide-[#c7d9ec] border-y border-[#c7d9ec]">
                {[
                  ["01", "Smart or keypad access", "Retrieve the saved instruction or code."],
                  ["02", "Trusted key holder", "Reach the person who already has a spare."],
                  ["03", "Lockbox or spare-key note", "Find the location and retrieval instruction."],
                ].map(([n, title, body]) => (
                  <div key={n} className="grid grid-cols-[42px_1fr] gap-4 py-5">
                    <div className="font-mono text-xs text-[#8c6d31]">{n}</div>
                    <div>
                      <div className="font-semibold text-navy-text">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-[#536e8a]">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/digital-sentinel" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink shadow-[0_8px_22px_rgba(150,119,59,0.18)] transition hover:brightness-105">
                Explore Digital Sentinel
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/45 py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <div className="eyebrow">If you still need a provider</div>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.025em] text-parchment sm:text-5xl">Know the standard price first.</h2>
              <p className="mt-4 text-base leading-7 text-parchment-dim">No separate driving fee. Standard prices include the provider travel/service call.</p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {quickServices.map((service) => (
                <div key={service.id} className="rounded-[24px] border border-sky/15 bg-ink/28 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[.14em] text-parchment-dim">{service.timing}</div>
                      <h3 className="mt-3 font-display text-2xl text-parchment">{service.title}</h3>
                    </div>
                    <div className="font-display text-4xl text-brass">{formatServicePrice(service.customerPriceCents)}</div>
                  </div>
                  <Link href={`/book/details?service_id=${service.id}`} className="mt-6 inline-flex text-sm font-semibold text-brass hover:underline">Request service →</Link>
                </div>
              ))}
            </div>
            <Link href="/services" className="mt-6 inline-flex text-sm font-semibold text-parchment hover:text-brass">See all services and prices →</Link>
          </div>
        </section>

        <section className="border-b border-line/70 py-16 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
              <div className="max-w-lg">
                <div className="eyebrow">Membership</div>
                <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.025em] text-parchment sm:text-5xl">Useful before the emergency.</h2>
                <p className="mt-4 text-base leading-7 text-parchment-dim">Digital Sentinel activates immediately. One-off service remains available without membership.</p>
                <Link href="/pricing" className="mt-6 inline-flex text-sm font-semibold text-brass hover:underline">Compare membership →</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div key={plan.id} className={`rounded-[22px] border p-5 ${plan.id === "household_plus" ? "border-brass/45 bg-brass/[.075]" : "border-sky/15 bg-surface/62"}`}>
                    <div className="text-sm font-semibold text-parchment">{plan.name}</div>
                    <div className="mt-3 flex items-end gap-1">
                      <span className="font-display text-4xl text-parchment">{formatUsd(plan.price_cents)}</span>
                      <span className="pb-1 text-xs text-parchment-dim">/year</span>
                    </div>
                    <div className="mt-4 text-sm leading-6 text-parchment-dim">
                      {plan.id === "individual" && "Digital Sentinel + 1 trusted key holder."}
                      {plan.id === "household" && "Household profiles + unlimited trusted contacts."}
                      {plan.id === "household_plus" && "Priority matching + Lock & Access Audit every 3 years."}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/42 py-10">
          <div className="mx-auto grid max-w-[1400px] gap-4 px-6 sm:px-8 md:grid-cols-2 lg:px-10">
            <Link href="/for-property-managers" className="group rounded-2xl border border-sky/15 bg-ink/20 p-5 transition hover:border-brass/45 hover:bg-ink/30">
              <div className="font-mono text-[10px] uppercase tracking-[.14em] text-brass">Property managers</div>
              <div className="mt-2 font-display text-2xl text-parchment">Coordinate access across multiple units →</div>
            </Link>
            <Link href="/for-real-estate-agents" className="group rounded-2xl border border-sky/15 bg-ink/20 p-5 transition hover:border-brass/45 hover:bg-ink/30">
              <div className="font-mono text-[10px] uppercase tracking-[.14em] text-brass">Real estate</div>
              <div className="mt-2 font-display text-2xl text-parchment">Give new homeowners a useful access layer →</div>
            </Link>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
            <div className="eyebrow">Start with one property</div>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-[-.025em] text-parchment sm:text-5xl">Be ready before access becomes urgent.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-parchment-dim">
              Organize access now, or use Keepwell to request an independent local provider when you need one.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/digital-sentinel" className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-7 py-3 text-sm font-semibold text-ink shadow-[0_10px_28px_rgba(214,173,87,0.14)]">Set up Digital Sentinel</Link>
              <Link href="/book" className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/30 bg-surface/30 px-7 py-3 text-sm font-semibold text-parchment transition hover:border-sky/55">Request service</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
