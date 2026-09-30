"use client";

import { useActionState } from "react";
import Link from "next/link";
import { adminAddMember } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function MemberForm() {
  const [state, action, pending] = useActionState(adminAddMember, initial);

  return (
    <form action={action} className="grid gap-5">
      {state.ok ? (
        <div className="rounded-xl border border-sage/30 bg-sage/10 p-5 text-sm text-ink dark:text-parchment">
          <p className="font-semibold text-sage dark:text-gold-soft">
            {state.message}
          </p>
          <Link
            href="/admin/members"
            transitionTypes={["nav-forward"]}
            className="mt-3 inline-block font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft"
          >
            Back to members
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="member-name">
              <input
                id="member-name"
                name="name"
                required
                className={inputClasses}
                placeholder="Ama Mensah"
              />
            </Field>
            <Field label="Email" htmlFor="member-email">
              <input
                id="member-email"
                name="email"
                type="email"
                required
                className={inputClasses}
                placeholder="ama@example.com"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="member-phone">
              <input
                id="member-phone"
                name="phone"
                className={inputClasses}
                placeholder="+233 20 000 0000"
              />
            </Field>
            <Field label="Occupation" htmlFor="member-occupation">
              <input
                id="member-occupation"
                name="occupation"
                className={inputClasses}
                placeholder="Nurse, trader, engineer…"
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Circles (comma separated)" htmlFor="member-circles">
              <input
                id="member-circles"
                name="circles"
                className={inputClasses}
                placeholder="Prayer, Marriage, Career"
              />
            </Field>
            <Field label="How they joined" htmlFor="member-source">
              <input
                id="member-source"
                name="source"
                className={inputClasses}
                placeholder="Event, referral, community…"
              />
            </Field>
          </div>
          <Field label="Status" htmlFor="member-status">
            <select id="member-status" name="status" className={inputClasses}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          {state.message && !state.ok && (
            <p className="text-sm text-wine dark:text-gold-soft">
              {state.message}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
            >
              {pending ? "Adding…" : "Add member"}
            </button>
            <Link
              href="/admin/members"
              transitionTypes={["nav-back"]}
              className="inline-flex min-h-11 items-center rounded-full border border-current px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream dark:text-parchment dark:hover:bg-parchment dark:hover:text-ink"
            >
              Cancel
            </Link>
          </div>
        </>
      )}
    </form>
  );
}