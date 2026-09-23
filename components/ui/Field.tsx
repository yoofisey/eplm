import type { ReactNode } from "react";

export const inputClasses =
  "w-full min-h-11 rounded-lg border border-ink/20 bg-cream px-4 py-2.5 text-ink placeholder:text-ink/40 focus:border-wine focus:outline-none dark:border-parchment/20 dark:bg-ink dark:text-parchment dark:placeholder:text-parchment/40";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-ink dark:text-parchment"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-wine dark:text-gold-soft">
          {error}
        </p>
      )}
    </div>
  );
}