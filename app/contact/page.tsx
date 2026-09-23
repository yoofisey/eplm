import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { FormCard } from "@/components/ui/FormCard";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with EPLM — for questions, volunteer enquiries, partnerships or prayer requests.",
};

export default function ContactPage() {
  const socials = [
    { label: "Instagram", href: site.socials.instagram },
    { label: "Facebook", href: site.socials.facebook },
    { label: "YouTube", href: site.socials.youtube },
    { label: "LinkedIn", href: site.socials.linkedin },
  ];

  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Contact
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              We&apos;d love to hear from you.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              A question, an offer to volunteer, a partnership idea or a prayer
              request — reach out and a real person will reply.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal variant="left" className="space-y-6">
            <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
              <h2 className="font-display text-xl text-ink dark:text-parchment">
                Visit or write
              </h2>
              <address className="mt-3 space-y-2 not-italic text-ink-soft dark:text-parchment/80">
                <p>{site.address}</p>
                <p>
                    <a href={`tel:${(site.phones[0] ?? "").replace(/[^\d+]/g, "")}`} className="font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft">
                    {site.phones[0]}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${site.email}`} className="font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft">
                    {site.email}
                  </a>
                </p>
              </address>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
              <h2 className="font-display text-xl text-ink dark:text-parchment">
                Follow the work
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:border-parchment/25 dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <iframe
              title="Map showing EPLM's location"
              src={site.mapEmbedUrl}
              className="h-64 w-full rounded-2xl border border-ink/10 shadow-sm dark:border-parchment/10"
              loading="lazy"
            />
          </Reveal>

          <Reveal variant="right" delay={120}>
          <FormCard
            title="Send a message"
            intro="Pick a reason, and we'll route your note to the right person."
          >
            <ContactForm />
          </FormCard>
          </Reveal>
        </div>
      </Section>
    </>
  );
}