export const profile = {
  name: "Vibhavari Bellutagi",
  role: "Data and Backend Engineer",
  photo: "/me/vibhavari_bellutagi.jpg",
  // Square, lightly sharpened crop of the photo above, for the hero, the blog byline and the author card.
  avatar: "/me/vibhavari_bellutagi-avatar.jpg",
  email: "vibhavari.bellutagi@gmail.com",
  // Drop the PDF at public/resume.pdf. Until it exists, the résumé buttons fall back to LinkedIn.
  resume: "/Vibhavari_Bellutagi_DE.pdf",
  github: "https://github.com/vibhabellutagi19",
  linkedin: "https://www.linkedin.com/in/vibhavari-bellutagi/",
  linkedinRecommendations:
    "https://www.linkedin.com/in/vibhavari-bellutagi/details/recommendations/",
  recommendationCount: 6,
};

/** Where the résumé buttons go: the PDF once it exists, LinkedIn until then. */
export const resumeLink = profile.resume
  ? { href: profile.resume, label: "Download résumé", external: false }
  : { href: profile.linkedin, label: "Résumé on LinkedIn", external: true };

/**
 * Likes API: the Cloudflare Worker in /worker. Paste its URL once deployed,
 * e.g. "https://blog-likes.<you>.workers.dev"; the like button stays hidden while empty.
 */
export const likes = {
  apiUrl: "https://blog-likes.vibhavari-bellutagi.workers.dev",
};

export const heroData = {
  status: "Open to senior data engineering and backend roles",
  lede: "Software engineer, 10+ years. Seven of them on data platforms at Deloitte, AgileLab and Mews, and now more and more on the backend. The hard parts get written down here.",
};

export const aboutData = {
  bio: "Software engineer, 10+ years. Seven of them spent on data platforms (Spark, Kafka, Databricks, AWS Cloud) at Deloitte, AgileLab and Mews. Alongside that, I build the backends of my own products: APIs, auth and payments. That's the direction I'm growing in.",
};

/**
 * Posts shown on the home page, in this order (slugs). Chosen to match what I'm hired for:
 * backend first, then data. A slug that doesn't match a post fails the build.
 */
export const pinnedPosts = [
  "prevent-double-booking-postgres",
  "better-auth-logged-out-while-active",
  "spark-job-anatomy",
  "automate-unit-tests-using-ci-cd",
  "inside-git",
];

export const previousCompanies = [
  { name: "Mews", url: "https://www.mews.com" },
  { name: "AgileLab", url: "https://www.agilelab.it" },
  { name: "Deloitte", url: "https://www.deloitte.com/ui/en/about.html" },
];

/**
 * The two scrolling rows under the hero: data platforms first (day job), then backend (own products).
 * `icon` is a file in public/skills/ (brand logos from Simple Icons, CC0; the rest are plain glyphs).
 * `color` is what the icon turns on hover.
 */
export const skillRows = [
  [
    { name: "AWS", icon: "cloud", color: "#FF9900" },
    { name: "Databricks", icon: "databricks", color: "#FF3621" },
    { name: "Apache Spark", icon: "apachespark", color: "#E25A1C" },
    { name: "Kafka", icon: "apachekafka", color: "#F5F5F5" },
    { name: "FlinkSQL", icon: "apacheflink", color: "#E6526F" },
    { name: "Terraform", icon: "terraform", color: "#844FBA" },
    { name: "CDC", icon: "arrows", color: "#34D399" },
    { name: "SQL", icon: "database", color: "#38BDF8" },
  ],
  [
    { name: "Python", icon: "python", color: "#FFD43B" },
    { name: "FastAPI", icon: "fastapi", color: "#05C3A8" },
    { name: "TypeScript", icon: "typescript", color: "#3178C6" },
    { name: "tRPC", icon: "trpc", color: "#398CCB" },
    { name: "Better Auth", icon: "lock", color: "#A78BFA" },
    { name: "REST APIs", icon: "braces", color: "#22C55E" },
    { name: "Docker", icon: "docker", color: "#2496ED" },
    { name: "Microservices", icon: "network", color: "#60A5FA" },
    { name: "Agentic AI", icon: "sparkles", color: "#F472B6" },
  ],
];

export const experienceData = [
  {
    id: "mews",
    title: "Data Engineer, Platform",
    company: "Mews",
    date: "Jul 2025 – Aug 2026",
    short: "2025 – 26",
    place: "France",
    points: [
      "Redesigned the platform architecture around configuration-driven infrastructure-as-code with Terraform on Databricks.",
      "Built a batch CDC pipeline moving ~100GB from Postgres into Databricks.",
      "Cut critical pipeline runtime from 10+ hours to 2 hours and compute costs by 60–75%.",
    ],
    skills: ["Databricks", "Terraform", "Python", "SQL", "Postgres CDC"],
  },
  {
    id: "agilelab",
    title: "Data Engineer",
    company: "AgileLab",
    date: "2021 – 2024",
    short: "2021 – 24",
    place: "France",
    points: [
      "Built real-time pipelines with FlinkSQL and Kafka CDC, reducing profile update times by 75–80%.",
      "Deployed NLP models on AWS with data scientists, cutting deployment time by 50%.",
      "Delivered GDPR-compliant anonymization with sub-3-second query performance.",
    ],
    skills: ["Apache Spark", "FlinkSQL", "Kafka", "Presto", "AWS"],
  },
  {
    id: "deloitte",
    title: "Big Data Engineer",
    company: "Deloitte",
    date: "2018 – 2021",
    short: "2018 – 21",
    place: "Bengaluru",
    points: [
      "Built and optimized large-scale ETL on Hadoop, Spark and Hive, processing 30GB+ daily.",
      "Created orchestration and logging frameworks that improved workflow efficiency by 40%.",
    ],
    skills: ["Hadoop", "Apache Spark", "Hive", "Python", "Scala"],
  },
];

/**
 * Side projects, deliberately unnamed and unlinked. `mock` is the one-line terminal snippet on the card;
 * `post` links the write-up of the hardest part (the whole card links there).
 */
export const sideProjects = [
  {
    name: "Gym & studio management",
    blurb:
      "Class scheduling, session credits, invoicing and payments, with admin, coach and member portals.",
    mock: "SELECT … FOR UPDATE  -- two members, one spot left",
    post: {
      label: "How Postgres row locks prevent double bookings",
      href: "/blog/prevent-double-booking-postgres/",
    },
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Better Auth"],
  },
  {
    name: "PG & hostel management",
    blurb:
      "Multi-property dashboard, floor-room-bed layouts, a rent ledger and PDF invoices.",
    mock: "paid · partial · overdue  -- payments arrive late or twice",
    post: null,
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Clerk"],
  },
];
