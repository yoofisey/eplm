export const site = {
  name: "EPLM",
  longName: "Executive Purposeful Ladies Ministry",
  tagline: "Helping women live whole lives of faith, family and purpose.",
  mission:
    "We are changemakers fuelled by faith and determination — walking with the women of Ghana as they live, love and leave a legacy that matches the God-given potential within them.",
  vision:
    "To see a community of women working together to live, love and leave a legacy by achieving their God-given potential.",
  pillars: [
    {
      title: "Faith",
      body: "We follow the teachings of Jesus Christ and help women root leadership, work and worth in Scripture.",
    },
    {
      title: "Marriage",
      body: "We strengthen marriages so husbands love well and wives flourish — family built on grace, not grit.",
    },
    {
      title: "Career",
      body: "Christ gives men and women an equal share in dominion; we help women rise, prepare and lead at work.",
    },
  ],
  location: "Accra, Ghana",
  currency: "GHS",
  email: "info@executivepurposefulladiesministry.org",
  emails: {
    primary: "info@executivepurposefulladiesministry.org",
    secondary: "eplm2019@gmail.com",
  },
  phones: ["+233 209 211 239", "+233 505 624 331"],
  address: "Address 1, Accra, Ghana",
  socials: {
    instagram: "https://instagram.com/eplm",
    facebook: "https://facebook.com/eplm",
    youtube: "https://youtube.com/@eplm",
    linkedin: "https://linkedin.com/company/eplm",
  },
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=-0.2020%2C5.5570%2C-0.1520%2C5.5870&layer=mapnik&marker=5.5720%2C-0.1770",
  moMo: {
    number: "024 000 0000",
    name: "EPLM Ministry Account",
    provider: "MTN Mobile Money",
  },
  bank: {
    accountName: "EPLM",
    accountNumber: "0000000000000",
    bank: "GCB Bank",
    branch: "Accra",
  },
} as const;

export const nav = {
  links: [
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Give", href: "/give" },
  join: { label: "Become a Member", href: "/join" },
} as const;
