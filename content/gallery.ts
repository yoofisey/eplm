import type { GalleryImage } from "@/lib/types";

const MINISTRY = "https://executivepurposefulladiesministry.org";

export const gallery: GalleryImage[] = [
  {
    alt: "Faith circle gathering at Aburi retreat",
    url: `${MINISTRY}/site/img/2025-05-22-120106_2023-04-27-142647DSC_0014.jpg`,
    program_tag: "Faith",
    order: 1,
  },
  {
    alt: "Weekend retreat worship session at Aburi",
    url: `${MINISTRY}/site/img/2025-05-28-165238_1.jpg`,
    program_tag: "Faith",
    order: 2,
  },
  {
    alt: "Marriage date night dinner",
    url: `${MINISTRY}/site/img/2025-05-22-120257_2022-10-21-0939352019-07-19-1318217.jpg`,
    event_id: "marriage-date-night",
    program_tag: "Marriage",
    order: 3,
  },
  {
    alt: "Couples circle at community centre",
    url: `${MINISTRY}/site/img/gallery/2025-05-28-165239_5.jpg`,
    program_tag: "Marriage",
    order: 4,
  },
  {
    alt: "Career summit panel discussion",
    url: `${MINISTRY}/site/img/gallery/2025-05-28-165459_10.jpg`,
    event_id: "womens-career-summit-2026",
    program_tag: "Career",
    order: 5,
  },
  {
    alt: "Women practising public speaking in workshop",
    url: `${MINISTRY}/site/img/gallery/2025-05-28-165459_11.jpg`,
    program_tag: "Career",
    order: 6,
  },
  {
    alt: "Faith circle studying together in a home",
    url: `${MINISTRY}/site/img/2025-05-26-135844_2023-04-27-140803WhatsApp_Image_2023-04-25_at_7.43.40_PM_-_Copy.jpeg`,
    program_tag: "Faith",
    order: 7,
  },
  {
    alt: "Networking lunch after career summit",
    url: `${MINISTRY}/site/img/gallery/2025-05-28-165459_11.jpg`,
    event_id: "womens-career-summit-2026",
    program_tag: "Career",
    order: 8,
  },
];

export function galleryTags() {
  return ["All", "Faith", "Marriage", "Career"];
}
