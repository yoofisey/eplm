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

// ---------- Members ----------

export async function adminAddMember(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const occupation = text(formData.get("occupation"));
  const circles = text(formData.get("circles"));
  const source = text(formData.get("source"));
  const status = text(formData.get("status")) || "active";

  if (!name || !email) {
    return {
      ok: false,
      message: "Name and email are required to add a member.",
    };
  }

  try {
    db.prepare(
      `INSERT INTO members (name, email, phone, occupation, circles, source, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(name, email, phone || null, occupation || null, circles || null, source || null, status);
    return { ok: true, message: "Member added." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error && /UNIQUE/.test(e.message) ? "A member with that email already exists." : "Couldn't add the member.",
    };
  }
}

// ---------- Dues ----------

export async function adminMarkDuesPaid(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const member_id = Number(text(formData.get("member_id")));
  const period = text(formData.get("period"));
  const amount = Number(text(formData.get("amount")));
  const amount_cents = Math.round(Number.isFinite(amount) ? amount * 100 : 0);
  const method = text(formData.get("method")) || "cash";
  const notes = text(formData.get("notes"));

  if (!member_id || !period || amount_cents <= 0) {
    return {
      ok: false,
      message: "Member, period and an amount above zero are required.",
    };
  }

  try {
    db.prepare(
      `INSERT INTO member_dues (member_id, period, amount_cents, method, notes)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(member_id, period) DO UPDATE SET
         amount_cents = excluded.amount_cents,
         method = excluded.method,
         notes = excluded.notes,
         paid_at = datetime('now')`,
    ).run(member_id, period, amount_cents, method, notes || null);
    return { ok: true, message: `Dues recorded for ${period}.` };
  } catch {
    return { ok: false, message: "Couldn't record the dues payment." };
  }
}

export async function adminDeleteDues(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const g = await guard();
  if (g.ok && id) db.prepare("DELETE FROM member_dues WHERE id = ?").run(id);
}

// ---------- Mass texts (record-only outbox) ----------

type TextRecipient = { member_id: number | null; name: string; phone: string };

function collectRecipients(formData: FormData): TextRecipient[] {
  const audience = text(formData.get("audience"));
  const seen = new Set<string>();
  const out: TextRecipient[] = [];

  const push = (name: string, phone: string, member_id: number | null = null) => {
    const clean = phone.trim().replace(/[^\d+]/g, "");
    if (!clean) return;
    const key = `${member_id ?? ""}:${clean}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ member_id, name, phone: clean });
  };

  if (audience === "all-members" || audience === "unpaid-members") {
    const period = text(formData.get("period")) || currentPeriod();
    const rows = db
      .prepare(
        audience === "all-members"
          ? `SELECT id, name, phone FROM members WHERE status = 'active' AND phone IS NOT NULL`
          : `SELECT m.id, m.name, m.phone FROM members m
             WHERE m.status = 'active' AND m.phone IS NOT NULL
             AND NOT EXISTS (SELECT 1 FROM member_dues d WHERE d.member_id = m.id AND d.period = ?)`,
      )
      .all(...(audience === "unpaid-members" ? [period] : [])) as {
      id: number;
      name: string;
      phone: string;
    }[];
    rows.forEach((r) => push(r.name, r.phone, r.id));
  } else if (audience === "event-rsvps") {
    const slug = text(formData.get("event_slug"));
    const rows = db
      .prepare(
        `SELECT r.name, r.phone FROM rsvps r
         WHERE r.event_slug = ? AND r.phone IS NOT NULL`,
      )
      .all(slug) as { name: string; phone: string }[];
    rows.forEach((r) => push(r.name, r.phone));
  } else if (audience === "phone-list") {
    text(formData.get("phone_list"))
      .split(/[\n,]+/)
      .forEach((p) => push("", p));
  }

  return out;
}

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function adminSendText(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const g = await guard();
  if (!g.ok) return { ok: false, message: "Signed out. Sign back in first." };
  const audience = text(formData.get("audience"));
  const body = text(formData.get("body"));
  const eventId = Number(text(formData.get("event_id"))) || null;

  if (!body) {
    return { ok: false, message: "Write a message before sending." };
  }

  const recipients = collectRecipients(formData);
  if (recipients.length === 0) {
    return {
      ok: false,
      message: "No recipients with phone numbers matched that audience.",
    };
  }

  let messageId = 0;
  try {
    const info = db
      .prepare(
        `INSERT INTO sms_messages (audience, event_id, body, recipient_count, status)
         VALUES (?, ?, ?, ?, 'queued')`,
      )
      .run(audience, eventId, body, recipients.length);
    messageId = Number(info.lastInsertRowid);

    const insert = db.prepare(
      `INSERT INTO sms_recipients (message_id, member_id, name, phone)
       VALUES (?, ?, ?, ?)`,
    );
    const tx = db.transaction((rows: TextRecipient[]) => {
      for (const r of rows) {
        insert.run(messageId, r.member_id, r.name || null, r.phone);
      }
    });
    tx(recipients);

    return {
      ok: true,
      message: `Queued for ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}. Sending will light up once an SMS provider is connected — for now this is recorded in the outbox.`,
    };
  } catch {
    return { ok: false, message: "Couldn't record the text batch." };
  }
}

// ---------- Inbox: mark handled ----------

export async function markMessageStatus(formData: FormData): Promise<void> {
  const id = Number(text(formData.get("id")));
  const actionMap: Record<string, string> = { done: "handled", archive: "archived" };
  const to = actionMap[text(formData.get("action"))];
  const g = await guard();
  if (g.ok && id && to) db.prepare("UPDATE contact_messages SET status = ? WHERE id = ?").run(to, id);
}
