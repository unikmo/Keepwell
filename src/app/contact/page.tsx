import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { submitContact } from "./actions";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Keepwell about customer support, property partnerships, provider applications or trust and safety.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string; topic?: string }>;
}) {
  const { error, sent, topic } = await searchParams;
  const topics = ["Customer support", "Billing", "Partnership", "Provider", "Trust & safety", "Something else"];
  const defaultTopic = topics.includes(topic ?? "") ? topic! : "Customer support";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="eyebrow">Contact Keepwell</div>
              <h1 className="mt-3 font-display text-4xl font-medium text-parchment sm:text-5xl">Choose the right route and keep the request clear</h1>
              <p className="mt-5 max-w-xl leading-7 text-parchment-dim">
                Need property-access service? Start a service request instead of using support. Use this form for account, billing, partnership, provider or trust-and-safety questions.
              </p>
              <a href="/book" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink">Request service</a>
              <div className="mt-10 space-y-5 text-sm text-parchment-dim">
                <Info title="Customer support" body="Account, membership and platform questions." />
                <Info title="Property partnerships" body="Property managers, landlords and real-estate professionals." />
                <Info title="Provider network" body="Independent providers applying to receive marketplace requests." />
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              {sent && <div className="mb-6 rounded-xl border border-verdigris/30 bg-verdigris/10 px-4 py-3 text-sm text-verdigris">Message sent. Keepwell will follow up using the contact information you provided.</div>}
              {error && <div className="mb-6 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">{error}</div>}
              <form action={submitContact} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name"><input type="text" name="name" required autoComplete="name" placeholder="Your name" className="field" /></Field>
                  <Field label="Email"><input type="email" name="email" required autoComplete="email" placeholder="you@email.com" className="field" /></Field>
                </div>
                <Field label="Topic">
                  <select name="topic" defaultValue={defaultTopic} className="field">
                    {topics.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Message"><textarea name="message" required rows={6} placeholder="Tell us what you need and include the property market or service area if relevant." className="field resize-y" /></Field>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-full bg-brass px-6 py-2.5 text-sm font-semibold text-ink">Send message</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`.field{width:100%;border:1px solid var(--line);background:var(--surface-raised);border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;color:var(--parchment);outline:none}.field:focus{border-color:var(--brass)}.field::placeholder{color:color-mix(in srgb,var(--parchment-dim) 60%,transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children?: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-dim">{label}</span>{children}</label>;
}

function Info({ title, body }: { title: string; body: string }) {
  return <div className="border-l border-line pl-4"><div className="font-medium text-parchment">{title}</div><div className="mt-1 text-sm leading-6 text-parchment-dim">{body}</div></div>;
}
