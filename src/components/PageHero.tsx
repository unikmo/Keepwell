export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="border-b border-line/70 bg-surface/22 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-.025em] text-parchment sm:text-5xl">
          {title}
        </h1>
        {body && <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-parchment-dim">{body}</p>}
      </div>
    </div>
  );
}
