import Link from "next/link";
import { listCustomers } from "@/lib/db/customers";
import { getTemplate } from "@/lib/templates";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function AdminHome() {
  const customers = await listCustomers();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Customers
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {customers.length} {customers.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-sm text-white/60">No customers yet.</p>
          <Link
            href="/admin/new"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-white/90"
          >
            Create the first
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[0.25em] text-white/40">
              <tr>
                <th className="px-5 py-3 font-normal">Slug</th>
                <th className="px-5 py-3 font-normal">Recipient</th>
                <th className="px-5 py-3 font-normal">Template</th>
                <th className="px-5 py-3 font-normal">Images</th>
                <th className="px-5 py-3 font-normal">Created</th>
                <th className="px-5 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c) => {
                const template = getTemplate(c.template_id);
                const over = c.image_count > c.image_limit;
                return (
                  <tr key={c.id} className="hover:bg-white/[0.03]">
                    <td className="px-5 py-4 font-mono text-xs text-white/80">
                      {c.slug}
                    </td>
                    <td className="px-5 py-4 text-white/90">
                      {c.recipient_name}
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      {template?.name ?? (
                        <span className="text-rose-400">
                          {c.template_id} (missing)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/70">
                      <span className={over ? "text-rose-400" : ""}>
                        {c.image_count}
                      </span>
                      <span className="text-white/30"> / {c.image_limit}</span>
                    </td>
                    <td className="px-5 py-4 text-white/50">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-4 text-[11px] uppercase tracking-[0.2em]">
                        <Link
                          href={`/p/${c.slug}`}
                          target="_blank"
                          className="text-white/60 hover:text-white"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/${c.slug}/edit`}
                          className="text-white/60 hover:text-white"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
