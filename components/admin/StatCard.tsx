export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "gold" | "wine" | "sage";
}) {
  const toneClasses: Record<string, string> = {
    default: "text-ink dark:text-parchment",
    gold: "text-gold dark:text-gold-soft",
    wine: "text-wine dark:text-gold-soft",
    sage: "text-sage dark:text-gold-soft",
  };
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm dark:border-parchment/10">
      <p className="text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase dark:text-parchment/60">
        {label}
      </p>
      <p className={`mt-2 font-display text-2xl sm:text-3xl ${toneClasses[tone]}`}>
        {value}
      </p>
    </div>
  );
}