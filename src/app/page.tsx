import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getPlans, planDisplay, formatUsd } from "@/lib/plans";

const FEATURES = [
  {
    icon: "🔒",
    title: "Covered dispatch",
    body: "Locked out of your home or car? A verified local tech comes to you — no charge, no surprise invoice.",
  },
  {
    icon: "🔑",
    title: "Digital key vault",
    body: "Every key, code, and garage password — photographed, encrypted, and stored where you can never lose it.",
  },
  {
    icon: "🤝",
    title: "Trusted access",
    body: "Register a neighbor, family member, or locksmith you already trust so help doesn't wait on you.",
  },
  {
    icon: "🛡️",
    title: "Home security audit",
    body: "A free once-over of your home and its weak points, with upgrade options at a locked-in member price.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Join in 3 minutes",
    body: "Pick a plan, add your household, register a trusted contact or lockbox. No truck roll required to sign up.",
  },
  {
    n: "02",
    title: "Live your life",
    body: "Your keys and codes live in the vault. Nothing else to track or worry about until you actually need something.",
  },
  {
    n: "03",
    title: "One tap, if it happens",
    body: "Locked out? Open the app, tap Get help. A verified tech is on the way, phone in hand.",
  },
];

export default async function Home() {
  const plans = await getPlans();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line/70">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-24">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
              {/* MASCOT */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 -z-10 rounded-full bg-brass/15 blur-3xl" />
                  <div className="absolute bottom-1 left-1/2 z-0 h-5 w-28 -translate-x-1/2 rounded-full bg-black/50 blur-md sm:h-6 sm:w-36 lg:w-40" />
                  <Image
                    src="/kayo-mascot.png"
                    alt="Kayo, the Keepwell mascot — a warm brass key-shaped character"
                    width={785}
                    height={1400}
                    priority
                    className="relative z-10 h-auto w-52 drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)] sm:w-64 lg:w-full lg:max-w-[320px]"
                  />
                </div>
              </div>

              {/* TEXT */}
              <div className="text-center lg:text-left">
                <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brass/35 bg-brass/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-brass lg:mx-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                  Member in 3 minutes
                </div>

                <h1 className="font-display text-4xl font-medium leading-tight text-parchment sm:text-5xl">
                  You&rsquo;ll probably never need us.
                  <br />
                  <span className="italic text-brass">That&rsquo;s kind of the point.</span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-parchment-dim lg:mx-0">
                  A small membership for the home things you hope you&rsquo;ll never deal with —
                  locked out, rekeyed, or just want your keys somewhere safer than a junk drawer.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/pricing"
                    className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
                  >
                    See plans — from $29/yr
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="rounded-full border border-line px-6 py-3 text-sm font-medium text-parchment transition hover:border-parchment-dim"
                  >
                    How it works
                  </Link>
                </div>

                <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-parchment-dim">
                  No contracts · Vetted techs · Verified local techs
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-line/70 bg-surface/40">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4">
              <Stat value="4.9★" label="Avg tech rating" />
              <Stat value="14 min" label="Avg response, metro" />
              <Stat value="100%" label="Background-checked" />
              <Stat value="$0" label="Covered visits" />
            </div>
          </div>
        </section>

        {/* INCLUDED */}
        <section id="included" className="border-b border-line/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">What&rsquo;s included</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                One membership, four everyday reasons to keep it
              </h2>
              <p className="mt-4 text-parchment-dim">
                Not just an emergency plan — the parts you&rsquo;ll actually use often.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-line bg-surface p-6 transition hover:border-brass/40"
                >
                  <div className="text-2xl">{f.icon}</div>
                  <h3 className="mt-4 font-display text-lg font-medium text-parchment">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-b border-line/70 bg-surface/30 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">How it works</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Three minutes to set up. There when you need it.
              </h2>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center sm:text-left">
                  <div className="font-mono text-sm text-brass">{s.n}</div>
                  <h3 className="mt-3 font-display text-xl font-medium text-parchment">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-b border-line/70 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">Pricing</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Less than a streaming subscription
              </h2>
              <p className="mt-4 text-parchment-dim">
                Every plan covers the whole approach — vault, trusted access, and dispatch.
                Higher tiers widen who and what&rsquo;s covered.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const { features, addOns, tagline } = planDisplay(plan);
                const highlighted = plan.id === "household";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-8 ${
                      highlighted
                        ? "border-brass bg-surface-raised shadow-[0_0_0_1px_rgba(201,162,75,0.4)]"
                        : "border-line bg-surface"
                    }`}
                  >
                    {highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brass px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">
                        Most members choose this
                      </div>
                    )}
                    <div className="font-mono text-xs uppercase tracking-wide text-parchment-dim">
                      {plan.name}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-medium text-parchment">
                        {formatUsd(plan.price_cents)}
                      </span>
                      <span className="text-sm text-parchment-dim">/year</span>
                    </div>
                    <p className="mt-2 text-sm text-parchment-dim">{tagline}</p>

                    <ul className="mt-6 space-y-3 text-sm">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-parchment">
                          <span className="mt-0.5 text-verdigris">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {addOns && (
                      <ul className="mt-3 space-y-2 border-t border-line/70 pt-3 text-sm">
                        {addOns.map((a) => (
                          <li key={a.label} className="flex items-start justify-between gap-2 text-parchment-dim">
                            <span className="flex items-start gap-2">
                              <span className="mt-0.5 text-brass">+</span>
                              {a.label}
                            </span>
                            <span className="font-mono text-xs text-brass whitespace-nowrap">{a.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex-1" />

                    <Link
                      href={`/signup?plan=${plan.id}`}
                      className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                        highlighted
                          ? "bg-brass text-ink hover:bg-[#dab668]"
                          : "border border-line text-parchment hover:border-parchment-dim"
                      }`}
                    >
                      Choose {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-brass/20 bg-brass/[0.06] p-5 text-sm leading-relaxed text-parchment-dim">
              <strong className="text-parchment">What counts as a &ldquo;covered event&rdquo;?</strong> A
              home lockout, a car locked at your home address, or a standard rekey — pulled from
              the same yearly pool. Full lock or smart-lock replacement are priced separately,
              always shown before anyone starts work.
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-medium text-parchment sm:text-4xl">
              Set it up once. Forget about it, mostly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-parchment-dim">
              Join in under three minutes — no truck roll, no waiting period to add your vault
              and trusted contacts.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
            >
              Get covered — from $29/yr
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-xl text-brass sm:text-2xl">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-parchment-dim">
        {label}
      </div>
    </div>
  );
}
