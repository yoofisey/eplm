"use client";

import { useFormStatus } from "react-dom";
import { markMessageStatus } from "@/components/admin/actions";

function ActionButton({ value, label }: { value: string; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="action"
      value={value}
      disabled={pending}
      className="inline-flex min-h-9 items-center rounded-full border border-ink/15 px-4 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-cream disabled:opacity-60 dark:border-parchment/25 dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
    >
      {pending ? "Working…" : label}
    </button>
  );
}

export function MessageStatusButton({ id }: { id: number }) {
  return (
    <form action={markMessageStatus} className="flex flex-wrap gap-2">
      <input type="hidden" name="id" value={id} />
      <ActionButton value="done" label="Mark handled" />
      <ActionButton value="archive" label="Archive" />
    </form>
  );
}