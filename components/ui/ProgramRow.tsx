import Link from "next/link";
import type { Program } from "@/lib/types";

export function ProgramRow({ program }: { program: Program }) {
  return (
    <div className="grid gap-6 rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-8 dark:border-parchment/10">
      <div>
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold uppercase">
          {program.format}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl dark:text-parchment">
          {program.name}
        </h3>
        <p className="mt-2 max-w-xl leading-relaxed text-ink-soft dark:text-parchment/80">
          {program.description}
        </p>
        <p className="mt-3 text-sm font-medium text-ink-soft dark:text-parchment/70">
          {program.schedule} · {program.audience}
        </p>
      </div>
      <div className="sm:pl-6">
        <Link
          href={`/programs/${program.slug}`}
          transitionTypes={["nav-forward"]}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-wine px-5 text-sm font-semibold tracking-wide text-cream transition-colors hover:bg-wine-soft"
        >
          {program.cta}
        </Link>
      </div>
    </div>
  );
}