"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminCreatePost } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function PostForm() {
  const [state, action, pending] = useActionState(adminCreatePost, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <div className="rounded-xl border border-sage/30 bg-sage/10 p-5 text-sm text-ink dark:text-parchment">
          <p className="font-semibold text-sage dark:text-gold-soft">
            {state.message}
          </p>
          <Link
            href="/admin/posts"
            transitionTypes={["nav-forward"]}
            className="mt-3 inline-block font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft"
          >
            Back to posts
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" htmlFor="post-title">
              <input
                id="post-title"
                name="title"
                required
                className={inputClasses}
                placeholder="A post worth reading"
              />
              {state.fieldErrors?.title && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.title}
                </p>
              )}
            </Field>
            <Field label="Slug" htmlFor="post-slug">
              <input
                id="post-slug"
                name="slug"
                className={inputClasses}
                placeholder="auto-generated from title if left blank"
              />
              {state.fieldErrors?.slug && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.slug}
                </p>
              )}
            </Field>
          </div>
          <Field label="Excerpt" htmlFor="post-excerpt">
            <textarea
              id="post-excerpt"
              name="excerpt"
              required
              rows={2}
              className={`${inputClasses} resize-y`}
              placeholder="One or two sentences to tease the post."
            />
            {state.fieldErrors?.excerpt && (
              <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                {state.fieldErrors.excerpt}
              </p>
            )}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="post-category">
              <input
                id="post-category"
                name="category"
                className={inputClasses}
                placeholder="Faith, Marriage, Career…"
              />
            </Field>
            <Field label="Author" htmlFor="post-author">
              <input
                id="post-author"
                name="author"
                className={inputClasses}
                placeholder="Defaults to EPLM Team"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cover image URL" htmlFor="post-cover">
              <input
                id="post-cover"
                name="cover"
                className={inputClasses}
                placeholder="https://…"
              />
            </Field>
            <Field label="Published date" htmlFor="post-publishedAt">
              <input
                id="post-publishedAt"
                name="publishedAt"
                type="date"
                className={inputClasses}
              />
            </Field>
          </div>
          <Field label="Body" htmlFor="post-body">
            <textarea
              id="post-body"
              name="body"
              rows={12}
              className={`${inputClasses} resize-y font-mono text-sm leading-relaxed`}
              placeholder="Write the full post. Blank lines become paragraphs."
            />
          </Field>
          <label className="flex items-center gap-3 text-sm font-semibold text-ink dark:text-parchment">
            <input
              type="checkbox"
              name="published"
              defaultChecked
              className="h-4 w-4 accent-wine"
            />
            Published
          </label>
          {state.message && !state.ok && (
            <p className="text-sm text-wine dark:text-gold-soft">
              {state.message}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Saving…" : "Create post"}
            </button>
            <Link
              href="/admin/posts"
              transitionTypes={["nav-back"]}
              className="inline-flex min-h-11 items-center rounded-full border border-current px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
            >
              Cancel
            </Link>
          </div>
        </>
      )}
    </form>
  );
}