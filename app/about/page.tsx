import type { Metadata } from "next";
import { site } from "@/content/site";
import { team, values } from "@/content/team";
import { partners, credentials } from "@/content/partners";
import { Section } from "@/components/ui/Section";
import { Art } from "@/components/ui/Art";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Who we are, what we believe and the team behind EPLM's faith, marriage and career programmes.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              About us
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              We are {site.name}.
            </h1>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Who we are" title="Women helping women live whole lives">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal variant="left" className="space-y-5 leading-relaxed text-ink-soft dark:text-parchment/80">
            <p>
              {site.longName} ({site.name}) began in 2018 when a small group of
              friends in Accra noticed that too many women were succeeding on
              the outside and quietly breaking on the inside — exhausted by
              work, isolated in marriage, or drifting from the faith that used
              to hold them.
            </p>
            <p>
              We decided to build what we had needed: small, trustworthy
              communities where a woman could be known, and practical tools she
              could use on Monday morning. Today we run faith circles, marriage
              support and career mentorship — serving more than{" "}
              <strong>1,200 women</strong> through programmes, circles and
              events across the city.
            </p>
            <p>
              We are a registered non-governmental organisation, accountable to
              our participants, our partners and the {credentials.certifyingBody}.
            </p>
          </Reveal>
          <div className="parallax-drift">
            <Reveal variant="zoom" delay={100}>
              <Art label={site.name} className="aspect-[4/3] w-full rounded-2xl shadow-lg" />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-y border-ink/10 bg-surface-muted/60 dark:border-parchment/10">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal variant="left">
            <div className="h-full rounded-2xl border border-wine/20 bg-wine p-7 text-cream sm:p-9">
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-soft uppercase">
                Our vision
              </p>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
                A society where every woman lives whole — grounded in faith,
                secure in family, and thriving in the work she was made for.
              </p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="h-full rounded-2xl border border-sage/20 bg-sage p-7 text-cream sm:p-9">
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-soft uppercase">
                Our mission
              </p>
              <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
                To walk alongside women through circles, mentorship and practical
                skills — nurturing lasting change one relationship at a time.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="What we hold" title="Core values">
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={(i % 2) * 110 + Math.floor(i / 2) * 60}>
              <div className="h-full rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
                <h3 className="font-display text-xl text-wine dark:text-gold-soft">
                  {value.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft dark:text-parchment/75">
                  {value.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Leadership"
        title="The team"
        intro="The people who keep the circles running, the events booked and the mission accountable."
        className="border-y border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.slug} delay={i * 90}>
              <div
                className="h-full overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10"
              >
                <Art
                  label={member.name}
                  seed={member.slug}
                  className="aspect-square w-full"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg text-ink dark:text-parchment">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold tracking-wide text-wine dark:text-gold-soft">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft dark:text-parchment/70">
                    {member.bio}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Partners & sponsors" title="The ecosystem behind the work">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {partners.map((partner, i) => {
            const inner = (
              <span className="flex min-h-20 items-center justify-center rounded-2xl border border-ink/10 bg-surface px-4 text-center font-display text-base font-semibold text-ink-soft transition-colors hover:border-gold dark:border-parchment/10 dark:text-parchment/80 dark:hover:border-gold-soft">
                {partner.name}
              </span>
            );
            return (
              <li key={partner.name}>
                <Reveal delay={i * 80}>
                  {partner.url ? (
                    <a href={partner.url} className="block h-full">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        eyebrow="Credentials"
        title="Registered & accountable"
        intro="We operate as a registered non-governmental organisation in Ghana."
        className="border-t border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal variant="left">
            <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
              <p className="text-sm font-semibold tracking-wide text-ink-soft uppercase dark:text-parchment/60">
                Registration number
              </p>
              <p className="mt-1 font-display text-2xl text-ink dark:text-parchment">
                {credentials.registrationNumber}
              </p>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
              <p className="text-sm font-semibold tracking-wide text-ink-soft uppercase dark:text-parchment/60">
                Certifying body
              </p>
              <p className="mt-1 font-display text-2xl text-ink dark:text-parchment">
                {credentials.certifyingBody}
              </p>
            </div>
          </Reveal>
        </div>
        <p className="mt-6 text-sm text-ink-soft dark:text-parchment/60">
          Registered as {credentials.regType}. Copies of certificates are
          available on request at {site.email}.
        </p>
      </Section>
    </>
  );
}