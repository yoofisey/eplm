import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/auth";
import { adminLogout } from "@/lib/admin";
import {
  donationCount,
  eventCount,
  galleryCount,
  memberCount,
  newMessageCount,
  pledgeCount,
  postCount,
} from "@/lib/repo";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  const counts: Record<string, number> = {
    posts: postCount(),
    events: eventCount(),
    gallery: galleryCount(),
    members: memberCount(),
    pledges: pledgeCount(),
    messages: newMessageCount(),
    donations: donationCount(),
  };

  const nav: { href: string; label: string; count?: keyof typeof counts }[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts", count: "posts" },
    { href: "/admin/events", label: "Events", count: "events" },
    { href: "/admin/gallery", label: "Gallery", count: "gallery" },
    { href: "/admin/members", label: "Members", count: "members" },
    { href: "/admin/pledges", label: "Pledges", count: "pledges" },
    { href: "/admin/messages", label: "Messages", count: "messages" },
    { href: "/admin/donations", label: "Donations", count: "donations" },
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] bg-background text-ink md:grid md:grid-cols-[260px_1fr] dark:text-parchment">
      <aside className="border-b border-ink/10 bg-wine text-cream md:border-b-0 md:border-r dark:border-parchment/10 dark:bg-ink">
        <div className="mx-auto max-w-lg px-5 py-8 md:max-w-none md:px-6 md:py-10 md:sticky md:top-0">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-soft uppercase">
            EPLM
          </p>
          <h2 className="mt-1 font-display text-2xl">Admin</h2>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                transitionTypes={["nav-forward"]}
                className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <span>{item.label}</span>
                {item.count ? (
                  <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-cream/15 px-2 py-0.5 text-xs text-gold-soft group-hover:bg-cream/20">
                    {counts[item.count]}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
          <form action={adminLogout} className="mt-10 border-t border-cream/15 pt-5">
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-current px-5 text-sm font-semibold text-cream/90 transition-colors hover:bg-cream hover:text-wine"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">{children}</div>
    </div>
  );
}