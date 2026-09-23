"use client";

import { useState } from "react";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/5 dark:border-parchment/20 dark:text-parchment dark:hover:bg-parchment/10"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-18 z-40 border-b border-ink/10 bg-background shadow-lg dark:border-parchment/10"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-5 sm:px-8"
          >
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                transitionTypes={["nav-forward"]}
                className="min-h-11 rounded-lg px-3 py-2.5 font-display text-lg text-ink transition-colors hover:bg-ink/5 dark:text-parchment dark:hover:bg-parchment/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={nav.join.href}
              onClick={() => setOpen(false)}
              transitionTypes={["nav-forward"]}
              className={`${buttonClasses("wine", "lg", "mt-3")} self-start`}
            >
              {nav.join.label}
            </Link>
            <Link
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              transitionTypes={["nav-forward"]}
              className={`${buttonClasses("gold", "lg", "mt-3")} self-start`}
            >
              {nav.cta.label} — {site.name}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}