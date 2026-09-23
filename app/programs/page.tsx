import type { Metadata } from "next";
import { programs } from "@/content/programs";
import { ProgramRow } from "@/components/ui/ProgramRow";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Faith circles, marriage support and career mentorship — three ways to grow with EPLM.",
};

export default function ProgramsPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Programs
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              Choose where you want to grow.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              Faith, marriage, career — three circles of care under one roof.
              Every program is led by trained facilitators, run on a consistent
              rhythm, and open to every woman who asks.
            </p>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="Our programmes"
        title="Three doors, one sisterhood"
        intro="Pick the area where you need company, or begin anywhere — most women tell us the growth in one circle spills into the others."
      >
        <div className="grid gap-5">
          {programs.map((program, i) => (
            <Reveal key={program.slug} delay={i * 100}>
              <ProgramRow program={program} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-10 rounded-2xl border border-sage/25 bg-sage/10 p-6 sm:p-8">
            <h3 className="font-display text-2xl text-sage dark:text-gold-soft">
              Not sure where to start?
            </h3>
            <p className="mt-2 max-w-2xl text-ink-soft dark:text-parchment/75">
              Book a free 20-minute call. We&apos;ll listen to your season of life and
              point you to the circle where you&apos;ll fit — no pressure, no fee.
            </p>
            <div className="mt-5">
              <ButtonLink href="/contact" variant="ghost" transitionTypes={["nav-forward"]}>
                Book a call
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}