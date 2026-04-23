"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCustomer,
  updateCustomerBySlug,
  deleteCustomerBySlug,
  uploadCustomerImage,
  deleteCustomerImage,
  getCustomerBySlug,
} from "@/lib/db/customers";
import { getTemplate } from "@/lib/templates";

const SLUG_RE = /^[a-z0-9-]+$/;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type ActionState = { error?: string; ok?: boolean };

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function optionalStr(form: FormData, key: string): string | null {
  const v = str(form, key);
  return v.length === 0 ? null : v;
}

function errMsg(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Something went wrong.";
}

export async function createCustomerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let slug: string;
  try {
    const rawSlug = str(formData, "slug");
    const recipient = str(formData, "recipient_name");
    const template = str(formData, "template_id");
    const message = optionalStr(formData, "message");
    const music = optionalStr(formData, "music_url");
    const limitRaw = str(formData, "image_limit");

    if (!recipient) return { error: "Recipient name is required." };
    if (!template) return { error: "Template is required." };
    if (!getTemplate(template)) return { error: `Unknown template: ${template}` };

    slug = rawSlug ? slugify(rawSlug) : slugify(recipient);
    if (!slug || !SLUG_RE.test(slug)) return { error: "Invalid slug." };

    const limit = limitRaw ? parseInt(limitRaw, 10) : 3;
    if (!Number.isFinite(limit) || limit < 1 || limit > 30) {
      return { error: "Image limit must be between 1 and 30." };
    }

    const existing = await getCustomerBySlug(slug);
    if (existing) return { error: `Slug "${slug}" is already taken.` };

    await createCustomer({
      slug,
      template_id: template,
      recipient_name: recipient,
      message,
      music_url: music,
      image_limit: limit,
    });
  } catch (e) {
    return { error: errMsg(e) };
  }

  revalidatePath("/admin");
  redirect(`/admin/${slug}/edit`);
}

export async function updateCustomerAction(
  slug: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const recipient = str(formData, "recipient_name");
    const template = str(formData, "template_id");
    const message = optionalStr(formData, "message");
    const music = optionalStr(formData, "music_url");
    const limitRaw = str(formData, "image_limit");

    if (!recipient) return { error: "Recipient name is required." };
    if (!template) return { error: "Template is required." };
    if (!getTemplate(template)) return { error: `Unknown template: ${template}` };

    const limit = limitRaw ? parseInt(limitRaw, 10) : 3;
    if (!Number.isFinite(limit) || limit < 1 || limit > 30) {
      return { error: "Image limit must be between 1 and 30." };
    }

    await updateCustomerBySlug(slug, {
      recipient_name: recipient,
      template_id: template,
      message,
      music_url: music,
      image_limit: limit,
    });
  } catch (e) {
    return { error: errMsg(e) };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${slug}/edit`);
  revalidatePath(`/p/${slug}`);
  return { ok: true };
}

export async function addImagesAction(
  slug: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const existing = await getCustomerBySlug(slug);
    if (!existing) return { error: "Customer not found." };

    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) return { error: "No files selected." };

    const remaining = existing.customer.image_limit - existing.images.length;
    if (files.length > remaining) {
      return {
        error: `Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed (limit is ${existing.customer.image_limit}).`,
      };
    }

    for (const f of files) {
      if (f.size > MAX_FILE_BYTES) return { error: `"${f.name}" exceeds 8MB.` };
      if (f.type && !ALLOWED_TYPES.has(f.type)) {
        return { error: `"${f.name}" is not a supported image type.` };
      }
    }

    const startIndex = existing.images.length;
    for (let i = 0; i < files.length; i++) {
      await uploadCustomerImage(
        existing.customer.id,
        existing.customer.slug,
        files[i],
        startIndex + i,
      );
    }
  } catch (e) {
    return { error: errMsg(e) };
  }

  revalidatePath(`/admin/${slug}/edit`);
  revalidatePath(`/admin`);
  revalidatePath(`/p/${slug}`);
  return { ok: true };
}

export async function deleteImageAction(slug: string, imageId: string) {
  if (!imageId) return;
  await deleteCustomerImage(imageId);
  revalidatePath(`/admin/${slug}/edit`);
  revalidatePath(`/admin`);
  revalidatePath(`/p/${slug}`);
}

export async function deleteCustomerAction(slug: string) {
  await deleteCustomerBySlug(slug);
  revalidatePath("/admin");
  redirect("/admin");
}
