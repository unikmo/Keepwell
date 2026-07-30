import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function LegalDoc({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-display text-3xl font-medium text-parchment sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-parchment-dim">
            Last updated {lastUpdated}
          </p>

          <div className="legal-prose mt-12 space-y-8 text-sm leading-relaxed text-parchment-dim">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-medium text-parchment">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
