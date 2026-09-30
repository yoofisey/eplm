import type { Metadata } from "next";
import { upcomingEvents, pastEvents, eventCount, rsvpsForEvent } from "@/lib/repo";
import { adminDeleteEvent } from "@/lib/admin";
import { formatDate } from "@/components/admin/format";
import { ButtonLink } from "@/components/ui/Button";
import { EventCountdown } from "@/components/admin/EventCountdown";

export const metadata: Metadata = {
  title: "Events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const upcoming = await upcomingEvents();
  const past = await pastEvents();
  const next = upcoming[0];

  const renderEvent = (event: { id: number; slug: string; title: string; date: string; start_time: string; location: string }) => (
    <div
      key={event.id}
      className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 py-4 last:border-b-0 dark:border-parchment/10"
    >
      <div className="min-w-0">
        <p className="font-semibold text-ink dark:text-parchment">{event.title}</p>
        <p className="mt-0.5 text-sm text-ink-soft dark:text-parchment/60">
          {formatDate(event.date)} · {event.start_time} · {event.location}
        </p>
        <p className="mt-0.5 text-xs text-ink-soft dark:text-parchment/50">
          /{event.slug} · {rsvpsForEvent(event.slug)} RSVPs
        </p>
      </div>
      <form action={adminDeleteEvent}>
        <input type="hidden" name="id" value={event.id} />
        <button
          type="submit"
          className="inline-flex min-h-9 items-center rounded-full border border-wine/30 px-4 text-xs font-semibold text-wine transition-colors hover:bg-wine hover:text-cream dark:text-gold-soft dark:hover:bg-gold-soft dark:hover:text-ink"
        >
          Delete
        </button>
      </form>
    </div>
  );

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
            Events
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            All events
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
            {eventCount()} published · {upcoming.length} upcoming, {past.length}{" "}
            past
          </p>
        </div>
        <ButtonLink
          href="/admin/events/new"
          transitionTypes={["nav-forward"]}
          variant="wine"
        >
          New event
        </ButtonLink>
      </header>

      {next && (
        <section className="mb-6 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                Next up
              </p>
              <h2 className="mt-1 font-display text-2xl text-ink dark:text-parchment">
                {next.title}
              </h2>
              <p className="mt-1 text-sm text-ink-soft dark:text-parchment/70">
                {formatDate(next.date)} · {next.start_time} · {next.location}
              </p>
            </div>
            <EventCountdown date={next.date} startTime={next.start_time} />
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
        <h2 className="font-display text-xl">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft dark:text-parchment/60">
            Nothing scheduled yet.
          </p>
        ) : (
          <div className="mt-2">{upcoming.map(renderEvent)}</div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-6 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <h2 className="font-display text-xl">Past events</h2>
          <div className="mt-2">{past.map(renderEvent)}</div>
        </section>
      )}
    </>
  );
}