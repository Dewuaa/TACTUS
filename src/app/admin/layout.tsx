import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TACTUS Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#0b0b0e] text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-baseline gap-3">
            <span
              className="text-lg font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              TACTUS
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-[11px] uppercase tracking-[0.25em] text-white/60">
            <Link href="/admin" className="hover:text-white">
              Customers
            </Link>
            <Link
              href="/admin/new"
              className="rounded-full bg-white px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
            >
              New
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
