import type { Metadata } from "next";
import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { SERVICE_MENU, formatServicePrice } from "@/lib/service-menu";

export const metadata: Metadata = {
  title: "Find a Locksmith | Lockout, Rekey or Lock Service",
  description:
    "Choose a home lockout, rekey, lock change or smart-lock service and see the standard Trusted Locksmith price before you submit a request.",
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
            Trusted Locksmith
          </Link>
          <div className="mt-7 eyebrow">Find a locksmith</div>
          <h1 className="mt-2 font-display text-4xl font-medium text-parchment">What do you need help with?</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-parchment-dim">
            Choose the service to see the standard total before you continue. Provider travel/service call is included. No membership required.
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
                <span className="mt-1 block text-xs leading-5 text-parchment-dim">{service.timing}</span>
                <span className="mt-1 block text-xs leading-5 text-parchment-dim/80">{service.scope}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-xl text-brass">{formatServicePrice(service.customerPriceCents)}</span>
                <span className="text-brass transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface/50 p-4 text-xs leading-5 text-parchment-dim">
          Availability varies by location and time. A locksmith name and ETA appear only after a participating independent local provider accepts your request.
        </div>

        <p className="mt-6 text-center text-xs text-parchment-dim">
          Already have a Trusted Locksmith account? <Link href="/login" className="text-brass hover:underline">Log in</Link> ·{" "}
          <Link href="/digital-access" className="text-brass hover:underline">Explore Digital Access</Link>
        </p>
      </div>
    </div>
  );
}
