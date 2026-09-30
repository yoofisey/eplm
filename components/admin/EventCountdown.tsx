"use client";

import { useEffect, useState } from "react";

function diffMs(target: number) {
  return Math.max(0, target - Date.now());
}

export function EventCountdown({
  date,
  startTime,
  tone = "default",
}: {
  date: string;
  startTime: string;
  tone?: "default" | "wine";
}) {
  const target = new Date(`${date}T${startTime}:00`).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = diffMs(target);
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const cells = [
    { label: "days", value: days },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className={`rounded-xl px-3 py-2 text-center shadow-sm min-w-16 ${
            tone === "wine"
              ? "border border-cream/20 bg-cream/10"
              : "border border-ink/10 bg-surface dark:border-parchment/10"
          }`}
        >
          <p
            className={`font-display text-2xl tabular-nums ${
              tone === "wine" ? "text-gold-soft dark:text-gold" : "text-wine dark:text-gold-soft"
            }`}
          >
            {String(cell.value).padStart(2, "0")}
          </p>
          <p
            className={`mt-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase ${
              tone === "wine" ? "text-cream/70 dark:text-parchment/60" : "text-ink-soft dark:text-parchment/60"
            }`}
          >
            {cell.label}
          </p>
        </div>
      ))}
    </div>
  );
}