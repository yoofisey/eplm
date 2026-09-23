import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { FormCard } from "@/components/ui/FormCard";
import { GiveCheckout } from "@/components/forms/GiveCheckout";
import { ManualGiveForm } from "@/components/forms/ManualGiveForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Give to EPLM — one-time or monthly, by card, mobile money or bank transfer. Every gift keeps circles running and mentorship open.",
};

export default function GivePage() {
  return (
    <>
      <section className="bg-wine text-cream">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-soft uppercase">
              Give
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
              Your giving keeps a woman from walking alone.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/85">
              Every circle, event and mentoring hour is powered by gifts like
              yours. Choose an amount below — or give the way that&apos;s easiest
              for you.
            </p>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Give online" title="Start a gift">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal variant="left">
          <FormCard
            title="Choose your gift"
            intro={`All gifts go to ${site.longName} (${site.name}) and are used directly for programmes and events in ${site.location}.`}
          >
            <GiveCheckout />
          </FormCard>
          </Reveal>

          <div className="grid gap-8 self-start">
            <Reveal variant="right" delay={100}>
            <FormCard title="Give without a card">
              <div className="space-y-4 text-sm text-ink-soft dark:text-parchment/80">
                <div className="rounded-xl border border-sage/25 bg-sage/10 p-4">
                  <p className="font-semibold text-sage dark:text-gold-soft">
                    Mobile Money
                  </p>
                  <p className="mt-1">
                    {site.moMo.provider}:{" "}
                    <a href={`tel:${site.moMo.number.replace(/[^\d+]/g, "")}`} className="font-semibold underline decoration-gold underline-offset-4">
                      {site.moMo.number}
                    </a>
                  </p>
                  <p className="text-xs">{site.moMo.name}</p>
                </div>
                <div className="rounded-xl border border-ink/10 bg-surface p-4 dark:border-parchment/10">
                  <p className="font-semibold text-ink dark:text-parchment">
                    Bank transfer
                  </p>
                  <p className="mt-1">
                    {site.bank.bank} · {site.bank.accountName}
                  </p>
                  <p className="text-xs">
                    Account: {site.bank.accountNumber} · Branch: {site.bank.branch}
                  </p>
                </div>
                <p className="text-xs">
                  After transferring, tell us below so we can say thank you and
                  send a receipt.
                </p>
              </div>
            </FormCard>
            </Reveal>

            <Reveal variant="right" delay={200}>
            <FormCard
              title="Already given via MoMo or bank?"
              intro="Log your reference and our team will reconcile it."
            >
              <ManualGiveForm />
            </FormCard>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Transparency"
        title="Where your money goes"
        align="center"
        className="border-t border-ink/10 bg-surface-muted/60 dark:border-parchment/10"
      >
        <div className="grid gap-6 text-left sm:grid-cols-3">
{[
            { label: "Communities", text: "Facilitators, circle materials and meeting support." },
            { label: "Events & training", text: "Workshop venues, speaker support and retreat costs." },
            { label: "Help when it's needed", text: "Emergency assistance for women in our circles facing crisis." },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 100}>
            <div className="h-full rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
              <h3 className="font-display text-xl text-wine dark:text-gold-soft">{item.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-parchment/75">{item.text}</p>
            </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-sm text-ink-soft dark:text-parchment/60">
          Donations in Ghana generally qualify for tax benefits under GRA
          guidelines — ask us at {site.email} for a receipt if you need one.
        </p>
      </Section>
    </>
  );
}