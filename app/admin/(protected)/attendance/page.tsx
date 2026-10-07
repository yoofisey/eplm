import type { Metadata } from "next";
import { getAttendance, attendanceCount, eventSlugs } from "@/lib/repo";
import { formatDate } from "@/components/admin/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ImportForm } from "@/components/admin/ImportForm";
import { AttendanceForm } from "@/components/admin/AttendanceForm";

export const metadata: Metadata = {
  title: "Attendance",
  robots: { index: false, follow: false },
};

export default function AdminAttendancePage() {
  const rows = getAttendance({ limit: 200 });

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Community
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Attendance
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          {attendanceCount()} recorded check-in{attendanceCount() === 1 ? "" : "s"}
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
        <h2 className="font-display text-lg">Record one person</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-parchment/70">
          For a single name at the door. Recording the same member and date twice
          updates the earlier entry instead of duplicating it.
        </p>
        <div className="mt-4">
          <AttendanceForm eventSlugs={eventSlugs()} />
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
        <h2 className="font-display text-lg">Import in bulk</h2>
        <p className="mt-1 text-sm text-ink-soft dark:text-parchment/70">
          Upload a register or sign-in sheet — match members by name, add an event
          and a present/absent column.
        </p>
        <div className="mt-4 max-w-xl">
          <ImportForm target="Attendance" />
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No attendance recorded yet. Import a register to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm dark:border-parchment/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-semibold tracking-[0.12em] text-ink-soft uppercase dark:border-parchment/10 dark:text-parchment/60">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-parchment/10">
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-semibold text-ink dark:text-parchment">
                    {a.member_name}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {a.event_slug ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.present ? "present" : "absent"} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {a.attended_on ? formatDate(a.attended_on) : "—"}
                  </td>
                  <td className="px-4 py-3 text-ink-soft dark:text-parchment/70">
                    {a.notes ?? "—"}
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