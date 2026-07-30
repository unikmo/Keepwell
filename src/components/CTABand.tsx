import Link from "next/link";

export function CTABand({
  title,
  body,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-3xl font-medium text-parchment sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-parchment-dim">{body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="rounded-full border border-line px-6 py-3 text-sm font-medium text-parchment transition hover:border-parchment-dim"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
