import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { logout } from "./actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line/70 bg-ink/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/app" className="flex items-center gap-3 text-parchment">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-sky/20 bg-surface-raised/80">
              <Keyhole className="h-4 w-3 text-brass" />
            </span>
            <span>
              <span className="block font-display text-base font-medium leading-none">Keepwell</span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[.14em] text-parchment-dim">Digital Access</span>
            </span>
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-parchment-dim transition hover:text-parchment">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
