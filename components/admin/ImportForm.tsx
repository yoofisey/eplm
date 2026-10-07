"use client";

import { useActionState } from "react";
import { adminImportRecords } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export type ImportTargetLabel = "Members" | "Donations" | "Events" | "Attendance";

const targetValue: Record<ImportTargetLabel, string> = {
  Members: "members",
  Donations: "donations",
  Events: "events",
  Attendance: "attendance",
};

export function ImportForm({ target }: { target: ImportTargetLabel }) {
  const [state, action, pending] = useActionState(adminImportRecords, initial);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="target" value={targetValue[target]} />

      {state.ok && state.message ? (
        <p className="rounded-lg bg-sage/15 px-4 py-3 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : null}
      {state.message && !state.ok ? (
        <p className="rounded-lg bg-wine/10 px-4 py-3 text-sm font-medium leading-relaxed text-wine dark:text-gold-soft">
          {state.message}
        </p>
      ) : null}

      <Field label={`Import ${target} from file`} htmlFor={`import-file-${target}`}>
        <input
          id={`import-file-${target}`}
          name="file"
          type="file"
          accept=".csv,.xlsx,.xlsm,.docx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={inputClasses}
        />
      </Field>
      <p className="text-xs leading-relaxed text-ink-soft dark:text-parchment/60">
        Accepts .csv, .xlsx or .docx. Columns are matched by header name (e.g.
        &ldquo;Name&rdquo;, &ldquo;Phone&rdquo;, &ldquo;Amount&rdquo;). Rows that are
        missing a required value are skipped.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-ink/85 disabled:opacity-60 dark:bg-gold-soft dark:text-ink"
      >
        {pending ? "Importing…" : `Import ${target.toLowerCase()}`}
      </button>
    </form>
  );
}