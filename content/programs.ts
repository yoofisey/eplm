import type { Program } from "@/lib/types";

export const programs: Program[] = [
  {
    slug: "faith",
    name: "Faith",
    tagline: "Faith circles for women growing rooted in their faith.",
    description:
      "Small, consistent circles where women practice prayer, Scripture and spiritual friendship together. Our faith circles meet weekly in homes across Accra, with a simple rhythm of study, sharing and accountability.",
    schedule: "Weekly",
    format: "In-person circles of 6–10 women, plus occasional retreats",
    cta: "Join a circle",
    audience: "Women seeking consistent spiritual community",
  },
  {
    slug: "marriage",
    name: "Marriage",
    tagline: "Strengthening marriages with practical help and honest community.",
    description:
      "Sessions and couples circles that address real issues — communication, finances, conflict, intimacy — with the candour only a trusted community can offer. We walk with couples before, during and after the vows.",
    schedule: "Fortnightly",
    format: "Couples circles and one-off workshops",
    cta: "Book a session",
    audience: "Engaged, newlywed and long-married couples",
  },
  {
    slug: "career",
    name: "Career",
    tagline: "Skill-building and mentorship for women at every stage of work.",
    description:
      "From first jobs to leadership, we connect women with mentors, workshops and practical skill-building — CV reviews, negotiation, public speaking and workplace navigation — so no woman rises alone.",
    schedule: "Monthly",
    format: "Workshops, mentorship pairing and coaching",
    cta: "Find a mentor",
    audience: "Students, job-seekers, professionals and returners",
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}