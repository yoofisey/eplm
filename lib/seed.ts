import "server-only";
import { db } from "@/lib/db";
import { posts } from "@/content/posts";
import { events } from "@/content/events";
import { gallery } from "@/content/gallery";

function isEmpty(table: string) {
  const row = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as
    | { n: number }
    | undefined;
  return (row?.n ?? 0) === 0;
}

export function seedIfEmpty() {
  // Posts
  if (isEmpty("posts")) {
    const stmt = db.prepare(
      `INSERT INTO posts (slug, title, excerpt, category, author, cover, published_at, body, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
    );
    const txn = db.transaction(() => {
      for (const p of posts) {
        stmt.run(
          p.slug,
          p.title,
          p.excerpt,
          p.category,
          p.author,
          p.cover ?? null,
          p.publishedAt,
          Array.isArray(p.body) ? p.body.join("\n\n") : p.body
        );
      }
    });
    txn();
  }

  // Events
  if (isEmpty("events")) {
    const stmt = db.prepare(
      `INSERT INTO events (slug, title, description, date, start_time, end_time, location, capacity, image, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
    );
    const txn = db.transaction(() => {
      for (const e of events) {
        stmt.run(
          e.slug,
          e.title,
          e.description,
          e.date,
          e.start_time,
          e.end_time ?? null,
          e.location,
          e.capacity ?? 0,
          e.image ?? null
        );
      }
    });
    txn();
  }

  // Gallery
  if (isEmpty("gallery_images")) {
    const stmt = db.prepare(
      `INSERT INTO gallery_images (alt, url, event_id, program_tag, "order")
       VALUES (?, NULL, ?, ?, ?)`
    );
    const txn = db.transaction(() => {
      gallery.forEach((g, i) => {
        stmt.run(g.alt, g.event_id ?? null, g.program_tag ?? null, g.order || i + 1);
      });
    });
    txn();
  }
}

export function ensureSeed() {
  try {
    seedIfEmpty();
  } catch (err) {
    console.error("[seed] failed to seed database", err);
  }
}
