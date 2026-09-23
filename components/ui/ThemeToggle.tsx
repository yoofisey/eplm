"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("eplm-theme");
    return stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("eplm-theme")) {
        setDark(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("eplm-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      suppressHydrationWarning
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex size-11 items-center justify-center rounded-full border transition-colors ${
        dark
          ? "border-parchment/20 text-parchment hover:bg-parchment/10"
          : "border-ink/15 text-ink hover:bg-ink/5"
      }`}
    >
      <svg
        suppressHydrationWarning
        className={dark ? "hidden" : ""}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        {[
          [12, 2, 0, -2.5],
          [12, 22, 0, 2.5],
          [2, 12, -2.5, 0],
          [22, 12, 2.5, 0],
          [5.3, 5.3, -1.8, -1.8],
          [18.7, 18.7, 1.8, 1.8],
          [18.7, 5.3, 1.8, -1.8],
          [5.3, 18.7, -1.8, 1.8],
        ].map(([x, y, dx, dy]) => (
          <line
            key={`${x}-${y}`}
            x1={x}
            y1={y}
            x2={x + dx}
            y2={y + dy}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <svg
        suppressHydrationWarning
        className={dark ? "" : "hidden"}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}