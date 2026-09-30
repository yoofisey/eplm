"use client";

import { useActionState } from "react";
import { adminMarkDuesPaid } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function DuesForm({
  members,
  currentPeriod,
}: {
  members: { id: number; name: string }[];
  currentPeriod: string;
}) {
  const [state, action, pending] = useActionState(adminMarkDuesPaid, initial);

  return (
    <form action={action} className="grid gap-5">
      <Field label="Member" htmlFor="dues-member">
        <select
          id="dues-member"
          name="member_id"
          required
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            Select a member…
          </option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Period" htmlFor="dues-period">
          <input
            id="dues-period"
            name="period"
            type="month"
            required
            defaultValue={currentPeriod}
            className={inputClasses}
          />
        </Field>
        <Field label="Amount (GHS)" htmlFor="dues-amount">
          <input
            id="dues-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className={inputClasses}
            placeholder="50.00"
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Method" htmlFor="dues-method">
          <select id="dues-method" name="method" className={inputClasses}>
            <option value="cash">Cash</option>
            <option value="momo">Mobile money</option>
            <option value="transfer">Bank transfer</option>
            <option value="online">Online</option>
          </select>
        </Field>
        <Field label="Notes" htmlFor="dues-notes">
          <input
            id="dues-notes"
            name="notes"
            className={inputClasses}
            placeholder="Optional"
          />
        </Field>
      </div>
      {state.message && (
        <p
          className={`text-sm ${state.ok ? "text-sage dark:text-gold-soft" : "text-wine dark:text-gold-soft"}`}
        >
          {state.message}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
        >
          {pending ? "Recording…" : "Record payment"}
        </button>
      </div>
    </form>
  );
}