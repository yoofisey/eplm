"use client";

import { useActionState } from "react";
import { submitProgramInterest, type ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function InterestForm({
  program,
  submitLabel,
}: {
  program: string;
  submitLabel: string;
}) {
  const [state, action, pending] = useActionState(
    submitProgramInterest.bind(null, program),
    initial,
  );

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="interest-name">
              <input
                id="interest-name"
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
            <Field label="Email" htmlFor="interest-email">
              <input
                id="interest-email"
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
            <Field label="Phone" htmlFor="interest-phone">
              <input
                id="interest-phone"
                name="phone"
                type="tel"
                className={inputClasses}
                placeholder="+233 24 000 0000"
              />
            </Field>
            <Field label="Availability" htmlFor="interest-availability">
              <select
                id="interest-availability"
                name="availability"
                className={inputClasses}
                defaultValue=""
              >
                <option value="" disabled>
                  When suits you best?
                </option>
                <option value="weekday-day">Weekdays, daytime</option>
                <option value="weekday-evening">Weekdays, evenings</option>
                <option value="weekend">Weekends</option>
              </select>
            </Field>
          </div>
          <Field label="Anything you want us to know?" htmlFor="interest-message">
            <textarea
              id="interest-message"
              name="message"
              rows={3}
              className={`${inputClasses} resize-y`}
              placeholder="Optional…"
            />
          </Field>
          {state.message && (
            <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-8 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Submitting…" : submitLabel}
            </button>
            <p className="mt-3 text-xs text-ink-soft dark:text-parchment/60">
              We protect your details. A staff member will reach out within two
              working days.
            </p>
          </div>
        </>
      )}
    </form>
  );
}