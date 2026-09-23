"use client";

import { Art } from "./Art";
import type { Testimonial } from "@/lib/types";

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <div
      className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 pb-4"
      aria-label="Testimonials"
    >
      {testimonials
        .filter((t) => t.published)
        .map((t) => (
          <figure
            key={t.name}
            className="snap-start flex min-w-[86%] flex-col justify-between rounded-2xl border border-ink/10 bg-surface p-7 shadow-sm sm:min-w-[48%] sm:p-9 dark:border-parchment/10"
          >
            <blockquote className="font-display text-lg leading-relaxed text-ink sm:text-xl dark:text-parchment">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              {t.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photo}
                  alt={`Portrait of ${t.name}`}
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <Art
                  label={t.name}
                  className="size-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-ink dark:text-parchment">
                  {t.name}
                </p>
                <p className="text-sm text-ink-soft dark:text-parchment/70">
                  {t.role}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
    </div>
  );
}