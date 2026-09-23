import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/repo";
import { site } from "@/content/site";
import { Art } from "@/components/ui/Art";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const postUrl = `${base}/blog/${post.slug}`;
  const shareWording = encodeURIComponent(post.title);

  const shareLinks = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${shareWording}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${shareWording}%20${encodeURIComponent(postUrl)}`,
    },
  ];

  return (
    <Reveal variant="blur">
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide text-wine dark:text-gold-soft">
        <span className="rounded-full bg-wine/10 px-2.5 py-1 uppercase dark:bg-gold-soft/10">
          {post.category}
        </span>
        <span className="text-ink-soft dark:text-parchment/60">
          {formatDate(post.published_at)}
        </span>
        <span className="text-ink-soft dark:text-parchment/60">By {post.author}</span>
      </div>
      <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-5xl dark:text-parchment">
        {post.title}
      </h1>
      <p className="mt-5 font-display text-lg leading-relaxed text-ink-soft dark:text-parchment/75">
        {post.excerpt}
      </p>
      <Art
        label={post.title}
        seed={post.slug}
        className="mt-8 aspect-[16/9] w-full rounded-2xl shadow-lg"
      />
      <div className="mt-8 space-y-5 leading-relaxed text-ink dark:text-parchment">
        {post.body.split("\n\n").map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="mt-10 border-t border-ink/10 pt-6 dark:border-parchment/10">
        <p className="text-sm font-semibold text-ink dark:text-parchment">
          Share this post
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:border-parchment/25 dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft dark:text-parchment/60">
          Questions, thoughts or corrections? Write to{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft">
            {site.email}
          </a>
          .
        </p>
      </div>
    </article>
    </Reveal>
  );
}