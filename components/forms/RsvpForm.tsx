"use client";

import { useActionState } from "react";
import { submitRsvp, type ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function RsvpForm({
  eventSlug,
  eventTitle,
  soldOut,
}: {
  eventSlug: string;
  eventTitle: string;
  soldOut: boolean;
}) {
  const [state, action, pending] = useActionState(
    submitRsvp.bind(null, eventSlug, eventTitle),
    initial,
  );

  const waitlist = soldOut && state.ok !== true;

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          {waitlist && (
            <input type="hidden" name="as" value="waitlist" />
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="rsvp-name">
              <input
                id="rsvp-name"
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
            <Field label="Email" htmlFor="rsvp-email">
              <input
                id="rsvp-email"
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
            <Field label="Phone" htmlFor="rsvp-phone">
              <input
                id="rsvp-phone"
                name="phone"
                type="tel"
                className={inputClasses}
                placeholder="+233 24 000 0000"
              />
            </Field>
            <Field label="Bringing anyone? (+ guests)" htmlFor="rsvp-guests">
              <input
                id="rsvp-guests"
                name="guests"
                type="number"
                min="0"
                max="5"
                defaultValue="0"
                className={inputClasses}
              />
            </Field>
          </div>
          {state.message && (
            <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
          )}
          <div>
            {waitlist ? (
              <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-ink dark:text-parchment">
                <p className="font-semibold text-gold dark:text-gold-soft">
                  This event is fully booked.
                </p>
                <p className="mt-1 text-ink-soft dark:text-parchment/70">
                  Join the waitlist — spaces open up.
                </p>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className={`mt-4 inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold tracking-wide text-cream transition-colors disabled:opacity-60 ${waitlist ? "bg-sage hover:bg-ink" : "bg-wine hover:bg-wine-soft"}`}
            >
              {pending ? "Booking…" : waitlist ? "Join waitlist" : "Reserve my spot"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}