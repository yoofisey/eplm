"use client";

import { useEffect, useRef } from "react";

export function BootOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let finished = false;
    const started = performance.now();
    const minStay = 500;
    const maxStay = 3000;

    const hide = () => {
      if (finished || performance.now() - started < minStay) return;
      finished = true;
      window.clearTimeout(fallback);
      el.classList.add("boot-overlay--hidden");
    };

    const fallback = window.setTimeout(hide, maxStay);
    const onLoad = () => hide();
    window.addEventListener("load", onLoad);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="boot-overlay"
      role="status"
      aria-label="Loading EPLM website"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-ink font-display text-2xl font-black text-parchment">
        E
      </div>
      <div className="font-display text-xl font-black tracking-[0.25em] text-ink dark:text-parchment">
        EPLM
      </div>
      <span className="spinner" aria-hidden="true" />
    </div>
  );
}