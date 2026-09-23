import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  align?: "left" | "center";
  id?: string;
};

export function Section({
  children,
  className = "",
  eyebrow,
  title,
  intro,
  align = "left",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {(eyebrow || title || intro) && (
          <Reveal>
            <header
              className={`mb-10 max-w-2xl sm:mb-14 ${
                align === "center" ? "mx-auto text-center" : ""
              }`}
            >
              {eyebrow && (
                <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl dark:text-parchment">
                  {title}
                </h2>
              )}
              {intro && (
                <p className="mt-4 text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
                  {intro}
                </p>
              )}
            </header>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}