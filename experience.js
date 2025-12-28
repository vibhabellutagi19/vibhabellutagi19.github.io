// Experience data array
const experienceData = [
  {
    title: 'Data Engineer - Platform',
    date: 'July 2025 - Present',
    company: 'Mews, France',
    type: 'work',
    description:
      "Redesigned platform architecture to adopt <span class='highlight'>configuration-driven, Infrastructure-as-Code patterns</span> using Terraform, standardizing SQL Warehouse management and access controls to eliminate configuration drift and enable declarative, low-risk permission changes on Databricks. Optimized critical data pipelines, <span class='highlight'>slashing runtime from 10+ hours to 2 hours</span> while <span class='highlight'>reducing compute costs (DBUs) by 60-75%</span>",
    skills: ['Terraform', 'Databricks', 'SQL', 'Python'],
  },
  {
    title: 'Backend Engineer',
    date: 'May 2025 - Present',
    company: 'LezzCo',
    type: 'freelance',
    description:
      "Designed and implemented backend for <span class='highlight'>LLM-based chatbot</span> that powers product conversations. Integrated Shopify context so customers can ask about products and get relevant responses. Enabled WhatsApp-based customer chat via Twilio webhooks with secure request validation. Built the API proxy and backend flows for authentication, chat routing, and metrics tracking.",
    skills: ['AWS Cloud', 'Python', 'FastAPI', 'AWS Bedrock'],
  },
  {
    title: 'Data Engineer',
    date: 'May 2025 - July 2025',
    company: 'CyberSecurity Client',
    type: 'freelance',
    description:
      "Architected cloud-native data pipeline integrating four disparate systems (Runn.io, ConnectWise, QuickBooks, Hubspot) using Cloud Functions and BigQuery with <span class='highlight'>near real-time synchronization</span>. Designed unified data models powering Looker dashboards that <span class='highlight'>accelerated decision-making</span> across business functions.",
    skills: ['Google Cloud Functions', 'BigQuery', 'Python', 'API Integration'],
  },
  {
    title: 'Data Engineer',
    date: '2021 - 2024',
    company: 'AgileLab, France',
    type: 'work',
    description:
      "Spearheaded cross-functional collaboration with data engineers and scientists to deploy advanced NLP models on AWS cloud,<span class='highlight'>cutting deployment time by 50%</span>. Developed real-time data pipelines using FlinkSQL and Kafka CDC to process hundreds of GBs of customer data, <span class='highlight'>reducing profile update times by 75-80%</span>. Ensured GDPR compliance through precise anonymization rules with Livy, Spark, and Presto, achieving <span class='highlight'>sub-3-second query performance</span> while maintaining enterprise-grade data security.",
    skills: ['Apache Spark', 'FlinkSQL', 'Kafka', 'Presto', 'AWS'],
  },
  {
    title: 'Big Data Engineer',
    date: '2018 - 2021',
    company: 'Deloitte, Bangalore',
    type: 'work',
    description:
      "Building and optimizing large-scale ETL infrastructure using Hadoop, Spark, and Hive. Created automated orchestration frameworks and comprehensive logging systems, achieving <span class='highlight'>40% efficiency gains</span> in workflows and issue resolution while processing <span class='highlight'>30GB+ of data daily</span> to drive business intelligence.",
    skills: [
      'Hadoop',
      'Apache Spark',
      'Hive',
      'ETL',
      'Python',
      'Scala',
      'Workflow Orchestration',
    ],
  },
];

const proofData = [
  { label: 'Python', years: '5 yrs' },
  { label: 'Databricks', years: '1 yr' },
  { label: 'Apache Spark', years: '4 yrs' },
  { label: 'Cloud - AWS', years: '4 yrs' },
  { label: 'FastAPI', years: '2 yrs' },
  { label: 'GenAI', years: '0.5 yrs' },
];

function renderProofStrip() {
  const proofStrip = document.getElementById('proof-strip');
  if (!proofStrip) {
    return;
  }

  proofStrip.innerHTML = proofData
    .map(
      (item) => `
            <li>
              <span class="proof-years">${item.years}</span>
              <span class="proof-label">${item.label}</span>
            </li>
        `
    )
    .join('');
}

// Function to render experience items
function renderExperienceItems() {
  const freelanceGrid = document.getElementById('freelance-grid');
  const workGrid = document.getElementById('work-grid');
  if (!freelanceGrid || !workGrid) {
    return;
  }

  const renderCard = (exp, index) => {
    const skillsString = exp.skills ? exp.skills.join(', ') : '';
    return `
            <div class="experience-card blog-card" data-skills="${skillsString}" data-index="${index}">
                <div class="experience-header">
                    <h3 class="experience-title">${exp.title}</h3>
                    <span class="experience-date">${exp.date}</span>
                </div>
                <div class="experience-company">${exp.company}</div>
                <p class="experience-description">${exp.description}</p>
                ${
                  exp.skills
                    ? `
                    <div class="experience-skills">
                        <span class="skills-label">Skills: </span>
                        <span class="skills-text" data-skills="${skillsString}"></span>
                        <span class="typing-cursor">|</span>
                    </div>
                `
                    : ''
                }
            </div>
        `;
  };

  const freelanceItems = experienceData
    .filter((exp) => exp.type === 'freelance')
    .map((exp, index) => renderCard(exp, index))
    .join('');
  const workItems = experienceData
    .filter((exp) => exp.type === 'work')
    .map((exp, index) => renderCard(exp, index))
    .join('');

  freelanceGrid.innerHTML = freelanceItems;
  workGrid.innerHTML = workItems;

  // Initialize typing animations after rendering
  initializeTypingAnimations();
}

// Function to type out skills with animation
function typeSkills(element, skillsString, index) {
  const cursor = element.nextElementSibling;
  let i = 0;
  const typingSpeed = 50; // milliseconds per character
  const delayBeforeStart = index * 500; // stagger animations

  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (i < skillsString.length) {
        element.textContent = skillsString.substring(0, i + 1);
        i++;
      } else {
        clearInterval(typeInterval);
        // Keep cursor blinking
        if (cursor) {
          cursor.style.animation = 'blink 1s infinite';
        }
      }
    }, typingSpeed);
  }, delayBeforeStart);
}

// Function to initialize typing animations when items come into view
function initializeTypingAnimations() {
  const skillElements = document.querySelectorAll('.skills-text');

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
          const skillsString = entry.target.dataset.skills;
          const index = parseInt(
            entry.target.closest('.experience-card').dataset.index
          );
          entry.target.dataset.typed = 'true';
          typeSkills(entry.target, skillsString, index);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  skillElements.forEach((element) => {
    skillsObserver.observe(element);
  });
}
