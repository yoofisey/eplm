"use client";

import { useState } from "react";
import { useActionState } from "react";
import { recordGiveIntent, type ActionState } from "@/lib/actions";
import { site } from "@/content/site";
import { Field, inputClasses } from "@/components/ui/Field";
import { CheckoutOverlay } from "@/components/ui/CheckoutOverlay";
import type { DonationFrequency } from "@/lib/types";

const initial: ActionState = { ok: false };

const suggested = [
  { value: 50, label: "GHS 50", impact: "Covers a woman's transport to circle for a month" },
  { value: 120, label: "GHS 120", impact: "Funds a seat at our next career workshop" },
  { value: 300, label: "GHS 300", impact: "Powers a full couples' date-night session" },
  { value: 600, label: "GHS 600", impact: "Sponsors a woman's weekend retreat" },
];

const frequencies: { value: DonationFrequency; label: string }[] = [
  { value: "one-time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

export function GiveCheckout() {
  const [preset, setPreset] = useState<number | null>(120);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  const [state, action, pending] = useActionState(recordGiveIntent, initial);

  const amount = custom.trim() !== "" ? Number(custom) : preset ?? 0;
  const selectedImpact = suggested.find((s) => s.value === preset)?.impact;

  return (
    <form action={action} className="grid gap-6">
      {state.ok ? (
        <div className="rounded-lg bg-sage/15 px-4 py-4 text-sm font-medium leading-relaxed text-sage dark:text-parchment">
          {state.message}
          <p className="mt-3 text-sage/90">
            Mobile Money: <strong>{site.moMo.provider} · {site.moMo.number}</strong> (
            {site.moMo.name}). Bank: <strong>{site.bank.bank}</strong> ·{" "}
            <strong>{site.bank.accountName}</strong> · acc.{" "}
            <strong>{site.bank.accountNumber}</strong>. After transfer, use the
            &quot;I&apos;ve already given&quot; form below to log your reference.
          </p>
        </div>
      ) : (
        <>
          <input type="hidden" name="amount" value={amount || ""} />
          <input type="hidden" name="frequency" value={frequency} />

          <div>
            <p className="mb-3 text-sm font-semibold text-ink dark:text-parchment">
              Choose an amount (GHS)
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggested.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    setPreset(s.value);
                    setCustom("");
                  }}
                  aria-pressed={preset === s.value && custom.trim() === ""}
                  className={`min-h-11 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-colors ${
                    preset === s.value && custom.trim() === ""
                      ? "border-wine bg-wine/10 text-wine dark:border-gold-soft dark:text-gold-soft"
                      : "border-ink/15 text-ink hover:border-wine/50 dark:border-parchment/20 dark:text-parchment"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="give-custom" className="sr-only">
                Custom amount in GHS
              </label>
              <input
                id="give-custom"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="Or enter your own amount (GHS)"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  if (e.target.value.trim() !== "") setPreset(null);
                }}
                className={inputClasses}
              />
            </div>
            {selectedImpact && (
              <p className="mt-2 text-sm text-sage dark:text-gold-soft">
                {selectedImpact}
              </p>
            )}
            {state.fieldErrors?.amount && (
              <p className="mt-2 text-sm text-wine dark:text-gold-soft">
                {state.fieldErrors.amount}
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink dark:text-parchment">
              How often?
            </p>
            <div className="flex flex-wrap gap-2">
              {frequencies.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFrequency(f.value)}
                  aria-pressed={frequency === f.value}
                  className={`min-h-11 rounded-full border-2 px-5 text-sm font-semibold transition-colors ${
                    frequency === f.value
                      ? "border-wine bg-wine text-cream"
                      : "border-ink/15 text-ink hover:border-wine/50 dark:border-parchment/20 dark:text-parchment"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft dark:text-parchment/60">
              {frequency === "one-time"
                ? "A single gift, whenever it suits you."
                : `We'll thank you and remind you ${frequency}ly. You can pause anytime.`}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="give-name">
              <input
                id="give-name"
                name="name"
                required
                autoComplete="name"
                className={inputClasses}
                placeholder="Ama Owusu"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.name}
                </p>
              )}
            </Field>
            <Field label="Email" htmlFor="give-email">
              <input
                id="give-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClasses}
                placeholder="you@email.com"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1.5 text-sm text-wine dark:text-gold-soft">
                  {state.fieldErrors.email}
                </p>
              )}
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="give-phone">
              <input
                id="give-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={inputClasses}
                placeholder="+233 24 000 0000"
              />
            </Field>
            <Field label="Prayer request (optional)" htmlFor="give-prayer">
              <input
                id="give-prayer"
                name="prayer"
                className={inputClasses}
                placeholder="Our team prays for every giver"
              />
            </Field>
          </div>

          {state.message && (
            <p className="text-sm text-wine dark:text-gold-soft">{state.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-wine px-8 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft disabled:opacity-60 sm:w-auto"
            >
              {pending ? "Preparing…" : `Give ${amount ? `GHS ${amount}` : ""}${frequency !== "one-time" ? ` ${frequency}` : ""}`}
            </button>
            <p className="mt-3 text-xs text-ink-soft dark:text-parchment/60">
              Secure card and mobile money checkout arrives next. Your info is
              never sold or shared.
            </p>
          </div>
        </>
      )}

      {pending && (
        <CheckoutOverlay
          title="Preparing your secure checkout…"
          body={`We are setting up your gift for ${frequency} giving. Do not close or refresh this tab.`}
        />
      )}
    </form>
  );
}