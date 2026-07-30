import Link from "next/link";
import { Keyhole } from "@/components/Keyhole";
import { logout } from "./actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-base font-medium text-parchment">
            <Keyhole className="h-5 w-4 text-brass" />
            Digital Sentinel
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-parchment-dim hover:text-parchment">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
