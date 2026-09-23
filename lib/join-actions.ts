"use server";

import { db } from "./db";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validateName(value: string) {
  if (!value) return "Please share your name.";
  if (value.length > 120) return "Name is too long.";
}

function validateEmail(value: string) {
  if (!value) return "Please share an email address.";
  if (!EMAIL_RE.test(value)) return "That email address doesn't look right.";
}

function fieldErrors(errors: Record<string, string | undefined>) {
  const clean = Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v !== undefined),
  ) as Record<string, string>;
  return Object.keys(clean).length ? clean : undefined;
}

export async function joinMinistry(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const occupation = text(formData.get("occupation"));
  const circles = text(formData.get("circles"));
  const source = text(formData.get("source")) || "join";
  const pledge = text(formData.get("pledge"));

  const pledgeCents = pledge ? Math.round(Number(pledge) * 100) : 0;

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    pledge:
      pledge && (Number.isNaN(pledgeCents) || pledgeCents < 100)
        ? "Please enter a monthly pledge of at least GHS 1, or leave it blank."
        : undefined,
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    const result = db
      .prepare(
        `INSERT INTO members (name, email, phone, occupation, circles, source, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      )
      .run(name, email, phone || null, occupation || null, circles || null, source || null);
    const memberId = Number(result.lastInsertRowid);

    if (pledgeCents > 0) {
      db.prepare(
        `INSERT INTO pledges (member_id, amount_cents, frequency, status)
         VALUES (?, ?, 'monthly', 'active')`,
      ).run(memberId, pledgeCents);
    }

    return {
      ok: true,
      message:
        "Welcome to the Executive Purposeful Ladies Ministry! We'll be in touch with next steps.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong saving your details. Please try again.",
    };
  }
}