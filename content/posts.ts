import type { Post } from "@/lib/types";

export const posts: Post[] = [
  {
    slug: "why-women-need-circles-not-just-events",
    title: "Why women need circles, not just events",
    excerpt:
      "Events inspire you for a weekend. Circles change you over a year. Here's what we've learned from eight years of watching women show up for one another.",
    category: "Community",
    author: "Abra Kusi",
    publishedAt: "2026-08-12",
    body: [
      "A workshop can change your mind in an afternoon. It takes a circle to change your habits — and your heart. The difference is consistency and trust.",
      "In our faith circles, a woman doesn't have to perform well-being. She can say, \"I'm struggling with this verse, this season, this marriage.\" The group doesn't fix it in one evening. They carry it for months.",
      "If you're thirsty for change, don't look for the next big event. Look for the small, stubborn group of women who keep showing up — and then be one yourself.",
    ],
  },
  {
    slug: "five-ways-to-bring-your-whole-self-to-work",
    title: "Five practical ways to bring your whole self to work",
    excerpt:
      "Negotiation, boundaries, mentorship and rest — the toolkit our career programme keeps coming back to.",
    category: "Career",
    author: "Juliet Danso",
    publishedAt: "2026-07-02",
    body: [
      "1. Know your worth before you walk in. Practise your numbers out loud until they stop feeling like a favour.\n\n2. Protect a boundary — even a small one — every single week. Boundaries are practice, not rudeness.\n\n3. Find one mentor who is not your boss. Ask specific questions, not open-ended favours.\n\n4. Speak early in meetings. The first sentence is the hardest; every one after that is easier.\n\n5. Rest on purpose. A rested woman makes better decisions than a tired one who simply pushes harder.",
    ],
  },
  {
    slug: "what-our-marriage-circles-have-taught-us",
    title: "What eight years of marriage circles have taught us",
    excerpt:
      "Disagreements are normal. Disdain is the enemy. Reflections from the couples who keep showing up.",
    category: "Marriage",
    author: "EPLM Team",
    publishedAt: "2026-05-20",
    body: [
      "The couples who thrive are rarely the ones who agree about everything. They're the ones who have learned to disagree without treating each other as opponents.",
      "We teach a simple rhythm: pause before defending, repeat back what you heard, and assume goodwill. It sounds small. It has saved more marriages than any workshop topic we offer.",
      "And we've learned that marriage support works best in a group. Another couple on the journey normalises the struggle and multiplies the hope.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function recentPosts(count: number) {
  return [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, count);
}