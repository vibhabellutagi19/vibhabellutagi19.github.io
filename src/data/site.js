export const experienceData = [
  {
    title: "Data Engineer - Platform",
    date: "July 2025 - Present",
    company: "Mews, France",
    track: "data",
    description:
      "Redesigned platform architecture to adopt configuration-driven, Infrastructure-as-Code patterns using Terraform, standardizing SQL Warehouse management and access controls to eliminate configuration drift and enable declarative, low-risk permission changes on Databricks. Optimized critical data pipelines, slashing runtime from 10+ hours to 2 hours while reducing compute costs (DBUs) by 60-75%.",
    skills: ["Databricks", "Python", "SQL", "Terraform"],
  },
  {
    title: "Backend Engineer",
    date: "May 2025 - Present",
    company: "LezzCo",
    track: "backend",
    description:
      "Designed and implemented backend for LLM-based chatbot that powers product conversations. Integrated Shopify context so customers can ask about products and get relevant responses. Enabled WhatsApp-based customer chat via Twilio webhooks with secure request validation. Built the API proxy and backend flows for authentication, chat routing, and metrics tracking.",
    skills: ["AWS Cloud", "Python", "FastAPI", "AWS Bedrock"],
  },
  {
    title: "Data Engineer",
    date: "May 2025 - July 2025",
    company: "CyberSecurity Client",
    track: "data",
    description:
      "Architected cloud-native data pipeline integrating four disparate systems (Runn.io, ConnectWise, QuickBooks, Hubspot) using Cloud Functions and BigQuery with near real-time synchronization. Designed unified data models powering Looker dashboards that accelerated decision-making across business functions.",
    skills: ["Google Cloud Functions", "BigQuery", "Python", "API Integration"],
  },
  {
    title: "Data Engineer",
    date: "2021 - 2024",
    company: "AgileLab, France",
    track: "data",
    description:
      "Spearheaded cross-functional collaboration with data engineers and scientists to deploy advanced NLP models on AWS cloud, cutting deployment time by 50%. Developed real-time data pipelines using FlinkSQL and Kafka CDC to process hundreds of GBs of customer data, reducing profile update times by 75-80%. Ensured GDPR compliance through precise anonymization rules with Livy, Spark, and Presto, achieving sub-3-second query performance while maintaining enterprise-grade data security.",
    skills: ["Apache Spark", "FlinkSQL", "Kafka", "Presto", "AWS"],
  },
  {
    title: "Big Data Engineer",
    date: "2018 - 2021",
    company: "Deloitte, Bangalore",
    track: "data",
    description:
      "Building and optimizing large-scale ETL infrastructure using Hadoop, Spark, and Hive. Created automated orchestration frameworks and comprehensive logging systems, achieving 40% efficiency gains in workflows and issue resolution while processing 30GB+ of data daily to drive business intelligence.",
    skills: [
      "Hadoop",
      "Apache Spark",
      "Hive",
      "ETL",
      "Python",
      "Scala",
      "Workflow Orchestration",
    ],
  },
];

/** Personal side projects — add entries here when ready (section + nav appear automatically) */
export const projectsData = [];

/*
Example — sql-step-viz:
{
  slug: "sql-step-viz",
  name: "sql-step-viz",
  track: "fullstack",
  status: "wip",
  description: "Step-by-step SQL query visualizer — debug queries like a DSA algorithm visualizer.",
  highlights: [
    "Visualize execution flow: scan → filter → join → group → project",
    "Inspect row counts and sample rows after each logical step",
  ],
  stack: ["TypeScript", "React", "SQL", "Node.js"],
  href: "https://github.com/vibhabellutagi19/sql-step-viz",
},
*/

export const highlightMetrics = [
  { label: "pipeline runtime", value: "10h → 2h", source: "Mews · Databricks" },
  {
    label: "compute cost (DBUs)",
    value: "↓ 60–75%",
    source: "Mews · platform",
  },
  {
    label: "profile update latency",
    value: "↓ 75–80%",
    source: "AgileLab · Flink/Kafka",
  },
  {
    label: "query performance",
    value: "< 3s p99",
    source: "AgileLab · Spark/Presto",
  },
  {
    label: "LLM chat backend",
    value: "FastAPI",
    source: "LezzCo · backend",
  },
  {
    label: "WhatsApp integration",
    value: "Twilio webhooks",
    source: "LezzCo · API",
  },
  { label: "daily data processed", value: "30GB+", source: "Deloitte · ETL" },
  {
    label: "workflow efficiency",
    value: "↑ 40%",
    source: "Deloitte · orchestration",
  },
];

export const aboutData = {
  paragraphs: [
    "I am a data and software engineer with experience building production data platforms, backend systems, and cloud-native pipelines.",
    "This site is a record of the work I have done and the technical topics I write about — data engineering, backend APIs, platform design, and the systems behind them.",
  ],
  highlights: [
    "Data platform architecture and reliability",
    "Production data pipelines and lakehouse workflows",
    "Backend systems with Python and cloud services",
    "Performance, cost, and observability in data systems",
  ],
};
