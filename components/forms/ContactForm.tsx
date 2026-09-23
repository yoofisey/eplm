"use client";

import { useActionState } from "react";
import { submitContactMessage, type ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

const reasons = [
  { value: "general", label: "General question" },
  { value: "volunteer", label: "I'd like to volunteer" },
  { value: "partnership", label: "Partnership or sponsorship" },
  { value: "prayer", label: "Prayer request" },
];

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="contact-name">
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                className={inputClasses}
                placeholder="Ama Owusu"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.name}
                </p>
              )}
            </Field>
            <Field label="Email" htmlFor="contact-email">
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
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
          <Field label="Reason for contacting us" htmlFor="contact-reason">
            <select
              id="contact-reason"
              name="reason"
              required
              defaultValue=""
              className={inputClasses}
            >
              <option value="" disabled>
                Choose a reason…
              </option>
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.reason && (
              <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                {state.fieldErrors.reason}
              </p>
            )}
          </Field>
          <Field label="Message" htmlFor="contact-message">
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              className={`${inputClasses} resize-y`}
              placeholder="Tell us a little about what's on your heart…"
            />
            {state.fieldErrors?.message && (
              <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                {state.fieldErrors.message}
              </p>
            )}
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
              {pending ? "Sending…" : "Send message"}
            </button>
            <p className="mt-3 text-xs text-ink-soft dark:text-parchment/60">
              Volunteer enquiries go straight to the team who run our events.
              We reply within two working days.
            </p>
          </div>
        </>
      )}
    </form>
  );
}