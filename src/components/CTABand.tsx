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
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-[30px] border border-sky/15 bg-surface/55 px-6 py-10 text-center shadow-[0_18px_50px_rgba(3,18,37,0.12)] sm:px-10 sm:py-12">
        <h2 className="font-display text-3xl font-medium tracking-[-.02em] text-parchment sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-parchment-dim">{body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink shadow-[0_8px_22px_rgba(214,173,87,0.14)] transition hover:brightness-110"
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-sky/25 bg-ink/10 px-6 py-3 text-sm font-semibold text-parchment transition hover:border-sky/50"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
