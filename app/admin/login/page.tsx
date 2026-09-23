import type { Metadata } from "next";
import { hasConfiguredPassword } from "@/lib/auth";
import { FormCard } from "@/components/ui/FormCard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const canLogin = hasConfiguredPassword();

  return (
    <section className="bg-background text-ink dark:text-parchment">
      <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
        <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          EPLM Admin
        </p>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          Sign in
        </h1>
        {canLogin ? (
          <div className="mt-8">
            <FormCard intro="Enter the admin password to manage posts, events and giving.">
              <AdminLoginForm />
            </FormCard>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/10 p-6 text-sm leading-relaxed text-ink-soft dark:text-parchment/80">
            <p className="font-display text-lg text-gold dark:text-gold-soft">
              Sign-in isn&apos;t configured yet.
            </p>
            <p className="mt-2">
              Set the <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-xs dark:bg-parchment/10">ADMIN_PASSWORD</code>{" "}
              environment variable (a strong password) and restart the server to
              enable the admin area.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}