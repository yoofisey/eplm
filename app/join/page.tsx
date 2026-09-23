import type { Metadata } from "next";
import { FormCard } from "@/components/ui/FormCard";
import { JoinForm } from "@/components/forms/JoinForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Become a Member",
  description:
    "Join the Executive Purposeful Ladies Ministry — pick a circle, add an optional pledge and start walking with us.",
};

export default function JoinPage() {
  return (
    <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Membership
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              Become a member.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              Step into a circle of faith, marriage and career. Tell us who you
              are, choose the circle you want to grow in, and we&apos;ll walk
              with you from your first event.
            </p>
          </Reveal>
        </div>
        <div className="lg:pl-8">
          <Reveal delay={120}>
            <FormCard
              title="Join the ministry"
              intro="Membership is free and open to every woman. An optional monthly pledge keeps circles running, events free and mentorship available."
            >
              <JoinForm />
            </FormCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}