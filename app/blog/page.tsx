import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/repo";
import { Art } from "@/components/ui/Art";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, reflections and practical help from the EPLM community — faith, marriage and career.",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const ordered = getPosts();

  return (
    <>
      <section className="border-b border-ink/10 bg-parchment dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
              Blog
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl dark:text-parchment">
              Notes from the journey.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft dark:text-parchment/80">
              Practical help, honest reflections and stories from the circles.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
        {ordered.map((post, i) => (
          <Reveal key={post.slug} delay={(i % 3) * 100 + Math.floor(i / 3) * 60}>
          <Link
            href={`/blog/${post.slug}`}
            transitionTypes={["nav-forward"]}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-sm transition-colors hover:border-gold dark:border-parchment/10 dark:hover:border-gold-soft"
          >
            <Art
              label={post.title}
              seed={post.slug}
              className="aspect-[16/9] w-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-wide text-wine dark:text-gold-soft">
                <span className="rounded-full bg-wine/10 px-2.5 py-1 uppercase dark:bg-gold-soft/10">
                  {post.category}
                </span>
                <span className="text-ink-soft dark:text-parchment/60">
                  {formatDate(post.published_at)}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl leading-snug text-ink transition-colors group-hover:text-wine dark:text-parchment dark:group-hover:text-gold-soft">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft dark:text-parchment/70">
                {post.excerpt}
              </p>
              <p className="mt-4 text-sm font-semibold text-ink-soft dark:text-parchment/60">
                By {post.author}
              </p>
            </div>
          </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}