import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Help Center — Digital Sentinel",
  description:
    "Answers to common questions about Digital Sentinel membership: what's covered, how dispatch works, billing, canceling, vault security, and trusted access.",
  alternates: { canonical: "/help" },
};

const SECTIONS = [
  {
    title: "Coverage & dispatch",
    items: [
      {
        q: "What actually counts as a covered event?",
        a: "A home lockout, a car locked out at your home address, or a standard rekey. All three draw from the same yearly pool of covered events on your plan. Full lock replacement or smart-lock hardware are priced separately and always shown before anyone starts work.",
      },
      {
        q: "How do I request help if I'm locked out right now?",
        a: "Open the app and tap Get help — don't use the website contact form for an active lockout, since it isn't monitored in real time. The app dispatches a verified local tech and shows you their name, rating, and ETA immediately.",
      },
      {
        q: "How fast is response time?",
        a: "Our current average is 14 minutes in metro areas. Actual time depends on tech availability nearby, and you'll see a live ETA the moment a tech is assigned.",
      },
      {
        q: "What if I run out of covered events for the year?",
        a: "You can still request dispatch — you'll just see the flat per-visit price before confirming, the same price-certainty promise as covered visits, just billed instead of pooled.",
      },
    ],
  },
  {
    title: "Billing & membership",
    items: [
      {
        q: "How is billing structured?",
        a: "Annual membership, billed once a year per the plan you choose. Covered events refresh at renewal, unused events don't carry over, and add-ons like lockbox registration are billed once at signup.",
      },
      {
        q: "Can I upgrade or downgrade my plan?",
        a: "Yes, from your account settings — changes take effect at your next renewal so you're never charged twice for the same coverage period.",
      },
      {
        q: "How do I cancel?",
        a: "Contact us through the form below or the in-app support line and we'll process it — see the Member Agreement for the full cancellation and refund policy.",
      },
    ],
  },
  {
    title: "Vault & trusted access",
    items: [
      {
        q: "Is my vault actually secure?",
        a: "Everything you store — key photos, gate codes, lockbox combinations — is encrypted on your device. We deliberately scope the vault to everyday household keys and codes only; it's never used for legal or estate documentation.",
      },
      {
        q: "Who can see what's in my trusted contacts?",
        a: "Only you. Trusted contacts you add can be granted \"key holder\" or \"can authorize\" permissions, but they don't get visibility into your vault contents unless you explicitly share something with them.",
      },
      {
        q: "What's a lockbox code, and how is it different from dispatch?",
        a: "It's a physical lockbox code you register with us. If you're locked out, using the code resolves it immediately with no dispatch, no wait, and no cost — it's the fastest path back inside if you've set one up.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Help center"
          title="Answers to the questions we hear most"
          body="If you're locked out right now, open the app and tap Get help instead of reading this page. Everything else lives here."
        />

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="mb-16 last:mb-0">
                <h2 className="font-display text-2xl font-medium text-parchment">{section.title}</h2>
                <div className="mt-8 space-y-6">
                  {section.items.map((item) => (
                    <div key={item.q} className="border-b border-line/70 pb-6">
                      <h3 className="font-medium text-parchment">{item.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <CTABand
          title="Still stuck?"
          body="For account, billing, or anything not covered here, reach the member support team directly."
          ctaLabel="Contact support"
          ctaHref="/contact"
        />
      </main>
      <Footer />
    </div>
  );
}
