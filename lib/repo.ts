import "server-only";
import { db, rsvpCount } from "@/lib/db";
import { ensureSeed } from "@/lib/seed";
import { posts as contentPosts } from "@/content/posts";
import { events as contentEvents, upcomingEvents as contentUpcomingEvents, pastEvents as contentPastEvents } from "@/content/events";
import { gallery as contentGallery } from "@/content/gallery";

ensureSeed();

export function tableEmpty(name: string) {
  const row = db
    .prepare(`SELECT COUNT(*) AS n FROM ${name}`)
    .get() as { n: number } | undefined;
  return (row?.n ?? 0) === 0;
}

function contentPostsToRows(): PostRow[] {
  return contentPosts.map((p, i) => ({
    id: i + 1,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    author: p.author,
    cover: p.cover ?? null,
    published_at: p.publishedAt,
    body: Array.isArray(p.body) ? p.body.join("\n\n") : p.body,
    published: 1,
    created_at: p.publishedAt,
  }));
}

function contentEventsToRows(): EventRow[] {
  return contentEvents.map((e, i) => ({
    id: i + 1,
    slug: e.slug,
    title: e.title,
    description: e.description,
    date: e.date,
    start_time: e.start_time,
    end_time: e.end_time ?? null,
    location: e.location,
    capacity: e.capacity,
    image: e.image ?? null,
    published: 1,
    created_at: e.date,
  }));
}

function contentGalleryToRows(): GalleryRow[] {
  return contentGallery.map((g, i) => ({
    id: i + 1,
    alt: g.alt,
    url: g.url ?? null,
    event_id: g.event_id ?? null,
    program_tag: g.program_tag ?? null,
    order: g.order,
    created_at: String(i + 1),
  }));
}

export type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  cover: string | null;
  published_at: string;
  body: string;
  published: number;
  created_at: string;
};

export type EventRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  capacity: number;
  image: string | null;
  published: number;
  created_at: string;
};

export type GalleryRow = {
  id: number;
  alt: string;
  url: string | null;
  event_id: string | null;
  program_tag: string | null;
  order: number;
  created_at: string;
};

export type MemberRow = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  circles: string | null;
  source: string | null;
  status: string;
  created_at: string;
};

