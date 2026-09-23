import Link from "next/link";
import { formatEventDate, formatTime } from "@/content/events";
import type { Event } from "@/lib/types";

export function EventLine({ event, showLink = true }: { event: Event; showLink?: boolean }) {
  const link = (
    <Link
      href={`/events#${event.slug}`}
      transitionTypes={["nav-forward"]}
      className="underline decoration-gold decoration-2 underline-offset-4 hover:decoration-wine"
    >
      More info & RSVP
    </Link>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:p-6 dark:border-parchment/10">
      <div className="flex min-w-24 flex-col items-center justify-center rounded-xl bg-wine px-4 py-3 text-center text-cream">
        <span className="font-display text-2xl font-semibold leading-none">
          {new Date(`${event.date}T00:00:00`).getDate()}
        </span>
        <span className="mt-1 text-xs font-semibold tracking-[0.14em] uppercase">
          {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-GB", {
            month: "short",
          })}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-xl text-ink dark:text-parchment">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft dark:text-parchment/70">
          {formatEventDate(event.date)} · {formatTime(event.start_time)}
          {event.end_time ? `–${formatTime(event.end_time)}` : ""} ·{" "}
          {event.location}
        </p>
        {showLink && <div className="mt-3 text-sm font-semibold">{link}</div>}
      </div>
    </div>
  );
}