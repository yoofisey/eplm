import type { Metadata } from "next";
import Link from "next/link";
import {
  donationCount,
  donationTotalCents,
  eventCount,
  galleryCount,
  getDonations,
  getMessages,
  memberCount,
  newMessageCount,
  pledgeCount,
  pledgeTotalCents,
  postCount,
} from "@/lib/repo";
import { formatCents, formatDate } from "@/components/admin/format";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = {
  title: "Admin dashboard",
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

export default function AdminDashboardPage() {
  const recentMessages = getMessages().slice(0, 5);
  const recentDonations = getDonations({ limit: 5 }) as DonationRow[];

  const stats = [
    { label: "Posts", value: String(postCount()), tone: "default" },
    { label: "Events", value: String(eventCount()), tone: "default" },
    { label: "Gallery images", value: String(galleryCount()), tone: "default" },
    { label: "Members", value: String(memberCount()), tone: "default" },
    { label: "Active pledges", value: String(pledgeCount()), tone: "sage" },
    {
      label: "Monthly pledge total",
      value: formatCents(pledgeTotalCents()),
      tone: "gold",
    },
    { label: "New messages", value: String(newMessageCount()), tone: "wine" },
    {
      label: "Donations (GHS)",
      value: formatCents(donationTotalCents()),
      tone: "gold",
    },
  ] as const;

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Overview
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-parchment/70">
          Live counts across the ministry. {donationCount()} successful gifts
          recorded so far.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone as "default" | "gold" | "wine" | "sage"}
          />
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Recent messages</h2>
            <Link
              href="/admin/messages"
              transitionTypes={["nav-forward"]}
              className="text-sm font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft"
            >
              View all
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft dark:text-parchment/60">
              No messages yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10 dark:divide-parchment/10">
              {recentMessages.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink dark:text-parchment">
                      {m.name} <span className="font-normal text-ink-soft dark:text-parchment/60">· {m.email}</span>
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft dark:text-parchment/60">
                      {m.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StatusBadge status={m.status} />
                    <span className="text-xs text-ink-soft dark:text-parchment/50">
                      {formatDate(m.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Recent donations</h2>
            <Link
              href="/admin/donations"
              transitionTypes={["nav-forward"]}
              className="text-sm font-semibold text-wine underline decoration-gold underline-offset-4 dark:text-gold-soft"
            >
              View all
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft dark:text-parchment/60">
              No donations recorded yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10 dark:divide-parchment/10">
              {recentDonations.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink dark:text-parchment">
                      {d.donor_name ?? "Anonymous"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-soft dark:text-parchment/60">
                      {d.donor_email ?? "—"} · {d.frequency} · {d.method}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="font-display text-base text-wine dark:text-gold-soft">
                      {formatCents(d.amount_cents)}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}