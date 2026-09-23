import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE = "eplm_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function constantTimeEqual(a: string, b: string) {
  const ha = sha256(a);
  const hb = sha256(b);
  return ha.length === hb.length && timingSafeEqual(ha, hb);
}

function resolveAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function hasConfiguredPassword() {
  return Boolean(resolveAdminPassword());
}

export function verifyPassword(candidate: string) {
  const expected = resolveAdminPassword();
  if (!expected) return false;
  return constantTimeEqual(expected, candidate);
}

export async function createAdminSession() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE_SECONDS * 1000).toISOString();

  db.prepare(
    "INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)",
  ).run(token, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
  }
  cookieStore.delete(COOKIE);
}

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return false;

  const row = db
    .prepare("SELECT expires_at FROM admin_sessions WHERE token = ?")
    .get(token) as { expires_at: string } | undefined;
  if (!row) return false;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
    return false;
  }
  return true;
}
