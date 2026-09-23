const toneFor: Record<string, string> = {
  new: "bg-gold/15 text-gold dark:text-gold-soft",
  handled: "bg-sage/15 text-sage",
  archived: "bg-ink/10 text-ink-soft dark:bg-parchment/10 dark:text-parchment/60",
  published: "bg-sage/15 text-sage",
  draft: "bg-ink/10 text-ink-soft dark:bg-parchment/10 dark:text-parchment/60",
  active: "bg-sage/15 text-sage",
  pending: "bg-gold/15 text-gold dark:text-gold-soft",
  confirmed: "bg-sage/15 text-sage",
  success: "bg-sage/15 text-sage",
};

export function StatusBadge({ status }: { status: string }) {
  const classes = toneFor[status] ?? "bg-wine/10 text-wine dark:text-gold-soft";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${classes}`}
    >
      {status}
    </span>
  );
}