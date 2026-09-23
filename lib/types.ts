export type Stat = {
  label: string;
  value: string;
  order: number;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  photo?: string;
  published: boolean;
};

export type Program = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  schedule: string;
  format: string;
  cta: string;
  audience: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  order: number;
};

export type Partner = {
  name: string;
  logo?: string;
  url?: string;
};

export type Event = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  start_time: string;
  end_time?: string;
  location: string;
  capacity: number;
  image?: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  cover?: string;
  publishedAt: string; // ISO date
  body: string[];
};

export type GalleryImage = {
  url?: string;
  alt: string;
  event_id?: string;
  program_tag?: string;
  order: number;
};

export type Value = {
  title: string;
  body: string;
};

export type DonationFrequency = "one-time" | "monthly" | "quarterly" | "annual";