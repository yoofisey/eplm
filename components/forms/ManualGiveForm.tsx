"use client";

import { useActionState } from "react";
import { submitManualGive, type ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function ManualGiveForm() {
  const [state, action, pending] = useActionState(submitManualGive, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="manual-name">
              <input
                id="manual-name"
                name="name"
                required
                className={inputClasses}
                placeholder="Ama Owusu"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.name}
                </p>
              )}
            </Field>
            <Field label="Email" htmlFor="manual-email">
              <input
                id="manual-email"
                name="email"
                type="email"
                required
                className={inputClasses}
                placeholder="you@email.com"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.email}
                </p>
              )}
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Amount given (GHS)" htmlFor="manual-amount">
              <input
                id="manual-amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                required
                className={inputClasses}
                placeholder="100"
              />
              {state.fieldErrors?.amount && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.amount}
                </p>
              )}
            </Field>
            <Field label="Reference number" htmlFor="manual-reference">
              <input
                id="manual-reference"
                name="reference"
                required
                className={inputClasses}
                placeholder="MoMo or bank reference"
              />
              {state.fieldErrors?.reference && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.reference}
                </p>
              )}
            </Field>
          </div>
          <Field label="Phone" htmlFor="manual-phone">
            <input
              id="manual-phone"
              name="phone"
              type="tel"
              className={inputClasses}
              placeholder="+233 24 000 0000"
            />
          </Field>
          <Field label="Frequency" htmlFor="manual-frequency">
            <select
              id="manual-frequency"
              name="frequency"
              className={inputClasses}
              defaultValue="one-time"
            >
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </Field>
          {state.message && (
            <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-current px-8 text-base font-semibold tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink disabled:opacity-60"
            >
              {pending ? "Logging…" : "Log my gift"}
            </button>
            <p className="mt-3 text-xs text-ink-soft dark:text-parchment/60">
              Your reference helps our team reconcile your gift and send a
              receipt.
            </p>
          </div>
        </>
      )}
    </form>
  );
}