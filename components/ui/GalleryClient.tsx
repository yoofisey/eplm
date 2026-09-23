"use client";

import { useEffect, useState } from "react";
import type { GalleryImage } from "@/lib/types";
import { Art } from "@/components/ui/Art";
import { Reveal } from "@/components/ui/Reveal";

export function GalleryClient({
  images,
  tags,
}: {
  images: GalleryImage[];
  tags: string[];
}) {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const filtered =
    active === "All" ? images : images.filter((img) => img.program_tag === active);

  const lightbox = open !== null ? filtered[open] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setOpen((o) => (o === null ? o : (o - 1 + filtered.length) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered.length]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gallery">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            role="tab"
            aria-selected={active === tag}
            onClick={() => {
              setActive(tag);
              setOpen(null);
            }}
            className={`min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors ${
              active === tag
                ? "border-wine bg-wine text-cream"
                : "border-ink/15 text-ink hover:border-wine/50 dark:border-parchment/20 dark:text-parchment"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((img, i) => (
          <Reveal key={`${img.alt}-${i}`} delay={(i % 3) * 80} variant="zoom">
          <button
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`View larger: ${img.alt}`}
            className="group relative w-full overflow-hidden rounded-2xl border border-ink/10 shadow-sm dark:border-parchment/10"
          >
            <img
              src={img.url ?? undefined}
              alt={img.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-10 text-left text-sm font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {img.alt}
            </span>
          </button>
          </Reveal>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-parchment/15 text-cream transition-colors hover:bg-parchment/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? o : (o - 1 + filtered.length) % filtered.length));
            }}
            className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full bg-parchment/15 text-cream transition-colors hover:bg-parchment/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Art
              label={lightbox.alt}
              seed={`${lightbox.program_tag}-${open}`}
              className="max-h-[85vh] w-full max-w-5xl rounded-2xl"
            />
            <p className="mt-3 text-center text-sm font-medium text-cream/85">
              {lightbox.alt}
            </p>
          </div>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (o === null ? o : (o + 1) % filtered.length));
            }}
            className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full bg-parchment/15 text-cream transition-colors hover:bg-parchment/25"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}