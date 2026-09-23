import type { MetadataRoute } from "next";
import { getPosts, getEvents } from "@/lib/repo";
import { programs } from "@/content/programs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = (path: string) => new URL(path, base);

  const statics = [
    "",
    "/about",
    "/programs",
    "/give",
    "/events",
    "/blog",
    "/gallery",
    "/contact",
  ].map((path) => ({
    url: url(path).toString(),
    lastModified: new Date(),
  }));

  const programRoutes = programs.map((p) => ({
    url: url(`/programs/${p.slug}`).toString(),
    lastModified: new Date(),
  }));

  const postRoutes = getPosts().map((p) => ({
    url: url(`/blog/${p.slug}`).toString(),
    lastModified: new Date(p.published_at),
  }));

  const eventRoutes = getEvents().map((e) => ({
    url: url(`/events`).toString(),
    lastModified: new Date(e.date),
  }));

  return [...statics, ...programRoutes, ...postRoutes, ...eventRoutes];
}