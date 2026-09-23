import type { Metadata } from "next";
import { site } from "@/content/site";
import { stats } from "@/content/stats";
import { programs } from "@/content/programs";
import { testimonials } from "@/content/testimonials";
import { partners } from "@/content/partners";
import { upcomingEvents, type EventRow } from "@/lib/repo";
import type { Event } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { StatBlock } from "@/components/ui/StatBlock";
import { ProgramRow } from "@/components/ui/ProgramRow";
import { EventLine } from "@/components/ui/EventLine";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { Art } from "@/components/ui/Art";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Home",
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

export default async function HomePage() {
  const nextEvents = (await upcomingEvents()).map(asEvent).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-parchment dark:bg-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-wine/25 bg-wine/10 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-wine uppercase dark:border-gold-soft/30 dark:bg-gold-soft/10 dark:text-gold-soft">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                {site.location} · Since 2018
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-6xl dark:text-parchment">
                Women living whole lives —{" "}
                <span className="text-wine dark:text-gold-soft">in faith, marriage and career.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
                {site.mission}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/give" size="lg" transitionTypes={["nav-forward"]}>
                  Give today
                </ButtonLink>
                <ButtonLink href="/join" variant="gold" size="lg" transitionTypes={["nav-forward"]}>
                  Become a Member
                </ButtonLink>
                <ButtonLink href="/about" variant="ghost" size="lg" transitionTypes={["nav-forward"]}>
                  Read our story
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <div className="parallax-drift hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <Reveal variant="zoom" delay={120}>
                <Art label="Faith circles" className="aspect-[4/3] w-full rounded-2xl shadow-lg" />
              </Reveal>
              <Reveal variant="zoom" delay={200}>
                <Art label="Marriage events" seed="marriage" className="mt-8 aspect-[4/3] w-full rounded-2xl shadow-lg" />
              </Reveal>
              <Reveal variant="zoom" delay={280}>
                <Art label="Career mentoring" seed="career" className="aspect-[4/3] w-full rounded-2xl shadow-lg" />
              </Reveal>
              <Reveal variant="zoom" delay={360}>
                <Art label="Community" seed="community" className="mt-8 aspect-[4/3] w-full rounded-2xl shadow-lg" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Impact" title="Flourishing is measurable">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <StatBlock stat={stat} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Programs"
        title="Three doors into community"
        intro="Every woman begins somewhere. Choose the circle where you want to grow, and we'll walk with you."
        className="border-y border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <div className="grid gap-5">
          {programs.map((program, i) => (
            <Reveal key={program.slug} delay={i * 100}>
              <ProgramRow program={program} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section align="center">
        <Reveal>
          <blockquote className="mx-auto max-w-3xl text-balance font-display text-2xl leading-relaxed text-ink sm:text-3xl dark:text-parchment">
            “Behind every strong woman is a sisterhood that refused to let her
            walk alone.”
          </blockquote>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-4 font-semibold tracking-[0.16em] text-gold uppercase">
            Our founding conviction
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mx-auto mt-8 h-px w-24 bg-gold" aria-hidden="true" />
        </Reveal>
      </Section>

      <Section
        eyebrow="Stories"
        title="From the women we walk with"
        className="border-y border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <TestimonialCarousel testimonials={testimonials} />
      </Section>

      <Section
        eyebrow="Coming up"
        title="Next on the calendar"
        intro={nextEvents.length ? undefined : "No upcoming events right now — check back soon."}
      >
        {nextEvents.length === 0 ? (
          <p className="text-lg text-ink-soft dark:text-parchment/70">
            No events scheduled yet. Follow us on socials for the next date.
          </p>
        ) : (
          <div className="grid gap-4">
            {nextEvents.map((event, i) => (
              <Reveal key={event.slug} delay={i * 90}>
                <EventLine event={event} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-8 flex">
          <ButtonLink href="/events" variant="ghost" transitionTypes={["nav-forward"]}>
            See all events
          </ButtonLink>
        </div>
      </Section>

      <Section
        eyebrow="Partners"
        title="In good company"
        align="center"
        className="border-t border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((partner) => (
            <li key={partner.name}>
              <span className="inline-flex min-h-11 items-center font-display text-lg font-semibold text-ink-soft/80 dark:text-parchment/70">
                {partner.name}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <section className="bg-wine text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center sm:px-8 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl text-cream sm:text-4xl">
              Your giving keeps a woman from walking alone.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-cream/80">
              One-time or monthly, card or mobile money — every gift keeps
              circles running, events free and mentorship open to every woman
              who asks.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <ButtonLink href="/give" variant="gold" size="lg" transitionTypes={["nav-forward"]}>
              Give to {site.name}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}