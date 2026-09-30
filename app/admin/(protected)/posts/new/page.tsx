import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";
import { FormCard } from "@/components/ui/FormCard";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default function AdminNewPostPage() {
  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Posts
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          New post
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          Publish a reflection or update to the blog.
        </p>
      </header>
      <FormCard>
        <PostForm />
      </FormCard>
    </>
  );
}