import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = { title: "Keepwell for real estate professionals", description: "Give buyers a useful move-in access setup through bulk Keepwell memberships and activation codes.", alternates: { canonical: "/for-real-estate-agents" } };
const REASONS=[
  {title:"The rekey conversation already exists",body:"New owners are already thinking about who has keys. Keepwell turns that advice into a useful move-in access product."},
  {title:"Useful after closing",body:"Digital Sentinel, trusted key holders and fixed-price service remain useful long after a gift basket is gone."},
  {title:"Bulk purchase",body:"Brokerages can buy 10, 25, 50 or 100 memberships and distribute activation codes across closings."},
  {title:"Buyer owns the account",body:"The recipient activates and controls their own Keepwell account. Gifted terms do not silently renew on the agent's payment method."},
];
export default function RealEstateAgentsPage(){return <div className="flex min-h-screen flex-col"><Nav/><main className="flex-1"><PageHero eyebrow="For real estate professionals" title="Turn 'you should rekey after closing' into a useful move-in product" body="Gift Keepwell in bulk: Digital Sentinel, trusted access, fixed-price provider service and a property-access record the buyer keeps using."/>
<section className="border-b border-line/70 py-20"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{REASONS.map(i=><div key={i.title} className="rounded-2xl border border-line bg-surface p-6"><h2 className="font-display text-xl text-parchment">{i.title}</h2><p className="mt-2 text-sm leading-6 text-parchment-dim">{i.body}</p></div>)}</div></div></section>
<section className="py-20"><div className="mx-auto max-w-5xl px-6"><div className="grid gap-8 md:grid-cols-3">{[{n:"01",title:"Buy a batch",body:"Choose a plan and a 10/25/50/100-membership package."},{n:"02",title:"Issue activation codes",body:"After payment confirmation, the brokerage receives individual codes for closings."},{n:"03",title:"Buyer activates",body:"The buyer creates their own Keepwell account; the brokerage can track unused vs activated codes."}].map(s=><div key={s.n} className="border-t border-line pt-5"><div className="font-mono text-xs text-brass">{s.n}</div><h2 className="mt-3 font-display text-xl text-parchment">{s.title}</h2><p className="mt-2 text-sm leading-6 text-parchment-dim">{s.body}</p></div>)}</div></div></section>
<CTABand title="Build a closing-gift program that buyers keep using" body="Create a brokerage workspace, choose a bulk package and manage activation codes." ctaLabel="Open brokerage workspace" ctaHref="/brokerage" secondaryLabel="See membership" secondaryHref="/pricing"/></main><Footer/></div>}
