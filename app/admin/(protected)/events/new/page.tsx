import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";
import { FormCard } from "@/components/ui/FormCard";

export const metadata: Metadata = {
  title: "New event",
  robots: { index: false, follow: false },
};

export default function AdminNewEventPage() {
  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Events
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          New event
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          Add a workshop, retreat, date night or summit.
        </p>
      </header>
      <FormCard>
        <EventForm />
      </FormCard>
    </>
  );
}