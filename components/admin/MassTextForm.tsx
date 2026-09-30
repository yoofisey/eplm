"use client";

import { useActionState, useState } from "react";
import { adminSendText } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

const TEMPLATES: Record<string, string> = {
  event_announcement:
    "Hello {name}, you're invited to {title} on {date} at {time} at {location}. RSVP on the EPLM website — you don't want to miss this one.",
  event_reminder:
    "Hello {name}, a reminder that {title} is coming up on {date} at {time} at {location}. See you there!",
  dues_reminder:
    "Hello {name}, a gentle reminder that this month's membership dues are due. Thank you for keeping the ministry growing.",
};

export function MassTextForm({
  events,
  currentPeriod,
}: {
  events: { id: number; slug: string; title: string; date: string; start_time: string; location: string }[];
  currentPeriod: string;
}) {
  const [state, action, pending] = useActionState(adminSendText, initial);
  const [audience, setAudience] = useState("all-members");
  const [template, setTemplate] = useState("event_announcement");
  const [eventIndex, setEventIndex] = useState(
    events.length ? "0" : "",
  );

  const selectedEvent = events[Number(eventIndex)];

  const templateBody = TEMPLATES[template] ?? "";
  const filled = templateBody
    .replace("{name}", "there")
    .replace(
      "{title}",
      selectedEvent?.title ?? "our next event",
    )
    .replace("{date}", selectedEvent?.date ?? "coming soon")
    .replace("{time}", selectedEvent?.start_time ?? "")
    .replace("{location}", selectedEvent?.location ?? "");

  return (
    <form action={action} className="grid gap-5">
      <Field label="Audience" htmlFor="text-audience">
        <select
          id="text-audience"
          name="audience"
          className={inputClasses}
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        >
          <option value="all-members">All active members with a phone</option>
          <option value="unpaid-members">
            Members who haven&apos;t paid dues (a period)
          </option>
          <option value="event-rsvps">Everyone who RSVP&apos;d to an event</option>
          <option value="phone-list">A custom list of phone numbers</option>
        </select>
      </Field>

      {audience === "unpaid-members" && (
        <Field label="Dues period" htmlFor="text-period">
          <input
            id="text-period"
            name="period"
            type="month"
            defaultValue={currentPeriod}
            className={inputClasses}
          />
        </Field>
      )}

      {audience === "event-rsvps" && (
        <>
          <Field label="Event" htmlFor="text-event">
            <select
              id="text-event"
              name="event_slug"
              className={inputClasses}
              value={selectedEvent?.slug ?? ""}
              onChange={(e) => {
                const idx = events.findIndex((ev) => ev.slug === e.target.value);
                setEventIndex(idx >= 0 ? String(idx) : "");
              }}
            >
              <option value="" disabled>
                Select an event…
              </option>
              {events.map((ev) => (
                <option key={ev.slug} value={ev.slug}>
                  {ev.title} — {ev.date}
                </option>
              ))}
            </select>
          </Field>
          <input type="hidden" name="event_id" value={selectedEvent?.id ?? ""} />
        </>
      )}

      {audience === "phone-list" && (
        <Field label="Phone numbers (comma or newline separated)" htmlFor="text-phone-list">
          <textarea
            id="text-phone-list"
            name="phone_list"
            rows={4}
            className={`${inputClasses} resize-y`}
            placeholder="+233 20 000 0000, +233 24 000 0000"
          />
        </Field>
      )}

      <Field label="Template" htmlFor="text-template">
        <select
          id="text-template"
          className={inputClasses}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option value="event_announcement">Event announcement</option>
          <option value="event_reminder">Event reminder</option>
          <option value="dues_reminder">Dues reminder</option>
        </select>
      </Field>

      <Field label="Message" htmlFor="text-body">
        <textarea
          id="text-body"
          name="body"
          required
          rows={5}
          defaultValue={filled}
          key={`${template}-${eventIndex}`}
          className={`${inputClasses} resize-y`}
        />
      </Field>
      <p className="-mt-2 text-xs text-ink-soft dark:text-parchment/60">
        Preview with placeholders filled — edit freely before sending.
      </p>

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
          {pending ? "Queuing…" : "Queue text batch"}
        </button>
      </div>
    </form>
  );
}