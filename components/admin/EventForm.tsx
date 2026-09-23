"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminCreateEvent } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function EventForm() {
  const [state, action, pending] = useActionState(adminCreateEvent, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <div className="rounded-xl border border-sage/30 bg-sage/10 p-5 text-sm text-ink dark:text-parchment">
          <p className="font-semibold text-sage dark:text-gold-soft">
            {state.message}
          </p>
          <Link
            href="/admin/events"
            transitionTypes={["nav-forward"]}
            className="mt-3 inline-block font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft"
          >
            Back to events
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" htmlFor="event-title">
              <input
                id="event-title"
                name="title"
                required
                className={inputClasses}
                placeholder="Retreat, workshop, summit…"
              />
            </Field>
            <Field label="Slug" htmlFor="event-slug">
              <input
                id="event-slug"
                name="slug"
                className={inputClasses}
                placeholder="auto-generated from title if left blank"
              />
            </Field>
          </div>
          <Field label="Description" htmlFor="event-description">
            <textarea
              id="event-description"
              name="description"
              rows={4}
              className={`${inputClasses} resize-y`}
              placeholder="What is this event about?"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date" htmlFor="event-date">
              <input
                id="event-date"
                name="date"
                type="date"
                required
                className={inputClasses}
              />
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Start time" htmlFor="event-start_time">
                <input
                  id="event-start_time"
                  name="start_time"
                  type="time"
                  required
                  className={inputClasses}
                />
              </Field>
              <Field label="End time" htmlFor="event-end_time">
                <input
                  id="event-end_time"
                  name="end_time"
                  type="time"
                  className={inputClasses}
                />
              </Field>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Location" htmlFor="event-location">
              <input
                id="event-location"
                name="location"
                required
                className={inputClasses}
                placeholder="Venue, Accra"
              />
            </Field>
            <Field label="Capacity" htmlFor="event-capacity">
              <input
                id="event-capacity"
                name="capacity"
                type="number"
                min="0"
                className={inputClasses}
                placeholder="0 = unlimited"
              />
            </Field>
          </div>
          <Field label="Image URL" htmlFor="event-image">
            <input
              id="event-image"
              name="image"
              className={inputClasses}
              placeholder="https://…"
            />
          </Field>
          {state.message && !state.ok && (
            <p className="text-sm text-wine dark:text-gold-soft">
              {state.message}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Saving…" : "Create event"}
            </button>
            <Link
              href="/admin/events"
              transitionTypes={["nav-back"]}
              className="inline-flex min-h-11 items-center rounded-full border border-current px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
            >
              Cancel
            </Link>
          </div>
        </>
      )}
    </form>
  );
}