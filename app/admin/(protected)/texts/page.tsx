import type { Metadata } from "next";
import {
  currentDuesPeriod,
  getEvents,
  getSmsMessages,
  getSmsRecipients,
  smsMessageCount,
} from "@/lib/repo";
import { MassTextForm } from "@/components/admin/MassTextForm";
import { FormCard } from "@/components/ui/FormCard";
import { formatDate } from "@/components/admin/format";

export const metadata: Metadata = {
  title: "Texts",
  robots: { index: false, follow: false },
};

export default function AdminTextsPage() {
  const events = getEvents().map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    date: e.date,
    start_time: e.start_time,
    location: e.location,
  }));
  const messages = getSmsMessages({ limit: 20 });
  const total = smsMessageCount();

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Outreach
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Mass texts
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          Announce events and send reminders. Batches are recorded in the
          outbox ({total} so far) — sending switches on once an SMS provider is
          connected.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <FormCard
          title="Compose a batch"
          intro="Pick an audience, choose a template, then send."
        >
          <MassTextForm
            events={events}
            currentPeriod={currentDuesPeriod()}
          />
        </FormCard>

        <section className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10">
          <h2 className="font-display text-xl">Outbox</h2>
          {messages.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft dark:text-parchment/60">
              No text batches yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {messages.map((msg) => {
                const recipients = getSmsRecipients(msg.id);
                const phones = recipients
                  .slice(0, 5)
                  .map((r) => r.phone)
                  .join(", ");
                const more = recipients.length - 5;
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-ink/10 p-4 dark:border-parchment/10"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink dark:text-parchment">
                        {msg.audience.replace(/-/g, " ")}
                      </p>
                      <p className="text-xs text-ink-soft dark:text-parchment/60">
                        {formatDate(msg.created_at)} · {msg.recipient_count} to
                      </p>
                    </div>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-ink-soft dark:text-parchment/70">
                      {msg.body}
                    </p>
                    <p className="mt-2 text-xs text-ink-soft dark:text-parchment/50">
                      {phones}
                      {more > 0 ? ` + ${more} more` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}