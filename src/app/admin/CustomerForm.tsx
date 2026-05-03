"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Customer } from "@/lib/db/types";
import type { Template } from "@/lib/templates";
import {
  createCustomerAction,
  updateCustomerAction,
  type ActionState,
} from "./actions";
import { SpotifyPicker } from "./SpotifyPicker";

const initial: ActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.3em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

type Props = {
  mode: "create" | "edit";
  templates: Template[];
  customer?: Customer;
};

export function CustomerForm({ mode, templates, customer }: Props) {
  const action =
    mode === "create"
      ? createCustomerAction
      : updateCustomerAction.bind(null, customer!.slug);

  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      )}
      {state?.ok && mode === "edit" && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Saved.
        </div>
      )}

      <Field label="Recipient name" hint="Shown on the template.">
        <input
          type="text"
          name="recipient_name"
          required
          maxLength={80}
          defaultValue={customer?.recipient_name ?? ""}
          className="input"
        />
      </Field>

      <Field
        label="Slug"
        hint={
          mode === "create"
            ? "Used in the URL: /p/{slug}. Leave blank to auto-generate."
            : "Slugs are immutable after creation."
        }
      >
        <input
          type="text"
          name="slug"
          pattern="[a-z0-9\-]+"
          maxLength={64}
          defaultValue={customer?.slug ?? ""}
          disabled={mode === "edit"}
          placeholder={mode === "create" ? "e.g. sofia-birthday-2026" : undefined}
          className="input font-mono"
        />
      </Field>

      <Field label="Template">
        <select
          name="template_id"
          required
          defaultValue={customer?.template_id ?? templates[0]?.id}
          className="input"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id} className="bg-black">
              {t.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" hint="A line or two. Optional.">
        <textarea
          name="message"
          rows={3}
          maxLength={500}
          defaultValue={customer?.message ?? ""}
          className="input resize-none"
        />
      </Field>

      <Field label="Music" hint="Spotify, direct URL, or upload MP3. Optional.">
        <SpotifyPicker slug={customer?.slug} defaultValue={customer?.music_url} />
      </Field>

      <Field label="Image limit" hint="How many photos this customer can have.">
        <input
          type="number"
          name="image_limit"
          min={1}
          max={30}
          required
          defaultValue={customer?.image_limit ?? 3}
          className="input w-32"
        />
      </Field>

      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
        <SubmitButton label={mode === "create" ? "Create" : "Save changes"} />
      </div>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 120ms;
        }
        .input:focus { border-color: rgba(255,255,255,0.35); }
        .input:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/60">
          {label}
        </span>
        {hint && <span className="text-[11px] text-white/30">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
