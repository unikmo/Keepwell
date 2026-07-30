import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { submitContact } from "./actions";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string; topic?: string }>;
}) {
  const { error, sent, topic } = await searchParams;
  const topics = ["Account", "Billing", "Partnership", "Trust & safety", "Something else"];
  const defaultTopic = topics.includes(topic ?? "") ? topic! : "Account";

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="eyebrow">Contact</div>
          <h1 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
            Locked out right now?
          </h1>
          <p className="mt-4 max-w-xl text-parchment-dim">
            Don&rsquo;t use this form — open the app and tap &ldquo;Get help&rdquo; for immediate
            dispatch. Use this page for account questions, billing, or partnership inquiries.
          </p>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-8">
              <InfoBlock
                icon="💬"
                title="Member support line"
                body="In-app, 7am–11pm local time"
              />
              <InfoBlock
                icon="✉️"
                title="Email"
                body="support@digitalsentinel.com — reply within 1 business day"
              />
              <InfoBlock
                icon="🏢"
                title="Property managers & realtors"
                body="partnerships@digitalsentinel.com"
              />
            </div>

            <div className="rounded-2xl border border-line bg-surface p-8">
              {sent && (
                <div className="mb-6 rounded-lg border border-verdigris/30 bg-verdigris/10 px-4 py-2.5 text-sm text-verdigris">
                  Message sent — we&rsquo;ll reply within 1 business day.
                </div>
              )}
              {error && (
                <div className="mb-6 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember">
                  {error}
                </div>
              )}

              <form action={submitContact} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@email.com"
                      className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
                    Topic
                  </label>
                  <select
                    name="topic"
                    defaultValue={defaultTopic}
                    className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment focus:border-brass focus:outline-none"
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-parchment-dim">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-line bg-surface-raised px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-full bg-brass px-6 py-2.5 text-sm font-medium text-ink transition hover:bg-[#dab668]"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoBlock({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-base">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-parchment">{title}</div>
        <div className="mt-0.5 text-sm text-parchment-dim">{body}</div>
      </div>
    </div>
  );
}
