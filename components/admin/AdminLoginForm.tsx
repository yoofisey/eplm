"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/components/admin/actions";
import type { ActionState } from "@/lib/actions";
import { Field, inputClasses } from "@/components/ui/Field";

const initial: ActionState = { ok: false };

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.replace("/admin");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={action} className="grid gap-5">
      <Field label="Admin password" htmlFor="admin-password">
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClasses}
          placeholder="••••••••"
        />
        {state.fieldErrors?.password && (
          <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
            {state.fieldErrors.password}
          </p>
        )}
      </Field>
      {state.message && !state.ok && (
        <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-8 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}