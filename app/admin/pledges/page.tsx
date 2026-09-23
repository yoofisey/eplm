import type { Metadata } from "next";
import { getPledges, pledgeCount, pledgeTotalCents } from "@/lib/repo";
import type { PledgeRow } from "@/lib/repo";
import { formatCents, formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = {
  title: "Pledges",
  robots: { index: false, follow: false },
};

type PledgeWithMember = PledgeRow & {
  member_name: string | null;
  member_email: string | null;
};

export default function AdminPledgesPage() {
  const pledges = getPledges() as PledgeWithMember[];

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Giving
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Pledges
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          {pledgeCount()} active · committed monthly total{" "}
          <span className="font-semibold text-gold dark:text-gold-soft">
            {formatCents(pledgeTotalCents())}
          </span>
        </p>
      </header>

      {pledges.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No pledges yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
              {pledges.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-semibold text-ink dark:text-parchment">
                    {p.member_name ?? "Unlinked"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {p.member_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-wine dark:text-gold-soft">
                    {formatCents(p.amount_cents)}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-soft dark:text-parchment/70">
                    {p.frequency}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {p.notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {formatDate(p.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}