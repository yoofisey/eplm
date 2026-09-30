import type { Metadata } from "next";
import { MemberForm } from "@/components/admin/MemberForm";
import { FormCard } from "@/components/ui/FormCard";

export const metadata: Metadata = {
  title: "New member",
  robots: { index: false, follow: false },
};

export default function AdminNewMemberPage() {
  return (
    <>
      <header className="mb-8">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          Community
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
          Add member
        </h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-parchment/70">
          Add someone to the EPLM membership roll.
        </p>
      </header>
      <FormCard>
        <MemberForm />
      </FormCard>
    </>
  );
}