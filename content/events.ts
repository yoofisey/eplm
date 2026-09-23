import type { Event } from "@/lib/types";

export const events: Event[] = [
  {
    slug: "womens-career-summit-2026",
    title: "Women in the Workplace Summit 2026",
    description:
      "A half-day summit on negotiating, leading and thriving at work — with panel talks, practical workshops and time to meet mentors one-on-one.",
    date: "2026-10-17",
    start_time: "09:00",
    end_time: "14:00",
    location: "Labadi Beach Hotel, Accra",
    capacity: 150,
  },
  {
    slug: "marriage-date-night",
    title: "Marriage Date Night — Rebuilding Connection",
    description:
      "An evening for couples: a candid talk on conflict and connection, followed by guided conversation and dinner. Childcare provided.",
    date: "2026-11-06",
    start_time: "17:30",
    end_time: "20:30",
    location: "The Potters House, Spintex Road",
    capacity: 60,
  },
  {
    slug: "faith-weekend-retreat",
    title: "Faith: A Weekend of Stillness",
    description:
      "A weekend retreat of silence, Scripture and worship for women carrying heavy loads. Transport and lodging arranged.",
    date: "2026-12-04",
    start_time: "16:00",
    end_time: "2026-12-06",
    location: "Aburi Gardens Lodge",
    capacity: 40,
  },
  {
    slug: "career-cv-workshop",
    title: "CV & LinkedIn Clinic",
    description:
      "Bring your CV and your laptop. Review sessions, professional headshots and LinkedIn coaching in small groups.",
    date: "2026-09-26",
    start_time: "10:00",
    end_time: "13:00",
    location: "EPLM House, Cantonments",
    capacity: 30,
  },
];

export function upcomingEvents() {
  const today = new Date();
  return events
    .filter((e) => new Date(`${e.date}T23:59:59`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function pastEvents() {
  const today = new Date();
  return events
    .filter((e) => new Date(`${e.date}T00:00:00`) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function formatEventDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? "am" : "pm";
  return `${hour12}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`;
}