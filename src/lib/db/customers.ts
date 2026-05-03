import "server-only";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase/admin";
import { supabasePublic } from "@/lib/supabase/public";
import type { Customer, CustomerImage, CustomerListRow } from "./types";

function publicUrl(path: string): string {
  return supabasePublic.storage.from(STORAGE_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

export async function getCustomerBySlug(
  slug: string,
): Promise<{ customer: Customer; images: CustomerImage[] } | null> {
  const { data: customer, error } = await supabasePublic
    .from("customers")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!customer) return null;

  const { data: rows, error: imgErr } = await supabasePublic
    .from("customer_images")
    .select("*")
    .eq("customer_id", customer.id)
    .order("order_index", { ascending: true });
  if (imgErr) throw imgErr;

  const images: CustomerImage[] = (rows ?? []).map((row) => ({
    ...row,
    url: publicUrl(row.storage_path),
  }));

  return { customer: customer as Customer, images };
}

export async function listCustomers(): Promise<CustomerListRow[]> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*, customer_images(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const countRow = Array.isArray(row.customer_images)
      ? row.customer_images[0]
      : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { customer_images: _omit, ...rest } = row as any;
    void _omit;
    return {
      ...(rest as Customer),
      image_count: countRow?.count ?? 0,
    };
  });
}

export type CreateCustomerInput = {
  slug: string;
  template_id: string;
  recipient_name: string;
  message?: string | null;
  music_url?: string | null;
  image_limit?: number;
};

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<Customer> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .insert({
      slug: input.slug,
      template_id: input.template_id,
      recipient_name: input.recipient_name,
      message: input.message ?? null,
      music_url: input.music_url ?? null,
      image_limit: input.image_limit ?? 3,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Customer;
}

export type UpdateCustomerInput = Partial<
  Omit<Customer, "id" | "slug" | "created_at">
>;

export async function updateCustomerBySlug(
  slug: string,
  input: UpdateCustomerInput,
): Promise<Customer> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .update(input)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return data as Customer;
}

export async function deleteCustomerBySlug(slug: string): Promise<void> {
  const existing = await getCustomerBySlug(slug);
  if (!existing) return;

  if (existing.images.length > 0) {
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove(existing.images.map((i) => i.storage_path));
  }

  const { error } = await supabaseAdmin
    .from("customers")
    .delete()
    .eq("id", existing.customer.id);
  if (error) throw error;
}

export async function uploadCustomerImage(
  customerId: string,
  slug: string,
  file: File,
  orderIndex: number,
): Promise<CustomerImage> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${slug}/img-${orderIndex}-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(path, arrayBuffer, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });
  if (upErr) throw upErr;

  const { data, error } = await supabaseAdmin
    .from("customer_images")
    .insert({
      customer_id: customerId,
      storage_path: path,
      order_index: orderIndex,
    })
    .select()
    .single();
  if (error) throw error;

  return { ...(data as Omit<CustomerImage, "url">), url: publicUrl(path) };
}

export async function updateImageCaption(
  imageId: string,
  caption: string | null,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("customer_images")
    .update({ caption })
    .eq("id", imageId);
  if (error) throw error;
}

export async function deleteCustomerImage(imageId: string): Promise<void> {
  const { data: img } = await supabaseAdmin
    .from("customer_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle();

  if (img?.storage_path) {
    await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([img.storage_path]);
  }

  await supabaseAdmin.from("customer_images").delete().eq("id", imageId);
}
