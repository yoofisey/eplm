"use client";

import { useActionState } from "react";
import { adminAddGalleryImage } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function GalleryAddForm({ tags }: { tags: string[] }) {
  const [state, action, pending] = useActionState(adminAddGalleryImage, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <p className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
        </p>
      ) : (
        <>
          <Field label="Alt text" htmlFor="gallery-alt">
            <input
              id="gallery-alt"
              name="alt"
              required
              className={inputClasses}
              placeholder="Describe the photo"
            />
          </Field>
          <Field label="Image file (from your device)" htmlFor="gallery-file">
            <input
              id="gallery-file"
              name="file"
              type="file"
              accept="image/*"
              className={inputClasses}
            />
          </Field>
          <Field label="…or paste an image URL" htmlFor="gallery-url">
            <input
              id="gallery-url"
              name="url"
              type="url"
              className={inputClasses}
              placeholder="https://…"
            />
          </Field>
          <Field label="Program tag" htmlFor="gallery-program_tag">
            <input
              id="gallery-program_tag"
              name="program_tag"
              list="admin-gallery-tags"
              className={inputClasses}
              placeholder="Faith, Marriage, Career…"
            />
            <datalist id="admin-gallery-tags">
              {tags
                .filter((t) => t !== "All")
                .map((t) => (
                  <option key={t} value={t} />
                ))}
            </datalist>
          </Field>
          {state.message && !state.ok && (
            <p className="text-sm text-wine dark:text-gold-soft">
              {state.message}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Adding…" : "Add image"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}