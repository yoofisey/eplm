import type { Metadata } from "next";
import { getMembers, memberCount } from "@/lib/repo";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/components/admin/format";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export default function AdminMembersPage() {
  const members = getMembers();

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
            Community
          </p>
          <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            Members
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
            {memberCount()} active of {members.length} total
          </p>
        </div>
        <ButtonLink
          href="/admin/members/new"
          transitionTypes={["nav-forward"]}
          variant="wine"
        >
          Add member
        </ButtonLink>
      </header>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No members yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Occupation</th>
                <th className="px-4 py-3">Circles</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-semibold text-ink dark:text-parchment">
                    {m.name}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {m.email}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {m.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {m.occupation ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {m.circles ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {formatDate(m.created_at)}
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