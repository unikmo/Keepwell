import Link from "next/link";
import { Keyhole } from "./Keyhole";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-void/45">
      <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display text-xl font-medium text-parchment">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-brass/30 bg-brass/10">
                <Keyhole className="h-4 w-3 text-brass" />
              </span>
              Keepwell
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-6 text-parchment-dim">
              Property access organized around Digital Sentinel, trusted access and fixed-price service requests.
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-parchment-dim/80">
              Keepwell operates the platform. Property services are performed by independent local providers. Availability and provider participation vary by area.
            </p>
          </div>

          <FooterColumn
            title="For owners"
            links={[
              { label: "Request service", href: "/book" },
              { label: "Services", href: "/services" },
              { label: "Digital Sentinel", href: "/digital-sentinel" },
              { label: "Second homes", href: "/second-homes" },
              { label: "Membership", href: "/pricing" },
            ]}
          />
          <FooterColumn
            title="For business"
            links={[
              { label: "Property managers", href: "/for-property-managers" },
              { label: "Real estate professionals", href: "/for-real-estate-agents" },
              { label: "Join as a provider", href: "/partner-tech" },
              { label: "Trust & safety", href: "/trust-safety" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "How it works", href: "/how-it-works" },
              { label: "Contact", href: "/contact" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
              { label: "Member agreement", href: "/member-agreement" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/70 pt-6 text-sm text-parchment-dim sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Keepwell</span>
          <span>Platform membership, not insurance.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-dim">{title}</div>
      <ul className="mt-4 space-y-3 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-parchment-dim transition hover:text-parchment">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
