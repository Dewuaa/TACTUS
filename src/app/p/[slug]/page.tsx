import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/db/customers";
import { getTemplate } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCustomerBySlug(slug);
  if (!result) return { title: "Not found" };
  return {
    title: `For ${result.customer.recipient_name}`,
    description: "A personal moment, delivered through TACTUS.",
  };
}

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCustomerBySlug(slug);
  if (!result) notFound();

  const template = getTemplate(result.customer.template_id);
  if (!template) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-tactus-black text-tactus-white">
        <p className="text-sm text-white/60">
          Template &ldquo;{result.customer.template_id}&rdquo; not found.
        </p>
      </div>
    );
  }

  if (result.images.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-tactus-black text-tactus-white">
        <p className="text-sm text-white/60">This moment isn&rsquo;t ready yet.</p>
      </div>
    );
  }

  const Renderer = template.component;
  return <Renderer customer={result.customer} images={result.images} />;
}
