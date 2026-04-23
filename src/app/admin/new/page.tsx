import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { CustomerForm } from "../CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-[11px] uppercase tracking-[0.3em] text-white/40 hover:text-white/70"
          >
            ← Customers
          </Link>
          <h1
            className="mt-3 text-3xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            New customer
          </h1>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <CustomerForm mode="create" templates={TEMPLATES} />
      </div>
    </div>
  );
}
