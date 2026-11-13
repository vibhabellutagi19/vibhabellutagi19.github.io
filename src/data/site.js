export const profile = {
  name: "Vibhavari Bellutagi",
  role: "Data & Full-Stack Engineer",
  photo: "/me/vibsii.jpg",
  // Square, lightly sharpened crop of /me/vibhavari_bellutagi.jpg for the blog byline and author card.
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
  status: "Open to senior data & full-stack roles",
  lede: "Software engineer, 10+ years. Seven of them spent on data platforms (Spark, Kafka, Databricks, Terraform) at Deloitte, AgileLab and Mews. On the side, I build full-stack products end to end, from the data model to the UI.",
};

/** The terminal card in the hero. Every number comes from the experience entries below. */
export const impactData = [
  { what: "pipeline runtime", value: "10h+ → 2h" },
  { what: "compute cost", value: "−60–75%" },
  { what: "model deploy time", value: "−50%" },
  { what: "profile update latency", value: "−75–80%" },
  { what: "workflow efficiency", value: "+40%" },
];

export const previousCompanies = ["Mews", "AgileLab", "Deloitte"];

export const pillarsData = [
  {
    title: "Data platforms",
    body: "Batch and streaming pipelines, CDC, lakehouse architecture and the infrastructure-as-code that keeps it all reproducible and cheap to run.",
    tools: ["Databricks", "Spark", "Kafka", "FlinkSQL", "Terraform"],
  },
  {
    title: "Backend & APIs",
    body: "Type-safe APIs, auth and payments, built on Postgres schemas designed to hold up under real concurrency.",
    tools: ["Python", "FastAPI", "TypeScript", "tRPC", "PostgreSQL"],
  },
  {
    title: "Product engineering",
    body: "Full products, from data model to UI to deployment, with monitoring, backups and the boring parts done properly.",
    tools: ["Next.js", "React", "AWS", "GCP", "Railway"],
  },
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
 * LinkedIn recommendations, trimmed excerpts with the wording unchanged.
 * The first one is shown large; the rest sit beside it.
 */
export const testimonialsData = [
  {
    quote:
      "A real sense of ownership. She follows through, keeps herself accountable, and does not need to be pushed to deliver high-quality work.",
    name: "Elliot Ip",
    role: "Senior Data Engineer, Mews",
  },
  {
    quote:
      "Highly autonomous, proactive, and has a remarkable long-term vision.",
    name: "Vincenzo Pafundi",
    role: "Machine Learning Engineer, AXA Italia",
  },
  {
    quote:
      "In just a few weeks, she mastered the technical skills to work independently and soon took full ownership of entire projects.",
    name: "Marco Vagaggini",
    role: "Senior Software Engineer, QuestIT",
  },
  {
    quote: "She brought several ML projects to production on the AWS platform.",
    name: "Paolo Cristofanelli",
    role: "ML & Data Platform Engineer, Cleo",
  },
];

/**
 * Side projects, deliberately unnamed and unlinked. `demo` picks the
 * animated preview; `post` links the write-up of the hardest part.
 */
export const sideProjects = [
  {
    demo: "gym",
    name: "Gym & studio management platform",
    summary:
      "Class scheduling with session credits, attendance, invoicing and online payments, with separate admin, coach and member portals.",
    hardPart: "Two members, one spot left.",
    post: {
      label: "How Postgres row locks prevent double bookings",
      href: "/blog/prevent-double-booking-postgres/",
    },
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Better Auth"],
  },
  {
    demo: "pg",
    name: "PG & hostel management platform",
    summary:
      "Multi-property dashboard, floor-room-bed layouts, a rent ledger that tracks paid, partial and overdue automatically, PDF invoices and role-based staff access.",
    hardPart:
      "Keeping a rent ledger correct when payments arrive partial, late or twice.",
    post: null,
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Clerk"],
  },
];
