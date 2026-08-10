import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Request property access service",
  description:
    "Choose a fixed-price Keepwell service request. Independent local providers perform the field service.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-lg font-medium text-parchment">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-brass/30 bg-brass/10">
              <Keyhole className="h-4 w-3 text-brass" />
            </span>
            Keepwell
          </Link>
          <div className="mt-7 eyebrow">One-off service</div>
          <h1 className="mt-2 font-display text-4xl font-medium text-parchment">Choose the service and see the price first</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-parchment-dim">
            No membership required. The listed price covers the standard scope. Any excluded work must be priced and approved before it begins.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {SERVICE_MENU.map((service) => (
            <Link
              key={service.id}
              href={`/book/details?service_id=${service.id}`}
              className="group grid min-h-20 gap-3 rounded-2xl border border-line bg-surface p-5 transition hover:border-brass/45 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <span>
                <span className="block font-medium text-parchment">{service.title}</span>
                <span className="mt-1 block text-xs leading-5 text-parchment-dim">{service.timing} · {service.scope}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-xl text-brass">{formatServicePrice(service.customerPriceCents)}</span>
                <span className="text-brass transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface/50 p-4 text-xs leading-5 text-parchment-dim">
          Keepwell is the platform. Services are performed by independent local providers, and availability varies by location and time.
        </div>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          Already a member? <Link href="/login" className="text-brass hover:underline">Log in</Link> to use your member workflow. ·{" "}
          <Link href="/pricing" className="text-brass hover:underline">Compare membership</Link>
        </p>
      </div>
    </div>
  );
}
