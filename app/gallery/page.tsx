import type { Metadata } from "next";
import { getGalleryImages, galleryTags } from "@/lib/repo";
import type { GalleryImage } from "@/lib/types";
import { Section } from "@/components/ui/Section";
import { GalleryClient } from "@/components/ui/GalleryClient";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from EPLM circles, events and retreats — organised by programme so you can find your people.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Gallery
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              Moments from the circles.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              Filter by programme — faith, marriage or career — and step into
              what community actually looks like.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <GalleryClient
          images={getGalleryImages().map((img) => ({
            alt: img.alt,
            url: img.url ?? undefined,
            event_id: img.event_id ?? undefined,
            program_tag: img.program_tag ?? undefined,
            order: img.order,
          })) as GalleryImage[]}
          tags={galleryTags()}
        />
      </Section>
    </>
  );
}