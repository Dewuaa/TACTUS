import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/db/customers";
import { TEMPLATES } from "@/lib/templates";
import { CustomerForm } from "../../CustomerForm";
import { ImageManager } from "../../ImageManager";
import { DeleteCustomerButton } from "../../DeleteCustomerButton";
import { QRSection } from "../../QRSection";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCustomerBySlug(slug);
  if (!result) notFound();

  const { customer, images } = result;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-4">
        <Link
          href="/admin"
          className="text-[11px] uppercase tracking-[0.3em] text-white/40 hover:text-white/70"
        >
          ← Customers
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {customer.recipient_name}
            </h1>
            <p className="mt-1 font-mono text-xs text-white/40">
              /p/{customer.slug}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/p/${customer.slug}`}
              target="_blank"
              className="rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Preview
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <CustomerForm mode="edit" templates={TEMPLATES} customer={customer} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <ImageManager
          slug={customer.slug}
          images={images}
          limit={customer.image_limit}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <QRSection slug={customer.slug} />
      </section>

      <section className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6 sm:p-8">
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-rose-300/80">
          Danger zone
        </h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            Delete this customer and all their images. This cannot be undone.
          </p>
          <DeleteCustomerButton slug={customer.slug} />
        </div>
      </section>
    </div>
  );
}
