import type { Stat } from "@/lib/types";

export function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-6 text-center shadow-sm dark:border-parchment/10">
      <p className="font-display text-4xl font-semibold text-wine sm:text-5xl dark:text-gold-soft">
        {stat.value}
      </p>
      <p className="mt-2 text-sm font-medium tracking-wide text-ink-soft uppercase dark:text-parchment/70">
        {stat.label}
      </p>
    </div>
  );
}