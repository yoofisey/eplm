import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, postCount } from "@/lib/repo";
import { adminDeletePost } from "@/lib/admin";
import { formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Posts",
  robots: { index: false, follow: false },
};

export default function AdminPostsPage() {
  const posts = getPosts({ published: false });

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
            Posts
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            All posts
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
            {postCount()} published · drafts included below
          </p>
        </div>
        <ButtonLink
          href="/admin/posts/new"
          transitionTypes={["nav-forward"]}
          variant="wine"
        >
          New post
        </ButtonLink>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No posts yet. Create the first one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      transitionTypes={["nav-forward"]}
                      className="font-semibold text-wine transition-colors hover:text-wine-soft dark:text-gold-soft dark:hover:text-gold"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-soft dark:text-parchment/50">
                      /{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {post.category}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {post.author}
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? (
                      <StatusBadge status="published" />
                    ) : (
                      <StatusBadge status="draft" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        transitionTypes={["nav-forward"]}
                        className="inline-flex min-h-9 items-center rounded-full border border-ink/15 px-4 text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:border-parchment/25 dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
                      >
                        View / Edit
                      </Link>
                      <form action={adminDeletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <button
                          type="submit"
                          className="inline-flex min-h-9 items-center rounded-full border border-wine/30 px-4 text-xs font-semibold text-wine transition-colors hover:bg-wine hover:text-cream dark:text-gold-soft dark:hover:bg-gold-soft dark:hover:text-ink"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}