"use client";

import { useActionState } from "react";
import { joinMinistry, type ActionState } from "@/lib/join-actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function JoinForm() {
  const [state, action, pending] = useActionState(joinMinistry, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="join-name">
              <input
                id="join-name"
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
            <Field label="Email" htmlFor="join-email">
              <input
                id="join-email"
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
            <Field label="Phone" htmlFor="join-phone">
              <input
                id="join-phone"
                name="phone"
                type="tel"
                className={inputClasses}
                placeholder="+233 24 000 0000"
              />
            </Field>
            <Field label="Occupation" htmlFor="join-occupation">
              <input
                id="join-occupation"
                name="occupation"
                className={inputClasses}
                placeholder="e.g. Nurse, Engineer…"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Which circle would you like to join?" htmlFor="join-circles">
              <select
                id="join-circles"
                name="circles"
                className={inputClasses}
                defaultValue=""
              >
                <option value="" disabled>
                  Choose a circle…
                </option>
                <option value="Faith circle">Faith circle</option>
                <option value="Marriage circle">Marriage circle</option>
                <option value="Career circle">Career circle</option>
              </select>
            </Field>
            <Field label="Optional monthly pledge (GHS)" htmlFor="join-pledge">
              <input
                id="join-pledge"
                name="pledge"
                type="number"
                min="1"
                step="1"
                inputMode="decimal"
                className={inputClasses}
                placeholder="e.g. 50"
              />
              {state.fieldErrors?.pledge && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.pledge}
                </p>
              )}
            </Field>
          </div>
          <input type="hidden" name="source" value="join" />
          {state.message && (
            <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
          )}
          <div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-8 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Joining…" : "Become a Member"}
            </button>
            <p className="mt-3 text-xs text-ink-soft dark:text-parchment/60">
              Membership is free and your details stay private. A pledge is a
              gift, not a fee — you can give monthly or not at all.
            </p>
          </div>
        </>
      )}
    </form>
  );
}