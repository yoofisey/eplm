"use client";

import { useActionState } from "react";
import { adminRecordAttendance } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function AttendanceForm({ eventSlugs }: { eventSlugs: string[] }) {
  const [state, action, pending] = useActionState(adminRecordAttendance, initial);

  return (
    <form action={action} className="grid gap-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Member name"
          htmlFor="attendance-member"
          error={state.fieldErrors?.member_name}
        >
          <input
            id="attendance-member"
            name="member_name"
            className={inputClasses}
            placeholder="Ama Owusu"
            required
          />
        </Field>

        <Field label="Event" htmlFor="attendance-event">
          <select
            id="attendance-event"
            name="event_slug"
            className={inputClasses}
            defaultValue={eventSlugs[0] ?? ""}
          >
            <option value="">No specific event</option>
            {eventSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date" htmlFor="attendance-date">
          <input
            id="attendance-date"
            name="attended_on"
            type="date"
            className={inputClasses}
          />
        </Field>

        <Field label="Status" htmlFor="attendance-present">
          <select
            id="attendance-present"
            name="present"
            className={inputClasses}
            defaultValue="present"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </Field>
      </div>

      <Field label="Notes" htmlFor="attendance-notes">
        <input
          id="attendance-notes"
          name="notes"
          className={inputClasses}
          placeholder="Optional"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center self-start rounded-full bg-ink px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-ink/85 disabled:opacity-60 dark:bg-gold-soft dark:text-ink"
      >
        {pending ? "Saving…" : "Record attendance"}
      </button>
    </form>
  );
}