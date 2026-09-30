import type { Metadata } from "next";
import { getGalleryImages, galleryCount, galleryTags } from "@/lib/repo";
import { adminDeleteGalleryImage } from "@/components/admin/actions";
import { GalleryAddForm } from "@/components/admin/GalleryAddForm";

export const metadata: Metadata = {
  title: "Gallery",
  robots: { index: false, follow: false },
};

export default function AdminGalleryPage() {
  const images = getGalleryImages();
  const tags = galleryTags();

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Gallery
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Gallery images
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          {galleryCount()} images · {tags.length > 1 ? tags.slice(1).join(", ") : "no tags yet"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit lg:sticky lg:top-8">
          <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm dark:border-parchment/10">
            <h2 className="font-display text-lg">Add an image</h2>
            <div className="mt-4">
              <GalleryAddForm tags={tags} />
            </div>
          </div>
        </aside>

        <div>
          {images.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
              No images yet. Add the first one.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {images.map((img) => (
                <figure
                  key={img.id}
                  className="group overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10"
                >
                  <div className="relative aspect-[4/3] bg-ink/5 dark:bg-parchment/5">
                    {img.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={img.url}
                        alt={img.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink-soft dark:text-parchment/50">
                        No image
                      </div>
                    )}
                  </div>
                  <figcaption className="p-4">
                    <p className="text-sm font-semibold leading-snug text-ink dark:text-parchment">
                      {img.alt}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft dark:text-parchment/60">
                      {img.program_tag ?? "No tag"}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <form action={adminDeleteGalleryImage}>
                        <input type="hidden" name="id" value={img.id} />
                        <button
                          type="submit"
                          className="inline-flex min-h-9 items-center rounded-full border border-wine/30 px-4 text-xs font-semibold text-wine transition-colors hover:bg-wine hover:text-cream dark:text-gold-soft dark:hover:bg-gold-soft dark:hover:text-ink"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}