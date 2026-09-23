import Link from "next/link";
import { nav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MobileNav } from "./MobileNav";

export function Brand() {
  return (
    <Link
      href="/"
      transitionTypes={["nav-back"]}
      className="flex items-center gap-2 font-display text-2xl font-semibold text-ink dark:text-parchment"
    >
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-wine font-display text-sm font-bold text-cream">
        E
      </span>
      {site.name}
    </Link>
  );
}

export function Header() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-50 border-b border-ink/10 bg-background/90 backdrop-blur-sm dark:border-parchment/10"
    >
      <ScrollProgress />
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 lg:flex"
        >
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={["nav-forward"]}
              className="min-h-11 text-sm font-semibold tracking-wide text-ink-soft transition-colors hover:text-wine dark:text-parchment/80 dark:hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href={nav.join.href} variant="wine" transitionTypes={["nav-forward"]}>
            {nav.join.label}
          </ButtonLink>
          <ButtonLink href={nav.cta.href} variant="gold" transitionTypes={["nav-forward"]}>
            {nav.cta.label}
          </ButtonLink>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}