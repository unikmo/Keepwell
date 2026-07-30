import Link from "next/link";
import { Keyhole } from "./Keyhole";

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-medium text-parchment">
              <Keyhole className="h-5 w-4 text-brass" />
              Digital Sentinel
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-parchment-dim">
              A membership for the home things you hope you&rsquo;ll never deal with — and the
              everyday ones you will.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: "How it works", href: "/how-it-works" },
              { label: "Pricing", href: "/pricing" },
              { label: "Digital vault", href: "/#included" },
              { label: "Book a one-off visit", href: "/book" },
              { label: "For property managers", href: "/for-property-managers" },
              { label: "For real estate agents", href: "/for-real-estate-agents" },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { label: "Contact us", href: "/contact" },
              { label: "Help center", href: "/help" },
              { label: "Become a partner tech", href: "/partner-tech" },
              { label: "Trust & safety", href: "/trust-safety" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { label: "Terms of service", href: "/terms" },
              { label: "Privacy policy", href: "/privacy" },
              { label: "Member agreement", href: "/member-agreement" },
              { label: "Cookie preferences", href: "/cookies" },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line/70 pt-6 text-xs font-mono uppercase tracking-wide text-parchment-dim sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Digital Sentinel, Inc.</span>
          <span>Membership, not insurance · See member agreement</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-wide text-parchment-dim">{title}</div>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-parchment-dim hover:text-parchment">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
