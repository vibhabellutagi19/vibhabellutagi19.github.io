export const profile = {
  name: "Vibhavari Bellutagi",
  role: "Freelance Full-Stack Developer",
  whatsapp: "+91 97423 52994",
  whatsappUrl: `https://wa.me/919742352994?text=${encodeURIComponent(
    "Hi Vibhavari, I'd like to discuss a project."
  )}`,
  photo: "/me/vibsii.jpg",
  // Square, lightly sharpened crop of /me/vibhavari_bellutagi.jpg for the blog byline and author card.
  avatar: "/me/vibhavari_bellutagi-avatar.jpg",
  email: "vibhavari.bellutagi@gmail.com",
  bookingUrl: "https://calendly.com/vibhavari-bellutagi/discovery-call",
  github: "https://github.com/vibhabellutagi19",
  linkedin: "https://www.linkedin.com/in/vibhavari-bellutagi/",
  linkedinRecommendations: "https://www.linkedin.com/in/vibhavari-bellutagi/details/recommendations/",
  recommendationCount: 6,
};

/**
 * GoatCounter. Set this to your site code (the "mycode" in
 * mycode.goatcounter.com); tracking and view counts stay off while it is empty.
 */
export const analytics = {
  goatcounterCode: "vibhavaribellutagi",
};

/**
 * Likes API: the Cloudflare Worker in /worker. Paste its URL once deployed,
 * e.g. "https://blog-likes.<you>.workers.dev"; the like button stays hidden while empty.
 */
export const likes = {
  apiUrl: "https://blog-likes.vibhavari-bellutagi.workers.dev",
};

export const heroData = {
  eyebrow: "Build with Vibs · available for projects",
  title: "Ideas into impact.",
  lede: "I build web apps, platforms and AI features that help ambitious businesses turn ideas into products people use every day. From your first concept to a live product with paying users, ten years of engineering, seven of them building data platforms, means what I ship stays fast, reliable and affordable as you grow.",
  stats: [
    { value: "10+", label: "years in software" },
    { value: "2", label: "products live in production" },
    { value: "50+", label: "active users on Move" },
  ],
};

/**
 * Featured products. `image` is optional: leave it out and the card shows a
 * placeholder frame. Put screenshots in public/work/ and reference them as
 * "/work/<file>.png".
 */
export const caseStudies = [
  {
    slug: "nimmavasati",
    name: "NimmaVasati",
    kind: "PG & hostel management platform",
    href: "https://nimmavasati.in/",
    summary:
      "PG owners were running beds, rent and dues on paper and spreadsheets. I built them a single place to run every property, first for one client and now as a product open to other operators.",
    features: [
      "Multi-property dashboard: occupancy, rent collected, dues, net income",
      "Floor, room and bed layout with tenant assignment and vacancies",
      "Rent ledger with automatic paid, partial and overdue status, plus numbered PDF invoices",
      "Expenses, monthly reports and role-based staff access",
    ],
    outcome: "Live product, open to PG and hostel owners",
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Clerk", "Railway"],
  },
  {
    slug: "move",
    name: "Move · The Movement Clan",
    kind: "Gym & studio management system",
    href: "https://movethemovementclan.in/",
    summary:
      "A Bengaluru training studio needed one system for members, coaches and staff. I built the full platform, from the database to three separate portals, with online payments.",
    features: [
      "Class scheduling, bookings, session credits and packages",
      "Attendance tracking and coach schedules",
      "Invoicing and online payments via Razorpay",
      "Separate admin, staff and client portals, plus finance reports",
    ],
    outcome: "50+ active users · 400–500 visitors on the landing page",
    stack: ["TypeScript", "Next.js", "tRPC", "PostgreSQL", "Razorpay", "AWS"],
  },
];

/**
 * Testimonials. LinkedIn quotes are trimmed excerpts of recommendations on
 * the profile, wording unchanged; `highlight` is a phrase lifted from the
 * quote. Entries without a quote are skipped; fill in quote, highlight and
 * name on the client entries as feedback arrives.
 */
