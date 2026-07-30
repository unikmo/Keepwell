import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Digital Sentinel for Property Managers — Cut Lockout Calls, Add a Resident Perk",
  description:
    "Give every resident covered lockout dispatch, a digital key vault, and trusted-access sharing — and take 2am lockout calls off your on-call staff's plate. See how portfolio partnerships work.",
  alternates: { canonical: "/for-property-managers" },
};

const PAIN_POINTS = [
  {
    title: "Lockouts land on your team, not a vendor",
    body: "Whoever's on call at 11pm handles it — a drive across the property, a spare-key hunt, or an expensive after-hours locksmith you didn't budget for.",
  },
  {
    title: "Spare keys are a liability, not a system",
    body: "A drawer of labeled keys in the leasing office is one mislabeled hook away from a bad afternoon, and it doesn't scale past a few dozen units.",
  },
  {
    title: "Turnover means rekeying, on a clock",
    body: "Between move-out and move-in you're coordinating a locksmith on a deadline — every single unit turn, every single time.",
  },
];

const BENEFITS = [
  {
    icon: "🔑",
    title: "Dispatch, not your maintenance line",
    body: "Residents open the app and tap Get help. A vetted, background-checked tech shows up — your staff never gets the call.",
  },
  {
    icon: "🗄️",
    title: "A real digital vault, not a key drawer",
    body: "Unit codes, gate codes, and lockbox combinations live encrypted per-resident instead of on a labeled hook in the office.",
  },
  {
    icon: "🛡️",
    title: "Onboarding audits at move-in",
    body: "The top-tier plan includes a guaranteed visit that checks entry points and installs a smart lock — a stronger unit on day one, without your team scheduling it.",
  },
  {
    icon: "📉",
    title: "Fewer after-hours calls, on paper",
    body: "We can share aggregate dispatch data for your portfolio so you can show ownership the actual reduction in after-hours maintenance requests.",
  },
];

const FAQS = [
  {
    q: "Is this an amenity we pay for, or something residents buy themselves?",
    a: "Both models work. Some properties offer it as a paid resident perk residents opt into directly; others negotiate a portfolio rate and include it in the amenity package. We'll work out what fits your properties on a call.",
  },
  {
    q: "Does this replace our maintenance team for lockouts?",
    a: "For covered events — home lockouts, car-at-home lockouts, and standard rekeys — yes, dispatch goes to a Digital Sentinel tech instead of your staff. Anything outside that scope still routes to you as normal.",
  },
  {
    q: "How fast is response time across a portfolio?",
    a: "Response time depends on tech density in your metro area — our current average is 14 minutes. We'll give you real numbers for your specific properties before you commit to anything.",
  },
  {
    q: "What happens at lease turnover?",
    a: "A resident's vault and covered events are tied to their membership, not the unit. When they move out, access is revoked from your side and the next resident can start fresh.",
  },
];

export default function PropertyManagersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="For property managers"
          title="Take lockout calls off your team's plate"
          body="A resident membership that covers lockouts, rekeys, and key management — so 'I'm locked out' stops being your on-call staff's problem at 2am."
        />

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">The problem</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Lockouts are a staffing cost you didn&rsquo;t sign up for
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {PAIN_POINTS.map((p) => (
                <div key={p.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-lg font-medium text-parchment">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 bg-surface/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <div className="eyebrow">How it helps your portfolio</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                One membership, offered at the property level
              </h2>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-2xl border border-line bg-surface p-6">
                  <div className="text-2xl">{b.icon}</div>
                  <h3 className="mt-4 font-display text-lg font-medium text-parchment">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <div className="eyebrow">Questions we get</div>
              <h2 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
                Property manager FAQ
              </h2>
            </div>
            <div className="mt-12 space-y-6">
              {FAQS.map((f) => (
                <div key={f.q} className="border-b border-line/70 pb-6">
                  <h3 className="font-medium text-parchment">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTABand
          title="Let's talk about your portfolio"
          body="Tell us how many units and where — we'll come back with real response-time numbers and partnership pricing for your properties."
          ctaLabel="Contact partnerships"
          ctaHref="/contact?topic=Partnership"
          secondaryLabel="See member pricing"
          secondaryHref="/pricing"
        />
      </main>
      <Footer />
    </div>
  );
}
