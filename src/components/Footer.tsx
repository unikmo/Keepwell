import Link from "next/link";
import { Keyhole } from "./Keyhole";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-void">
      <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display text-xl font-medium text-parchment">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-sky/20 bg-surface-raised/70">
                <Keyhole className="h-4 w-3 text-brass" />
              </span>
              Keepwell
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-6 text-parchment-dim">
              Clear prices when you need property-access help. Digital Access when you want a backup plan before you need it.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-parchment-dim/75">
              Keepwell operates the platform. Field work is performed by independent local providers.
            </p>
          </div>

          <FooterColumn
            title="Use Keepwell"
            links={[
              { label: "Request service", href: "/book" },
              { label: "Services & prices", href: "/services" },
              { label: "Digital Access", href: "/digital-access" },
              { label: "Membership", href: "/pricing" },
              { label: "For providers", href: "/partner-tech" },
            ]}
          />
          <FooterColumn
            title="More"
            links={[
              { label: "Property managers", href: "/for-property-managers" },
              { label: "Real estate professionals", href: "/for-real-estate-agents" },
              { label: "Trust & safety", href: "/trust-safety" },
              { label: "Contact", href: "/contact" },
              { label: "Terms", href: "/terms" },
            ]}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line/70 pt-5 text-sm text-parchment-dim sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Keepwell</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="hover:text-parchment">Privacy</Link>
            <Link href="/member-agreement" className="hover:text-parchment">Member agreement</Link>
            <span>Platform membership, not insurance.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[.14em] text-parchment-dim">{title}</div>
      <ul className="mt-4 space-y-3 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-parchment-dim transition hover:text-parchment">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