export const testimonialsData = [
  {
    quote:
      "She also played a key role in shaping and delivering the Data Platform team’s infrastructure-as-code vision, taking it from idea to end-to-end implementation and bringing strong engineering practices along the way. Just as importantly, Vibha has a real sense of ownership. She follows through, keeps herself accountable, and does not need to be pushed to deliver high-quality work.",
    highlight: "A real sense of ownership.",
    name: "Elliot Ip",
    role: "Senior Data Engineer",
    company: "Mews",
    source: "LinkedIn",
  },
  {
    quote:
      "From the very beginning, she impressed me with her deep technical expertise and her ability to work across multiple areas of a project—ranging from backend development to CI/CD pipelines and code testing. … Vibhavari is highly autonomous, proactive, and has a remarkable long-term vision that helps shape solid roadmaps and drive high-quality results.",
    highlight: "Highly autonomous, proactive.",
    name: "Vincenzo Pafundi",
    role: "Machine Learning Engineer",
    company: "AXA Italia",
    source: "LinkedIn",
  },
  {
    quote:
      "In just a few weeks, she mastered the technical skills to work independently and soon took full ownership of entire projects. She demonstrated strong problem-solving skills and deep technical knowledge.",
    highlight: "Took full ownership of entire projects.",
    name: "Marco Vagaggini",
    role: "Senior Software Engineer",
    company: "QuestIT",
    source: "LinkedIn",
  },
  {
    quote:
      "…she brought several ML projects to production on the AWS platform using services like Sagemaker, Lambda functions, and Spark/EMR. She always showcased a positive attitude, working cleanly and precisely.",
    highlight: "Brought several ML projects to production.",
    name: "Paolo Cristofanelli",
    role: "ML & Data Platform Engineer",
    company: "Cleo",
    source: "LinkedIn",
  },
  {
    quote: "",
    name: "",
    role: "PG owner",
    company: "NimmaVasati",
  },
  {
    quote: "",
    name: "",
    role: "Studio owner",
    company: "Move · The Movement Clan",
  },
];

export const servicesData = [
  {
    title: "Web apps and SaaS products",
    body: "Customer-facing apps, platforms and dashboards, designed, built and launched end to end, whatever the industry.",
  },
  {
    title: "MVPs for startups",
    body: "Your idea in front of real users quickly, on a clean, type-safe codebase your future team can take over.",
  },
  {
    title: "Business and internal tools",
    body: "Bookings, billing, operations or anything your team still does by hand, turned into software that fits how you work.",
  },
  {
    title: "APIs, integrations and AI features",
    body: "Payments, third-party APIs, LLM-powered features and data pipelines, wired cleanly into the rest of your product.",
  },
];

export const processData = [
  {
    title: "Discovery call",
    body: "A free call to understand your business, what is slowing you down and what success looks like.",
  },
  {
    title: "Timeline and budget",
    body: "We agree on what the first version includes, how long it will take and a budget that works for you.",
  },
  {
    title: "Build with weekly demos",
    body: "You see working software every week and steer as we go, instead of waiting months for a big reveal.",
  },
  {
    title: "Launch and support",
    body: "I deploy it, set up backups and monitoring, train your team and stay on for fixes and new features.",
  },
];

export const aboutData = {
  paragraphs: [
    "I am a software engineer with 10+ years in IT. I started as a Java developer, then spent seven years building data platforms (Spark, Kafka, Databricks, Terraform) at Deloitte, AgileLab and Mews.",
    "Since January 2026 I work as a freelance full-stack developer, building products end to end, from data model to API to UI. That data background shapes how I build: products that stay fast, reliable and affordable as they grow.",
  ],
};

export const experienceData = [
  {
    title: "Data Engineer - Platform",
    date: "July 2025 - Aug 2026",
    company: "Mews, France",
    description:
      "Redesigned platform architecture around configuration-driven Infrastructure-as-Code with Terraform on Databricks. Built a batch CDC pipeline moving ~100GB from Postgres into Databricks. Cut critical pipeline runtime from 10+ hours to 2 hours and compute costs by 60–75%.",
    skills: ["Databricks", "Python", "SQL", "Terraform", "Postgres CDC"],
  },
  {
    title: "Data Engineer",
    date: "2021 - 2024",
    company: "AgileLab, France",
    description:
      "Deployed NLP models on AWS with data scientists, cutting deployment time by 50%. Built real-time pipelines with FlinkSQL and Kafka CDC, reducing profile update times by 75–80%. Delivered GDPR-compliant anonymization with sub-3-second query performance.",
    skills: ["Apache Spark", "FlinkSQL", "Kafka", "Presto", "AWS"],
  },
  {
    title: "Big Data Engineer",
    date: "2018 - 2021",
    company: "Deloitte, Bangalore",
    description:
      "Built and optimized large-scale ETL on Hadoop, Spark and Hive, processing 30GB+ daily. Created orchestration and logging frameworks that improved workflow efficiency by 40%.",
    skills: ["Hadoop", "Apache Spark", "Hive", "Python", "Scala"],
  },
];

/** Smaller freelance engagements, listed under the background section. */
export const otherWorkData = [
  {
    title: "LLM chatbot backend",
    company: "B2B e-commerce client",
    description:
      "Backend for an LLM-powered product chatbot with Shopify context and WhatsApp chat via Twilio webhooks, including authentication, chat routing and metrics.",
    skills: ["Python", "FastAPI", "AWS Bedrock"],
  },
  {
    title: "Business data integration",
    company: "Cybersecurity client",
    description:
      "Near real-time pipeline unifying Runn.io, ConnectWise, QuickBooks and HubSpot into BigQuery, powering Looker dashboards across the business.",
    skills: ["Python", "Cloud Functions", "BigQuery"],
  },
];
