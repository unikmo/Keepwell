import Link from "next/link";
import { Keyhole } from "./Keyhole";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Digital Sentinel", href: "/digital-sentinel" },
  { label: "Membership", href: "/pricing" },
  { label: "Property managers", href: "/for-property-managers" },
  { label: "Providers", href: "/partner-tech" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/94 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-5 py-3.5 sm:px-8 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-3 font-display text-xl font-medium text-parchment">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-brass/30 bg-brass/10"><Keyhole className="h-4 w-3 text-brass" /></span>
          <span>Keepwell</span>
        </Link>
        <nav className="hidden items-center gap-7 text-[15px] text-parchment-dim xl:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-parchment">{item.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/login" className="min-h-11 px-2 py-3 text-[15px] text-parchment-dim transition hover:text-parchment">Log in</Link>
          <Link href="/book" className="inline-flex min-h-11 items-center rounded-full bg-brass px-5 py-2.5 text-[15px] font-semibold text-ink transition hover:brightness-110">Request service</Link>
        </div>
        <details className="group relative sm:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-line bg-surface text-parchment marker:content-none">
            <span className="sr-only">Open menu</span>
            <span className="space-y-1.5" aria-hidden="true"><span className="block h-px w-5 bg-current" /><span className="block h-px w-5 bg-current" /><span className="block h-px w-5 bg-current" /></span>
          </summary>
          <div className="absolute right-0 mt-3 w-[min(88vw,340px)] rounded-2xl border border-line bg-surface-raised p-3 shadow-2xl">
            <nav className="grid" aria-label="Mobile navigation">
              {NAV_LINKS.map((item) => <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-[15px] text-parchment transition hover:bg-surface">{item.label}</Link>)}
              <Link href="/for-real-estate-agents" className="rounded-xl px-4 py-3 text-[15px] text-parchment transition hover:bg-surface">Real estate professionals</Link>
              <Link href="/login" className="rounded-xl px-4 py-3 text-[15px] text-parchment transition hover:bg-surface">Log in</Link>
              <Link href="/book" className="mt-2 rounded-xl bg-brass px-4 py-3 text-center text-[15px] font-semibold text-ink">Request service</Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
