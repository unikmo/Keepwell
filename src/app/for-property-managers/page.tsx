import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = { title: "Keepwell for property managers", description: "Standardize resident lockouts, rekeys, access records and provider coordination across properties with Keepwell.", alternates: { canonical: "/for-property-managers" } };

const PROBLEMS = [
  { title: "After-hours lockouts become staffing problems", body: "Residents call whoever is on duty, and access work becomes an unplanned maintenance workflow." },
  { title: "Rekeys repeat without a system", body: "Every turnover can trigger the same calls, scheduling and follow-up with little reusable property context." },
  { title: "Access data lives everywhere", body: "Keys, lockboxes, gate notes and service history end up split across desks, texts and vendor records." },
];
const WORKFLOWS = [
  { title: "Resident service requests", body: "Give lockout and access requests a defined intake path instead of routing everything through the on-call line." },
  { title: "Turnover rekeys", body: "Create a repeatable property-level request for rekey work between move-out and move-in." },
  { title: "Independent provider marketplace", body: "Keepwell routes work to participating independent providers with clear scope and fixed provider payouts." },
  { title: "Portfolio history", body: "Keep the access-service record at property/unit level so future requests start with context." },
];

export default function PropertyManagersPage() { return <div className="flex min-h-screen flex-col"><Nav/><main className="flex-1">
  <PageHero eyebrow="For property managers" title="Take property-access work out of the ad-hoc maintenance queue" body="Keepwell creates one workflow for resident lockouts, turnover rekeys, access records and independent-provider coordination across the portfolio."/>
  <section className="border-b border-line/70 py-20"><div className="mx-auto max-w-6xl px-6"><div className="grid gap-6 md:grid-cols-3">{PROBLEMS.map(i=><div key={i.title} className="rounded-2xl border border-line bg-surface p-6"><h2 className="font-display text-xl text-parchment">{i.title}</h2><p className="mt-2 text-sm leading-6 text-parchment-dim">{i.body}</p></div>)}</div></div></section>
  <section className="border-b border-line/70 bg-surface/20 py-20"><div className="mx-auto max-w-6xl px-6"><div className="max-w-2xl"><div className="eyebrow">Operational loop</div><h2 className="mt-3 font-display text-3xl text-parchment">Property manager → Keepwell → provider → property record</h2><p className="mt-4 leading-7 text-parchment-dim">Keepwell remains the commercial and workflow layer. Independent providers perform field work; reporting, approvals and repeat requests stay with the property-manager account.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{WORKFLOWS.map(i=><div key={i.title} className="rounded-2xl border border-line bg-surface p-6"><h3 className="font-display text-xl text-parchment">{i.title}</h3><p className="mt-2 text-sm leading-6 text-parchment-dim">{i.body}</p></div>)}</div></div></section>
  <section className="py-20"><div className="mx-auto max-w-4xl px-6"><div className="rounded-3xl border border-brass/25 bg-brass/[0.06] p-8"><div className="eyebrow">Pilot structure</div><h2 className="mt-3 font-display text-3xl text-parchment">Start with repeat lockouts and turnover rekeys</h2><p className="mt-4 leading-7 text-parchment-dim">Create the portfolio workspace, add properties and submit real service requests through the operating dashboard. Keepwell can manually route the first Boston jobs while measuring provider acceptance and completion quality.</p></div></div></section>
  <CTABand title="Put one access workflow on Keepwell" body="Create a portfolio workspace and start with a narrow property set." ctaLabel="Open property-manager workspace" ctaHref="/property-manager" secondaryLabel="See fixed pricing" secondaryHref="/pricing"/>
</main><Footer/></div>; }
