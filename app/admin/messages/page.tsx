import type { Metadata } from "next";
import { getMessages, newMessageCount } from "@/lib/repo";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MessageStatusButton } from "@/components/admin/MessageStatusButton";
import { formatDate } from "@/components/admin/format";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default function AdminMessagesPage() {
  const messages = getMessages();

  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Inbox
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Contact messages
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          {messages.length} total ·{" "}
          <span className="font-semibold text-wine dark:text-gold-soft">
            {newMessageCount()} new
          </span>
        </p>
      </header>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-sm text-ink-soft dark:border-parchment/20 dark:text-parchment/60">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm dark:border-parchment/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-ink dark:text-parchment">
                    {m.name}
                    <span className="ml-2 font-normal text-ink-soft dark:text-parchment/60">
                      {m.email}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs font-semibold tracking-wide text-wine uppercase dark:text-gold-soft">
                    {m.reason}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={m.status} />
                  <span className="text-xs text-ink-soft dark:text-parchment/50">
                    {formatDate(m.created_at)}
                  </span>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft dark:text-parchment/75">
                {m.message}
              </p>
              {m.status === "new" && (
                <div className="mt-5 border-t border-ink/10 pt-4 dark:border-parchment/10">
                  <MessageStatusButton id={m.id} />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}