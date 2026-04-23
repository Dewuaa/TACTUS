"use client";

import { useState } from "react";
import { deleteCustomerAction } from "./actions";

export function DeleteCustomerButton({ slug }: { slug: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      await deleteCustomerAction(slug);
    } catch {
      setPending(false);
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="shrink-0 rounded-full border border-rose-500/30 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-rose-400 transition hover:border-rose-500/60 hover:bg-rose-500/10 hover:text-rose-300"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-rose-300/80">Are you sure?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="shrink-0 rounded-full bg-rose-600 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition"
      >
        Cancel
      </button>
    </div>
  );
}
