import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, type PostRow } from "@/lib/repo";
import { adminDeletePost } from "@/lib/admin";
import { formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export default async function AdminEditPostPage({
  params,
}: PageProps<"/admin/posts/[slug]/edit">) {
  const { slug } = await params;

  let post: PostRow | undefined = getPost(slug);
  if (!post) {
    post = getPosts({ published: false }).find((p) => p.slug === slug);
  }
  if (!post) notFound();

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
            Posts
          </p>
          <h1 className="mt-1 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
            /{post.slug} · written by {post.author}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink
            href="/admin/posts"
            transitionTypes={["nav-back"]}
            variant="ghost"
          >
            Back
          </ButtonLink>
          <form action={adminDeletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft"
            >
              Delete post
            </button>
          </form>
        </div>
      </header>

      <div className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm sm:p-8 dark:border-parchment/10">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide text-ink-soft dark:text-parchment/60">
          <span className="rounded-full bg-wine/10 px-2.5 py-1 uppercase text-wine dark:bg-gold-soft/10 dark:text-gold-soft">
            {post.category}
          </span>
          <span>Published {formatDate(post.published_at)}</span>
          {post.published ? (
            <StatusBadge status="published" />
          ) : (
            <StatusBadge status="draft" />
          )}
        </div>

        {post.excerpt && (
          <p className="mt-5 font-display text-lg leading-relaxed text-ink-soft dark:text-parchment/75">
            {post.excerpt}
          </p>
        )}

        {post.cover && (
          <div className="mt-5 overflow-hidden rounded-xl border border-ink/10 dark:border-parchment/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover}
              alt={post.title}
              className="h-52 w-full object-cover"
            />
          </div>
        )}

        <div className="mt-6 space-y-5 whitespace-pre-line leading-relaxed text-ink dark:text-parchment">
          {post.body}
        </div>

        <div className="mt-8 border-t border-ink/10 pt-5 dark:border-parchment/10">
          <p className="text-xs text-ink-soft dark:text-parchment/60">
            No edit action exists yet — delete and recreate if it needs
            changing, or contact the developer to wire up an update action.
          </p>
        </div>
      </div>
    </>
  );
}