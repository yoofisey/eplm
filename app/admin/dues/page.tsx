import type { Metadata } from "next";
import {
  currentDuesPeriod,
  duePaidCount,
  dueTotalCents,
  duesPeriods,
  getMembers,
  getDues,
  memberDuesStatus,
} from "@/lib/repo";
import { adminDeleteDues } from "@/lib/admin";
import { formatCents, formatDate } from "@/components/admin/format";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DuesForm } from "@/components/admin/DuesForm";
import { FormCard } from "@/components/ui/FormCard";
import { inputClasses } from "@/components/ui/Field";

export const metadata: Metadata = {
  title: "Dues",
  robots: { index: false, follow: false },
};

export default async function AdminDuesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period =
    periodParam && /^\d{4}-\d{2}$/.test(periodParam)
      ? periodParam
      : currentDuesPeriod();

  const status = memberDuesStatus(period);
  const paidCount = duePaidCount(period);
  const unpaidCount = status.length - paidCount;
  const total = dueTotalCents(period);
  const members = getMembers();
  const recent = getDues({ limit: 10 });
  const periods = duesPeriods();

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Membership
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Dues
        </h1>
        <form className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink dark:text-parchment">
              Period
            </span>
            <input
              type="month"
              name="period"
              defaultValue={period}
              className={inputClasses}
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-wine px-6 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft"
          >
            View
          </button>
        </form>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={`Paid · ${period}`} value={String(paidCount)} tone="sage" />
        <StatCard label="Not yet paid" value={String(unpaidCount)} tone="wine" />
        <StatCard
          label="Collected (GHS)"
          value={formatCents(total)}
          tone="gold"
        />
        <StatCard label="Members tracked" value={String(status.length)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <h2 className="font-display text-xl">
            Who has paid for {period}
          </h2>
          {status.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft dark:text-parchment/60">
              No members on the roll yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                    <th className="px-3 py-3">Member</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
                  {status.map((m) => (
                    <tr key={m.id}>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-ink dark:text-parchment">
                          {m.name}
                        </p>
                        <p className="text-xs text-ink-soft dark:text-parchment/60">
                          {m.phone ?? m.email}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={m.dues_id ? "paid" : "unpaid"} />
                      </td>
                      <td className="px-3 py-3 text-ink-soft dark:text-parchment/70">
                        {m.dues_id ? formatCents(m.amount_cents ?? 0) : "—"}
                      </td>
                      <td className="px-3 py-3 text-ink-soft dark:text-parchment/70">
                        {m.dues_id && m.paid_at ? formatDate(m.paid_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid gap-8">
          <FormCard title="Record a payment" intro="Mark a member as paid for a period.">
            <DuesForm
              members={members.map((m) => ({ id: m.id, name: m.name }))}
              currentPeriod={period}
            />
          </FormCard>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
        <h2 className="font-display text-xl">Recent payments</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft dark:text-parchment/60">
            No payments recorded yet.
          </p>
        ) : (
          <div className="mt-2">
            {recent.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 py-4 last:border-b-0 dark:border-parchment/10"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink dark:text-parchment">
                    {d.member_name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft dark:text-parchment/60">
                    {d.period} · {d.method}
                    {d.notes ? ` · ${d.notes}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-base text-wine dark:text-gold-soft">
                    {formatCents(d.amount_cents)}
                  </span>
                  <form action={adminDeleteDues}>
                    <input type="hidden" name="id" value={d.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-9 items-center rounded-full border border-wine/30 px-4 text-xs font-semibold text-wine transition-colors hover:bg-wine hover:text-cream dark:text-gold-soft dark:hover:bg-gold-soft dark:hover:text-ink"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}