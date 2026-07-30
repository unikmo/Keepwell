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
    <div className="border-b border-line/70 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-3 font-display text-4xl font-medium text-parchment sm:text-5xl">
          {title}
        </h1>
        {body && <p className="mx-auto mt-5 max-w-xl text-parchment-dim">{body}</p>}
      </div>
    </div>
  );
}
