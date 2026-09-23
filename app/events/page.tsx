import type { Metadata } from "next";
import { formatEventDate, formatTime } from "@/content/events";
import { upcomingEvents, pastEvents, type EventRow } from "@/lib/repo";
import { EventLine } from "@/components/ui/EventLine";
import { FormCard } from "@/components/ui/FormCard";
import { RsvpForm } from "@/components/forms/RsvpForm";
import { rsvpCount } from "@/lib/db";
import type { Event } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming EPLM events — workshops, date nights, retreats and summits. Reserve your spot online.",
};

function asEvent(event: EventRow): Event {
  return {
    slug: event.slug,
    title: event.title,
    description: event.description,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time ?? undefined,
    location: event.location,
    capacity: event.capacity,
    image: event.image ?? undefined,
  };
}

function seatsLeft(event: Event) {
  return Math.max(0, event.capacity - rsvpCount(event.slug));
}

export default async function EventsPage() {
  const upcoming = (await upcomingEvents()).map(asEvent);
  const past = (await pastEvents()).map(asEvent);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: upcoming.map((event, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: event.title,
        startDate: event.date,
        location: {
          "@type": "Place",
          name: event.location,
        },
        description: event.description,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Events
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              Come as you are. Leave refreshed.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              Workshops, date nights, retreats and summits. Most events are free
              for circle members; everyone else pays at cost — no one is turned
              away for lack of funds.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8">
        {upcoming.length === 0 ? (
          <div>
            <h2 className="font-display text-2xl text-ink dark:text-parchment">
              No upcoming events
            </h2>
            <p className="mt-2 text-ink-soft dark:text-parchment/70">
              We&apos;re planning the next season. Follow us on socials or join the
              newsletter to hear first.
            </p>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Upcoming events</h2>
            <div className="grid gap-6">
              {upcoming.map((event, i) => {
                const left = seatsLeft(event);
                const soldOut = left === 0;
                return (
                  <Reveal key={event.slug} delay={i * 90}>
                  <article
                    id={event.slug}
                    className="grid gap-8 scroll-mt-24 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm sm:p-8 lg:grid-cols-[1.05fr_0.95fr] dark:border-parchment/10"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-wine/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-wine uppercase dark:bg-gold-soft/10 dark:text-gold-soft">
                          {formatEventDate(event.date)}
                        </span>
                        <span className="text-sm text-ink-soft dark:text-parchment/70">
                          {formatTime(event.start_time)}
                          {event.end_time ? ` – ${formatTime(event.end_time)}` : ""}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl dark:text-parchment">
                        {event.title}
                      </h2>
                      <p className="mt-2 text-sm font-semibold text-wine dark:text-gold-soft">
                        {event.location}
                      </p>
                      <p className="mt-4 leading-relaxed text-ink-soft dark:text-parchment/80">
                        {event.description}
                      </p>
                      <p className="mt-4 text-sm text-ink-soft dark:text-parchment/60">
                        {soldOut
                          ? "Fully booked — join the waitlist."
                          : `${left} of ${event.capacity} places left.`}
                      </p>
                    </div>
                    <div className="lg:pl-4">
                      <FormCard
                        title={soldOut ? "Waitlist" : "Reserve your spot"}
                        intro={
                          soldOut
                            ? `Bookings for ${event.title} are full, but cancellations happen.`
                            : `Tell us who's coming — confirmation lands in your inbox.`
                        }
                      >
                        <RsvpForm
                          eventSlug={event.slug}
                          eventTitle={event.title}
                          soldOut={soldOut}
                        />
                      </FormCard>
                    </div>
                  </article>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}

        {past.length > 0 && (
          <div className="mt-4">
            <h2 className="font-display text-2xl text-ink dark:text-parchment">
              From the archive
            </h2>
            <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
              Recaps, photos and highlights from events gone by.
            </p>
            <div className="mt-5 grid gap-4">
              {past.map((event, i) => (
                <Reveal key={event.slug} delay={i * 70}>
                  <EventLine event={event} showLink={false} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}