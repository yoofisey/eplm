import "server-only";
import { db } from "@/lib/db";
import {
  mapHeaders,
  toCents,
  toDate,
  toTime,
  toBool,
  cleanText,
  type FieldSpec,
  type ImportTarget,
} from "@/lib/importer";

// Header synonyms per target. The importer picks the best-matching column for
// each field, so admins can use their own spreadsheets without editing them.

export const TARGET_SPECS: Record<ImportTarget, { label: string; specs: FieldSpec[] }> = {
  members: {
    label: "Members",
    specs: [
      { field: "name", label: "Name", aliases: ["full name", "member", "member name"], required: true },
      { field: "email", label: "Email", aliases: ["e mail", "email address"] },
      { field: "phone", label: "Phone", aliases: ["phone number", "mobile", "tel", "contact"] },
      { field: "occupation", label: "Occupation", aliases: ["role", "job", "profession"] },
      { field: "circles", label: "Circles", aliases: ["circle", "group", "chapter"] },
      { field: "source", label: "Source", aliases: ["how did they hear", "referral", "channel"] },
      { field: "status", label: "Status", aliases: ["state", "membership status"] },
      { field: "joined", label: "Joined", aliases: ["join date", "date joined", "start date", "registered"] },
    ],
  },
  donations: {
    label: "Donations",
    specs: [
      { field: "donor_name", label: "Donor name", aliases: ["donor", "name", "contributor"], required: true },
      { field: "donor_email", label: "Donor email", aliases: ["email", "e mail"] },
      { field: "amount", label: "Amount", aliases: ["amount ghs", "amount ghc", "value", "ghs", "amount cedis"], required: true },
      { field: "currency", label: "Currency", aliases: ["curr"] },
      { field: "frequency", label: "Frequency", aliases: ["type", "recurring"] },
      { field: "method", label: "Method", aliases: ["payment method", "channel", "mode"] },
      { field: "status", label: "Status", aliases: ["state"] },
      { field: "reference", label: "Reference", aliases: ["ref", "transaction id", "paystack ref"] },
      { field: "date", label: "Date", aliases: ["donated on", "created", "paid"] },
    ],
  },
  events: {
    label: "Events",
    specs: [
      { field: "title", label: "Title", aliases: ["event", "event title", "name"], required: true },
      { field: "description", label: "Description", aliases: ["details", "about", "summary"] },
      { field: "date", label: "Date", aliases: ["event date", "when", "day"], required: true },
      { field: "start_time", label: "Start time", aliases: ["start", "starts", "time", "start time"], required: true },
      { field: "end_time", label: "End time", aliases: ["end", "ends"] },
      { field: "location", label: "Location", aliases: ["venue", "place"], required: true },
      { field: "capacity", label: "Capacity", aliases: ["seats", "max", "limit"] },
    ],
  },
  attendance: {
    label: "Attendance",
    specs: [
      { field: "member_name", label: "Member", aliases: ["name", "member", "attendee", "participant"], required: true },
      { field: "event_slug", label: "Event", aliases: ["event", "event title", "session", "activity"] },
      { field: "attended_on", label: "Date", aliases: ["date", "attended on", "when"] },
      { field: "present", label: "Present", aliases: ["status", "attendance", "present absent"] },
      { field: "notes", label: "Notes", aliases: ["note", "comment", "remark"] },
    ],
  },
};

