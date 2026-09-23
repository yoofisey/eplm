import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgram } from "@/content/programs";
import { Art } from "@/components/ui/Art";
import { FormCard } from "@/components/ui/FormCard";
import { InterestForm } from "@/components/forms/InterestForm";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return ["faith", "marriage", "career"].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return {};
  return {
    title: `${program.name} program`,
    description: program.description,
  };
}

export default async function ProgramPage({
  params,
}: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const facts = [
    { label: "Rhythm", value: program.schedule },
    { label: "Format", value: program.format },
    { label: "Who it's for", value: program.audience },
  ];

  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              {program.format}
            </p>
            <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              {program.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              {program.tagline}
            </p>
            </Reveal>
            <Reveal delay={140}>
            <div className="mt-8 flex flex-wrap gap-8">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase dark:text-parchment/60">
                    {fact.label}
                  </p>
                  <p className="mt-1 font-display text-lg text-ink dark:text-parchment">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
            </Reveal>
          </div>
          <div className="parallax-drift">
          <Reveal variant="zoom" delay={200}>
          <Art
            label={`${program.name} circles`}
            seed={program.slug}
            className="hidden aspect-[4/3] w-full rounded-2xl shadow-lg lg:block"
          />
          </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl space-y-5 leading-relaxed text-ink-soft dark:text-parchment/80">
            <Reveal>
            <h2 className="font-display text-3xl text-ink dark:text-parchment">
              What to expect
            </h2>
            <p>{program.description}</p>
            </Reveal>
            <Reveal delay={100}>
            <p>
              Every {program.name.toLowerCase()} circle is kept intentionally
              small. You won&apos;t be a seat number — you&apos;ll be known by name,
              prayed for, called to account, and celebrated. If life gets
              crowded, you pause without guilt and return without judgement.
            </p>
            <p>
              Facilitators are trained in group care and safeguarding, and
              everything that&apos;s shared in circle stays in circle.
            </p>
            </Reveal>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal variant="right" delay={150}>
            <FormCard
              title={`Join the ${program.name} circle`}
              intro="Tell us a little about yourself and we'll find your place."
            >
              <InterestForm
                program={program.name}
                submitLabel={program.cta}
              />
            </FormCard>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}