export type PledgeRow = {
  id: number;
  member_id: number | null;
  amount_cents: number;
  frequency: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type CountRow = { n: number };

function count(sql: string, ...params: unknown[]) {
  const row = db.prepare(sql).get(...params) as CountRow | undefined;
  return row?.n ?? 0;
}

export function getPosts(opts?: { published?: boolean; limit?: number }) {
  if (tableEmpty("posts")) return contentPostsToRows();
  const published = opts?.published ?? true;
  const rows = db
    .prepare(
      `SELECT * FROM posts
       ${published ? "WHERE published = 1" : ""}
       ORDER BY published_at DESC
       ${opts?.limit ? "LIMIT ?" : ""}`
    )
    .all(...(published ? [] : []), ...(opts?.limit ? [opts.limit] : [])) as PostRow[];
  return rows;
}

export function getPost(slug: string) {
  const row = db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .get(slug) as PostRow | undefined;
  return row;
}

export function postCount() {
  return count("SELECT COUNT(*) AS n FROM posts WHERE published = 1");
}

export function getEvents(opts?: { published?: boolean; limit?: number }) {
  if (tableEmpty("events")) return contentEventsToRows();
  const published = opts?.published ?? true;
  const rows = db
    .prepare(
      `SELECT * FROM events
       ${published ? "WHERE published = 1" : ""}
       ORDER BY date ASC, start_time ASC
       ${opts?.limit ? "LIMIT ?" : ""}`
    )
    .all(...(opts?.limit ? [opts.limit] : [])) as EventRow[];
  return rows;
}

export async function upcomingEvents() {
  if (tableEmpty("events")) {
    const today = new Date().toISOString().slice(0, 10);
    return contentEventsToRows().filter((e) => e.date >= today);
  }
  const today = new Date().toISOString().slice(0, 10);
  return db
    .prepare(
      "SELECT * FROM events WHERE published = 1 AND date >= ? ORDER BY date ASC, start_time ASC"
    )
    .all(today) as EventRow[];
}

export async function pastEvents() {
  if (tableEmpty("events")) {
    const today = new Date().toISOString().slice(0, 10);
    return contentEventsToRows().filter((e) => e.date < today);
  }
  const today = new Date().toISOString().slice(0, 10);
  return db
    .prepare(
      "SELECT * FROM events WHERE published = 1 AND date < ? ORDER BY date DESC"
    )
    .all(today) as EventRow[];
}

export function getEvent(slug: string) {
  if (tableEmpty("events")) {
    return contentEventsToRows().find((e) => e.slug === slug);
  }
  const row = db
    .prepare("SELECT * FROM events WHERE slug = ? AND published = 1")
    .get(slug) as EventRow | undefined;
  return row;
}

export function eventCount() {
  return count("SELECT COUNT(*) AS n FROM events WHERE published = 1");
}

export function getGalleryImages() {
  if (tableEmpty("gallery_images")) return contentGalleryToRows();
  return db
    .prepare(
      "SELECT * FROM gallery_images ORDER BY \"order\" ASC, id ASC"
    )
    .all() as GalleryRow[];
}

export function galleryCount() {
  return count("SELECT COUNT(*) AS n FROM gallery_images");
}

export function galleryTags() {
  const map = new Map<string, number>();
  for (const row of getGalleryImages()) {
    if (row.program_tag) map.set(row.program_tag, (map.get(row.program_tag) ?? 0) + 1);
  }
  return ["All", ...map.keys()];
}

export function getMembers(opts?: { status?: string }) {
  const rows = opts?.status
    ? db.prepare("SELECT * FROM members WHERE status = ? ORDER BY created_at DESC").all(opts.status)
    : db.prepare("SELECT * FROM members ORDER BY created_at DESC").all();
  return rows as MemberRow[];
}

export function getMemberByEmail(email: string) {
  const row = db
    .prepare("SELECT * FROM members WHERE email = ? COLLATE NOCASE")
    .get(email) as MemberRow | undefined;
  return row;
}

export function getMember(id: number) {
  const row = db.prepare("SELECT * FROM members WHERE id = ?").get(id) as MemberRow | undefined;
  return row;
}

export function memberCount() {
  return count("SELECT COUNT(*) AS n FROM members WHERE status = 'active'");
}

export function getPledges(opts?: { member_id?: number; status?: string }) {
  let sql = "SELECT p.*, m.name AS member_name, m.email AS member_email FROM pledges p LEFT JOIN members m ON m.id = p.member_id";
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (opts?.member_id) {
    clauses.push("p.member_id = ?");
    params.push(opts.member_id);
  }
  if (opts?.status) {
    clauses.push("p.status = ?");
    params.push(opts.status);
  }
  if (clauses.length) sql += " WHERE " + clauses.join(" AND ");
  sql += " ORDER BY p.created_at DESC";
  return db.prepare(sql).all(...params) as (PledgeRow & { member_name: string | null; member_email: string | null })[];
}

export function pledgeCount() {
  return count("SELECT COUNT(*) AS n FROM pledges WHERE status = 'active'");
}

export function pledgeTotalCents() {
  const row = db
    .prepare("SELECT COALESCE(SUM(amount_cents), 0) AS s FROM pledges WHERE status = 'active' AND frequency = 'monthly'")
    .get() as { s: number };
  return row.s;
}

export function newMessageCount() {
  return count("SELECT COUNT(*) AS n FROM contact_messages WHERE status = 'new'");
}

export function getMessages(opts?: { status?: string }) {
  const rows = opts?.status
    ? db.prepare("SELECT * FROM contact_messages WHERE status = ? ORDER BY created_at DESC").all(opts.status)
    : db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
  return rows as {
    id: number;
    name: string;
    email: string;
    reason: string;
    message: string;
    status: string;
    created_at: string;
  }[];
}

export function getDonations(opts?: { limit?: number }) {
  const rows = db
    .prepare(
      `SELECT d.*, dr.name AS donor_name, dr.email AS donor_email
       FROM donations d LEFT JOIN donors dr ON dr.id = d.donor_id
       ORDER BY d.created_at DESC ${opts?.limit ? "LIMIT ?" : ""}`
    )
    .all(...(opts?.limit ? [opts.limit] : [])) as Record<string, unknown>[];
  return rows;
}

export function donationCount() {
  return count("SELECT COUNT(*) AS n FROM donations WHERE status = 'success'");
}

export function donationTotalCents() {
  const row = db
    .prepare("SELECT COALESCE(SUM(amount_cents), 0) AS s FROM donations WHERE status = 'success'")
    .get() as { s: number };
  return row.s;
}

export function rsvpsForEvent(eventSlug: string) {
  return count("SELECT COUNT(*) AS n FROM rsvps WHERE event_slug = ?", eventSlug);
}

export { rsvpCount };
