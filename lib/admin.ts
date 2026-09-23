import "server-only";
import type { ActionState } from "@/lib/actions";
import { db } from "@/lib/db";
import {
  createAdminSession,
  destroyAdminSession,
  isAdminAuthed,
  verifyPassword,
} from "@/lib/auth";

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function guard(): Promise<{ ok: false } | { ok: true }> {
  if (await isAdminAuthed()) return { ok: true };
  return { ok: false };
}

// ---------- Sessions ----------

export async function adminLogin(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = text(formData.get("password"));
  if (!password) {
    return { ok: false, fieldErrors: { password: "Enter the admin password." } };
  }
  if (!verifyPassword(password)) {
    return { ok: false, fieldErrors: { password: "That password isn't right." } };
  }
  await createAdminSession();
  return { ok: true, message: "Signed in." };
}

export async function adminLogout(): Promise<void> {
  await destroyAdminSession();
}

// ---------- Posts ----------

export async function adminCreatePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const slug = text(formData.get("slug")) || slugify(text(formData.get("title")));
  const title = text(formData.get("title"));
  const excerpt = text(formData.get("excerpt"));
  const category = text(formData.get("category"));
  const author = text(formData.get("author")) || "EPLM Team";
  const cover = text(formData.get("cover"));
  const publishedAt = text(formData.get("publishedAt"));
  const body = text(formData.get("body"));

  if (!title || !excerpt) {
    return { ok: false, fieldErrors: { ...(title ? {} : { title: "Title is required." }), ...(excerpt ? {} : { excerpt: "Excerpt is required." }) } };
  }

  try {
    db.prepare(
      `INSERT INTO posts (slug, title, excerpt, category, author, cover, published_at, body, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    ).run(slug, title, excerpt, category, author, cover || null, publishedAt || new Date().toISOString().slice(0, 10), body || "");
    return { ok: true, message: "Post published." };
  } catch (e) {
    return { ok: false, message: e instanceof Error && /UNIQUE/.test(e.message) ? "That slug is already taken." : "Couldn't save the post." };
  }
}

export async function adminDeletePost(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const g = await guard();
  if (g.ok && id) db.prepare("DELETE FROM posts WHERE id = ?").run(id);
}

// ---------- Events ----------

export async function adminCreateEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const slug = text(formData.get("slug")) || slugify(text(formData.get("title")));
  const title = text(formData.get("title"));
  const description = text(formData.get("description"));
  const date = text(formData.get("date"));
  const start_time = text(formData.get("start_time"));
  const end_time = text(formData.get("end_time"));
  const location = text(formData.get("location"));
  const capacity = Math.max(0, Number(text(formData.get("capacity"))) || 0);
  const image = text(formData.get("image"));

  if (!title || !date || !start_time || !location) {
    return {
      ok: false,
      message: "Title, date, start time and location are required.",
    };
  }

  try {
    db.prepare(
      `INSERT INTO events (slug, title, description, date, start_time, end_time, location, capacity, image, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    ).run(slug, title, description, date, start_time, end_time || null, location, capacity, image || null);
    return { ok: true, message: "Event published." };
  } catch (e) {
    return { ok: false, message: e instanceof Error && /UNIQUE/.test(e.message) ? "That slug is already taken." : "Couldn't save the event." };
  }
}

export async function adminDeleteEvent(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const g = await guard();
  if (g.ok && id) db.prepare("DELETE FROM events WHERE id = ?").run(id);
}

// ---------- Gallery ----------

export async function adminAddGalleryImage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const alt = text(formData.get("alt"));
  const url = text(formData.get("url"));
  const program_tag = text(formData.get("program_tag"));
  if (!alt || !url) {
    return { ok: false, message: "Alt text and an image URL are required." };
  }
  try {
    db.prepare(
      `INSERT INTO gallery_images (alt, url, event_id, program_tag, "order")
       SELECT ?, ?, NULL, NULLIF(?, ''), COALESCE(MAX("order"), 0) + 1 FROM gallery_images`,
    ).run(alt, url, program_tag);
    return { ok: true, message: "Image added to the gallery." };
  } catch {
    return { ok: false, message: "Couldn't add the image." };
  }
}

export async function adminDeleteGalleryImage(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const g = await guard();
  if (g.ok && id) db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
}

// ---------- Inbox: mark handled ----------

export async function markMessageStatus(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const actionMap: Record<string, string> = { done: "handled", archive: "archived" };
  const to = actionMap[text(formData.get("action"))];
  const g = await guard();
  if (g.ok && id && to) db.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(to, id);
}
