import Link from "next/link";
import { Keyhole } from "./Keyhole";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
          <Keyhole className="h-5 w-4 text-brass" />
          Digital Sentinel
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-parchment-dim md:flex">
          <Link href="/#how-it-works" className="hover:text-parchment">How it works</Link>
          <Link href="/#pricing" className="hover:text-parchment">Pricing</Link>
          <Link href="/property-managers" className="hover:text-parchment">For property managers</Link>
          <Link href="/contact" className="hover:text-parchment">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-parchment-dim hover:text-parchment sm:block">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brass px-4 py-2 text-sm font-medium text-ink transition hover:bg-[#dab668]"
          >
            Get covered
          </Link>
        </div>
      </div>
    </header>
  );
}
