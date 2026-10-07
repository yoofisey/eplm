import type { Metadata } from "next";
import { getDonations, donationCount, donationTotalCents } from "@/lib/repo";
import { formatCents, formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImportForm } from "@/components/admin/ImportForm";

export const metadata: Metadata = {
  title: "Donations",
  robots: { index: false, follow: false },
};

type DonationRow = {
  id: number;
  donor_id: number | null;
  amount_cents: number;
  currency: string;
  frequency: string;
  paystack_reference: string | null;
  status: string;
  method: string;
  notes: string | null;
  created_at: string;
  donor_name: string | null;
  donor_email: string | null;
};

export default function AdminDonationsPage() {
  const donations = getDonations() as DonationRow[];

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Giving
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Donations
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          {donationCount()} successful of {donations.length} total ·{" "}
          <span className="font-semibold text-gold dark:text-gold-soft">
            {formatCents(donationTotalCents())}
          </span>{" "}
          successful
        </p>
      </header>

      <div className="mb-8 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
        <h2 className="font-display text-lg">Import in bulk</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-parchment/70">
          Bring in a giving record from Excel, a bank export or Word — the header
          row is matched automatically.
        </p>
        <div className="mt-4 max-w-xl">
          <ImportForm target="Donations" />
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No donations yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-semibold text-ink dark:text-parchment">
                    {d.donor_name ?? "Anonymous"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {d.donor_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-wine dark:text-gold-soft">
                    {formatCents(d.amount_cents)}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-soft dark:text-parchment/70">
                    {d.frequency}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {d.method}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft dark:text-parchment/70">
                    {d.paystack_reference ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {formatDate(d.created_at)}
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