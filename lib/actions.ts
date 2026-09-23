"use server";

import { db } from "./db";
import type { DonationFrequency } from "./types";

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

export async function submitProgramInterest(
  program: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const message = text(formData.get("message"));
  const availability = text(formData.get("availability"));

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    db.prepare(
      `INSERT INTO program_interests (name, email, phone, program, message, availability)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(name, email, phone, program, message || null, availability || null);
    return {
      ok: true,
      message: `Thanks, ${name.split(" ")[0]}. We've received your interest in ${program} and a staff member will reach out within two working days.`,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong saving your request. Please try again.",
    };
  }
}

export async function submitRsvp(
  eventSlug: string,
  eventTitle: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const guests = text(formData.get("guests"));
  const asWaitlist = text(formData.get("as")) === "waitlist";

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    db.prepare(
      `INSERT INTO rsvps (event_slug, name, email, phone, guests, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      eventSlug,
      name,
      email,
      phone || null,
      Math.max(0, Math.min(Number(guests) || 0, 5)),
      asWaitlist ? "waitlist" : "confirmed",
    );
    return {
      ok: true,
      message: asWaitlist
        ? `You're on the waitlist for ${eventTitle}. We'll be in touch the moment a space opens.`
        : `You're booked in for ${eventTitle}. Check your inbox for confirmation.`,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong saving your RSVP. Please try again.",
    };
  }
}

export async function submitContactMessage(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const reason = text(formData.get("reason"));
  const message = text(formData.get("message"));

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    reason: reason ? undefined : "Please choose a reason for contacting us.",
    message: message
      ? undefined
      : "Please write a short message so we know how to help.",
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    db.prepare(
      `INSERT INTO contact_messages (name, email, reason, message, status)
       VALUES (?, ?, ?, ?, 'new')`,
    ).run(name, email, reason, message);
    return {
      ok: true,
      message: `Message received. We'll reply within two working days at ${email}.`,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong sending your message. Please try again.",
    };
  }
}

export async function subscribeNewsletter(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = text(formData.get("email"));
  const source = text(formData.get("source"));

  const error = validateEmail(email);
  if (error) return { ok: false, fieldErrors: { email: error } };

  try {
    db.prepare(
      `INSERT INTO newsletter_subscribers (email, source) VALUES (?, ?)
       ON CONFLICT(email) DO NOTHING`,
    ).run(email, source || null);
    return {
      ok: true,
      message: "You're on the list. We send good news, rarely.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

const FREQUENCIES: DonationFrequency[] = [
  "one-time",
  "monthly",
  "quarterly",
  "annual",
];

function upsertDonor(name: string, email: string, phone: string) {
  db.prepare(
    `INSERT INTO donors (name, email, phone) VALUES (?, ?, ?)
     ON CONFLICT DO NOTHING`,
  ).run(name, email, phone || null);
  const donor = db
    .prepare(`SELECT id FROM donors WHERE email = ?`)
    .get(email) as { id: number } | undefined;
  return donor?.id ?? 0;
}

export async function recordGiveIntent(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const prayer = text(formData.get("prayer"));
  const amount = text(formData.get("amount"));
  const frequencyRaw = text(formData.get("frequency"));

  const amountCents = Math.round(Number(amount) * 100);
  const frequency: DonationFrequency = FREQUENCIES.includes(
    frequencyRaw as DonationFrequency,
  )
    ? (frequencyRaw as DonationFrequency)
    : "one-time";

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    amount: !amount || Number.isNaN(amountCents) || amountCents < 100
      ? "Please choose or enter an amount of at least GHS 1."
      : undefined,
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    const donorId = upsertDonor(name, email, phone);
    db.prepare(
      `INSERT INTO donations (donor_id, amount_cents, currency, frequency, status, method, notes)
       VALUES (?, ?, 'GHS', ?, 'pending', 'paystack', ?)`,
    ).run(donorId, amountCents, frequency, prayer || null);
    return {
      ok: true,
      message: `We've noted your gift of GHS ${(amountCents / 100).toFixed(0)}${frequency === "one-time" ? "" : ` (${frequency})`}. Online card & mobile-money checkout is being switched on — meanwhile you can give instantly with the mobile money or bank details below using the same amount.`,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong recording your gift. Please try again.",
    };
  }
}

export async function submitManualGive(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData.get("name"));
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  const amount = text(formData.get("amount"));
  const reference = text(formData.get("reference"));
  const frequencyRaw = text(formData.get("frequency"));

  const amountCents = Math.round(Number(amount) * 100);
  const frequency: DonationFrequency = FREQUENCIES.includes(
    frequencyRaw as DonationFrequency,
  )
    ? (frequencyRaw as DonationFrequency)
    : "one-time";

  const errors = {
    name: validateName(name),
    email: validateEmail(email),
    amount: !amount || Number.isNaN(amountCents) || amountCents <= 0
      ? "Please enter a valid amount in GHS."
      : undefined,
    reference: reference
      ? undefined
      : "Please share the reference number on your receipt.",
  };
  const cleaned = fieldErrors(errors);
  if (cleaned) return { ok: false, fieldErrors: cleaned };

  try {
    const donorId = upsertDonor(name, email, phone);
    db.prepare(
      `INSERT INTO donations (donor_id, amount_cents, currency, frequency, status, method, paystack_reference)
       VALUES (?, ?, 'GHS', ?, 'pending', 'manual', ?)`,
    ).run(donorId, amountCents, frequency, reference || null);

    return {
      ok: true,
      message: `Thank you for giving, ${name.split(" ")[0]}. Your reference has been logged for reconciliation.`,
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong logging your gift. Please try again.",
    };
  }
}