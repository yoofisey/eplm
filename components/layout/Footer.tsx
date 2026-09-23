import Link from "next/link";
import { nav, site } from "@/content/site";
import { programs } from "@/content/programs";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ButtonLink } from "@/components/ui/Button";
import { Brand } from "./Header";

const socials = [
  { label: "Instagram", href: site.socials.instagram },
  { label: "Facebook", href: site.socials.facebook },
  { label: "YouTube", href: site.socials.youtube },
  { label: "LinkedIn", href: site.socials.linkedin },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-parchment dark:border-parchment/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-parchment">
            <Brand />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-parchment/70">
            {site.tagline} {site.location}.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="min-h-11 rounded-full border border-parchment/25 px-4 py-2 text-xs font-semibold text-parchment transition-colors hover:bg-parchment hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-parchment">Explore</h3>
          <ul className="mt-4 space-y-1">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  transitionTypes={["nav-forward"]}
                  className="inline-flex min-h-11 items-center text-sm text-parchment/75 transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <ButtonLink href={nav.join.href} variant="gold" transitionTypes={["nav-forward"]}>
              {nav.join.label}
            </ButtonLink>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-parchment">Programs</h3>
          <ul className="mt-4 space-y-1">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/programs/${p.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="inline-flex min-h-11 items-center text-sm text-parchment/75 transition-colors hover:text-gold-soft"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-parchment">Stay close</h3>
          <p className="mt-4 text-sm text-parchment/70">
            Occasional good news from the circles. No noise.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-parchment/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-parchment/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.longName} ({site.name}). All
            rights reserved.
          </p>
          <p>
            {site.email} · {site.address}
          </p>
        </div>
      </div>
    </footer>
  );
}