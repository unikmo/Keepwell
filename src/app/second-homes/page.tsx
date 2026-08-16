import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: "Trusted Locksmith for Second Homes",
  description: "Organize trusted property access, local locksmith requests and access history for second homes and properties you do not occupy full-time.",
  alternates: { canonical: "/second-homes" },
};

const USE_CASES = [
  { title: "You are hours away", body: "Keep the people, codes and locksmith service history that matter when you cannot solve an access issue in person." },
  { title: "Guests need access", body: "Keep trusted-access information organized without turning every arrival into a search through old messages." },
  { title: "A key is lost", body: "Create a rekey or lock-change request with the property context already in one place." },
  { title: "A local person can solve it", body: "Check trusted access before escalating to a paid locksmith visit." },
];

export default function SecondHomesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <PageHero
          eyebrow="Trusted Locksmith for second homes"
          title="Your property still needs an access plan when you are not there"
          body="Organize the people, access information and local locksmith requests behind a second home so distance does not turn a small issue into a scramble."
        />
        <section className="border-b border-line/70 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {USE_CASES.map((item) => (
                <div key={item.title} className="rounded-2xl border border-line bg-surface p-6">
                  <h2 className="font-display text-xl text-parchment">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-parchment-dim">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="eyebrow">A better default</div>
            <h2 className="mt-3 font-display text-3xl text-parchment">Trusted access first. Local locksmith when you still need one.</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-parchment-dim">Digital Access can help owners avoid unnecessary service visits when a trusted local contact or registered access method can solve the problem immediately.</p>
          </div>
        </section>
        <CTABand
          title="Set up the access layer around your second home"
          body="Start with Trusted Locksmith membership, or find a local locksmith when you need on-site help now."
          ctaLabel="See membership"
          ctaHref="/pricing"
          secondaryLabel="Find a locksmith"
          secondaryHref="/book"
        />
      </main>
      <Footer />
    </div>
  );
}
