import type { ReactNode } from "react";

export function FormCard({
  title,
  intro,
  children,
  className = "",
}: {
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm sm:p-8 dark:border-parchment/10 ${className}`}
    >
      {title && (
        <h3 className="font-display text-xl text-ink sm:text-2xl dark:text-parchment">
          {title}
        </h3>
      )}
      {intro && (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-parchment/70">
          {intro}
        </p>
      )}
      <div className={title || intro ? "mt-6" : ""}>{children}</div>
    </div>
  );
}