"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [state, action, pending] = useActionState(subscribeNewsletter, initial);

  return (
    <form action={action} className="mt-4">
      <input type="hidden" name="source" value={source} />
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-3 text-sm font-medium text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Field label="" htmlFor="nl-email">
              <span className="sr-only">Email address</span>
              <input
                id="nl-email"
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className={inputClasses}
              />
            </Field>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Signing up…" : "Subscribe"}
            </button>
          </div>
          {state.fieldErrors?.email && (
            <p className="mt-2 text-sm text-wine dark:text-gold-soft">
              {state.fieldErrors.email}
            </p>
          )}
          {state.message && !state.ok && (
            <p className="mt-2 text-sm text-wine dark:text-gold-soft">
              {state.message}
            </p>
          )}
        </>
      )}
    </form>
  );
}