export type ImportSummary = {
  imported: number;
  skipped: number;
  messages: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function cell(row: string[], idx: number | undefined) {
  return idx === undefined ? "" : cleanText(row[idx]);
}

const findMemberByName = db.prepare("SELECT id FROM members WHERE name = ? COLLATE NOCASE LIMIT 1");
const findAttendanceRow = db.prepare(
  `SELECT id FROM event_attendance
   WHERE member_name = ? COLLATE NOCASE
     AND COALESCE(event_slug, '') = COALESCE(?, '')
     AND COALESCE(attended_on, '') = COALESCE(?, '')
   LIMIT 1`,
);
const insertAttendance = db.prepare(
  `INSERT INTO event_attendance (event_slug, member_id, member_name, attended_on, present, notes)
   VALUES (?, ?, ?, ?, ?, ?)`,
);
const updateAttendance = db.prepare(
  `UPDATE event_attendance SET present = ?, notes = COALESCE(NULLIF(?, ''), notes),
     member_id = COALESCE(?, member_id)
   WHERE id = ?`,
);

function importMembers(rows: string[][], mapping: Record<string, number>): ImportSummary {
  const summary: ImportSummary = { imported: 0, skipped: 0, messages: [] };
  const findByName = db.prepare("SELECT id FROM members WHERE name = ? COLLATE NOCASE LIMIT 1");
  const findByEmail = db.prepare("SELECT id FROM members WHERE email = ? COLLATE NOCASE LIMIT 1");
  const insert = db.prepare(
    `INSERT INTO members (name, email, phone, occupation, circles, source, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), datetime('now')))`,
  );
  const update = db.prepare(
    `UPDATE members SET phone = COALESCE(NULLIF(?, ''), phone),
       occupation = COALESCE(NULLIF(?, ''), occupation),
       circles = COALESCE(NULLIF(?, ''), circles),
       source = COALESCE(NULLIF(?, ''), source),
       status = COALESCE(NULLIF(?, ''), status),
       email = COALESCE(NULLIF(?, ''), email)
     WHERE id = ?`,
  );

  for (const row of rows) {
    const name = cell(row, mapping.name);
    const email = cell(row, mapping.email);
    if (!name) {
      summary.skipped++;
      continue;
    }
    const joined = toDate(cell(row, mapping.joined)) ?? "";
    const status = cell(row, mapping.status) || "active";
    const existing =
      (email ? (findByEmail.get(email) as { id: number } | undefined) : undefined) ??
      (findByName.get(name) as { id: number } | undefined);

    if (existing) {
      update.run(
        cell(row, mapping.phone),
        cell(row, mapping.occupation),
        cell(row, mapping.circles),
        cell(row, mapping.source),
        status,
        email,
        existing.id,
      );
    } else {
      insert.run(
        name,
        email || `${slugify(name)}@imported.local`,
        cell(row, mapping.phone) || null,
        cell(row, mapping.occupation) || null,
        cell(row, mapping.circles) || null,
        cell(row, mapping.source) || null,
        status,
        joined,
      );
    }
    summary.imported++;
  }
  return summary;
}

function importDonations(rows: string[][], mapping: Record<string, number>): ImportSummary {
  const summary: ImportSummary = { imported: 0, skipped: 0, messages: [] };
  const findDonor = db.prepare("SELECT id FROM donors WHERE email = ? COLLATE NOCASE LIMIT 1");
  const insertDonor = db.prepare("INSERT INTO donors (name, email, phone) VALUES (?, ?, ?)");
  const findByReference = db.prepare(
    "SELECT id FROM donations WHERE paystack_reference = ? LIMIT 1",
  );
  const insertDonation = db.prepare(
    `INSERT INTO donations (donor_id, amount_cents, currency, frequency, status, method, paystack_reference, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL, COALESCE(NULLIF(?, ''), datetime('now')))`,
  );

  for (const row of rows) {
    const donor_name = cell(row, mapping.donor_name);
    const amount = toCents(cell(row, mapping.amount));
    if (!donor_name || amount === null || amount <= 0) {
      summary.skipped++;
      continue;
    }
    const reference = cell(row, mapping.reference) || null;
    // Skip a second row carrying a reference we already imported. This keeps
    // re-uploading a bank/export file from doubling the giving records.
    if (reference && findByReference.get(reference)) {
      summary.skipped++;
      continue;
    }
    const email = cell(row, mapping.donor_email);
    let donorId: number;
    const existing = email
      ? (findDonor.get(email) as { id: number } | undefined)
      : undefined;
    if (existing) {
      donorId = existing.id;
    } else {
      const res = insertDonor.run(donor_name, email || `${slugify(donor_name)}@imported.local`, null);
      donorId = Number(res.lastInsertRowid);
    }
    insertDonation.run(
      donorId,
      amount,
      cell(row, mapping.currency) || "GHS",
      (cell(row, mapping.frequency) || "one-time").toLowerCase(),
      (cell(row, mapping.status) || "success").toLowerCase(),
      (cell(row, mapping.method) || "manual").toLowerCase(),
      reference,
      toDate(cell(row, mapping.date)) ?? "",
    );
    summary.imported++;
  }
  return summary;
}

function importEvents(rows: string[][], mapping: Record<string, number>): ImportSummary {
  const summary: ImportSummary = { imported: 0, skipped: 0, messages: [] };
  const findBySlug = db.prepare("SELECT id FROM events WHERE slug = ? LIMIT 1");
  const findByTitleDate = db.prepare(
    "SELECT id FROM events WHERE title = ? COLLATE NOCASE AND date = ? LIMIT 1",
  );
  const insert = db.prepare(
    `INSERT INTO events (slug, title, description, date, start_time, end_time, location, capacity, published, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, COALESCE(NULLIF(?, ''), datetime('now')))`,
  );
  const update = db.prepare(
    `UPDATE events SET description = COALESCE(NULLIF(?, ''), description),
       start_time = COALESCE(NULLIF(?, ''), start_time),
       end_time = COALESCE(NULLIF(?, ''), end_time),
       location = COALESCE(NULLIF(?, ''), location),
       capacity = CASE WHEN ? > 0 THEN ? ELSE capacity END
     WHERE id = ?`,
  );

  for (const row of rows) {
    const title = cell(row, mapping.title);
    const date = toDate(cell(row, mapping.date));
    const start_time = toTime(cell(row, mapping.start_time));
    const location = cell(row, mapping.location);
    if (!title || !date || !start_time || !location) {
      summary.skipped++;
      continue;
    }
    const capacity = Number(cell(row, mapping.capacity)) || 0;
    const existing = findByTitleDate.get(title, date) as { id: number } | undefined;
    if (existing) {
      // Same title + date: refresh the details instead of creating a twin.
      update.run(
        cell(row, mapping.description),
        start_time,
        toTime(cell(row, mapping.end_time)),
        location,
        capacity,
        capacity,
        existing.id,
      );
      summary.imported++;
      continue;
    }
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let n = 2;
    while (findBySlug.get(slug)) slug = `${baseSlug}-${n++}`;
    insert.run(
      slug,
      title,
      cell(row, mapping.description) || "",
      date,
      start_time,
      toTime(cell(row, mapping.end_time)),
      location,
      capacity,
      date,
    );
    summary.imported++;
  }
  return summary;
}

// Shared by the bulk importer and the single-record admin form so a manual
// entry and an imported row can never collide.
export function upsertAttendance(input: {
  memberName: string;
  eventSlug?: string;
  attendedOn?: string | null;
  present: boolean;
  notes?: string | null;
}) {
  const member_name = cleanText(input.memberName);
  if (!member_name) return { ok: false as const, message: "Enter a member name." };
  const event_slug = input.eventSlug ? slugify(input.eventSlug) || null : null;
  const attended_on = input.attendedOn ?? null;
  const presentFlag = input.present ? 1 : 0;
  const notes = input.notes ? cleanText(input.notes) || null : null;
  const member = findMemberByName.get(member_name) as { id: number } | undefined;

  const existing = findAttendanceRow.get(member_name, event_slug, attended_on) as
    | { id: number }
    | undefined;
  if (existing) {
    updateAttendance.run(presentFlag, notes, member?.id ?? null, existing.id);
    return { ok: true as const, updated: true };
  }
  insertAttendance.run(
    event_slug,
    member?.id ?? null,
    member_name,
    attended_on,
    presentFlag,
    notes,
  );
  return { ok: true as const, updated: false };
}

function importAttendance(rows: string[][], mapping: Record<string, number>): ImportSummary {
  const summary: ImportSummary = { imported: 0, skipped: 0, messages: [] };

  for (const row of rows) {
    const member_name = cell(row, mapping.member_name);
    if (!member_name) {
      summary.skipped++;
      continue;
    }
    const present = toBool(cell(row, mapping.present));
    const res = upsertAttendance({
      memberName: member_name,
      eventSlug: cell(row, mapping.event_slug),
      attendedOn: toDate(cell(row, mapping.attended_on)),
      present: present === null ? true : present,
      notes: cell(row, mapping.notes) || null,
    });
    if (!res.ok) {
      summary.skipped++;
      summary.messages.push(res.message);
      continue;
    }
    summary.imported++;
  }
  return summary;
}

const IMPORTERS = {
  members: importMembers,
  donations: importDonations,
  events: importEvents,
  attendance: importAttendance,
} as const;

export function runImport(
  target: ImportTarget,
  headers: string[],
  rows: string[][],
): { summary: ImportSummary; unmapped: string[] } {
  const specs = TARGET_SPECS[target].specs;
  const mapping = mapHeaders(headers, specs);

  const missing = specs.filter((s) => s.required && mapping[s.field] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `Couldn't find a column for: ${missing.map((m) => m.label).join(", ")}. Found headers: ${headers.join(", ")}`,
    );
  }

  // All-or-nothing: a failure part-way through a big file leaves the tables
  // untouched instead of half-imported.
  const summary = db.transaction(() => IMPORTERS[target](rows, mapping))();
  const unmapped = headers.filter((_, i) => !Object.values(mapping).includes(i));
  return { summary, unmapped };
}