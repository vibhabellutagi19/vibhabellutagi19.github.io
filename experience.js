// Experience data array
const experienceData = [
    {
        title: "Data Engineer - Platform",
        date: "July 2025 - Present",
        company: "Mews, France",
        description: "Redesigned platform architecture to adopt <span class='highlight'>configuration-driven, Infrastructure-as-Code patterns</span> using Terraform, standardizing SQL Warehouse management and access controls to eliminate configuration drift and enable declarative, low-risk permission changes on Databricks. Optimized critical data pipelines, <span class='highlight'>slashing runtime from 10+ hours to 2 hours</span> while <span class='highlight'>reducing compute costs (DBUs) by 60-75%</span>",
        skills: ["Terraform", "Databricks", "SQL", "Python"]
    },
    {
        title: "Data Engineer - Freelance",
        date: "May 2025 - July 2025",
        company: "CyberSecurity Client",
        description: "Architected cloud-native data pipeline integrating four disparate systems (Runn.io, ConnectWise, QuickBooks, Hubspot) using Cloud Functions and BigQuery with <span class='highlight'>near real-time synchronization</span>. Designed unified data models powering Looker dashboards that <span class='highlight'>accelerated decision-making</span> across business functions.",
        skills: ["Google Cloud Functions", "BigQuery", "Python", "API Integration"]
    },
    {
        title: "Data Engineer",
        date: "2021 - 2024",
        company: "AgileLab, France",
        description: "Spearheaded cross-functional collaboration with data engineers and scientists to deploy advanced NLP models on AWS cloud,<span class='highlight'>cutting deployment time by 50%</span>. Developed real-time data pipelines using FlinkSQL and Kafka CDC to process hundreds of GBs of customer data, <span class='highlight'>reducing profile update times by 75-80%</span>. Ensured GDPR compliance through precise anonymization rules with Livy, Spark, and Presto, achieving <span class='highlight'>sub-3-second query performance</span> while maintaining enterprise-grade data security.",
        skills: ["Apache Spark", "FlinkSQL", "Kafka", "Presto", "AWS"]
    },
    {
        title: "Big Data Engineer",
        date: "2018 - 2021",
        company: "Deloitte, Bangalore",
        description: "Building and optimizing large-scale ETL infrastructure using Hadoop, Spark, and Hive. Created automated orchestration frameworks and comprehensive logging systems, achieving <span class='highlight'>40% efficiency gains</span> in workflows and issue resolution while processing <span class='highlight'>30GB+ of data daily</span> to drive business intelligence.",
        skills: ["Hadoop", "Apache Spark", "Hive", "ETL", "Python", "Scala", "Workflow Orchestration"]
    }
];

// Function to render experience items
function renderExperienceItems() {
    const experienceGrid = document.getElementById('experience-grid');
    experienceGrid.innerHTML = experienceData.map((exp, index) => {
        const side = index % 2 === 0 ? 'left' : 'right';
        const skillsString = exp.skills ? exp.skills.join(', ') : '';
        return `
            <div class="experience-item experience-${side}" data-skills="${skillsString}" data-index="${index}">
                <div class="experience-content">
                    <div class="experience-header">
                        <h3 class="experience-title">${exp.title}</h3>
                        <span class="experience-date">${exp.date}</span>
                    </div>
                    <div class="experience-company">${exp.company}</div>
                    <p class="experience-description">${exp.description}</p>
                    ${exp.skills ? `
                        <div class="experience-skills">
                            <span class="skills-label">Skills: </span>
                            <span class="skills-text" data-skills="${skillsString}"></span>
                            <span class="typing-cursor">|</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Update timeline line height to match scrollable content
    updateTimelineHeight();
    
    // Initialize typing animations after rendering
    initializeTypingAnimations();
}

// Function to update timeline line height to match scrollable content
function updateTimelineHeight() {
    const experienceGrid = document.getElementById('experience-grid');
    
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
        // Remove existing timeline line if any
        const existingLine = experienceGrid.querySelector('.timeline-line');
        if (existingLine) {
            existingLine.remove();
        }
        
        // Create timeline line element
        const timelineElement = document.createElement('div');
        timelineElement.className = 'timeline-line';
        
        // Calculate the full height of scrollable content
        const scrollHeight = experienceGrid.scrollHeight;
        timelineElement.style.height = `${scrollHeight}px`;
        
        // Insert at the beginning so it's behind other content
        experienceGrid.insertBefore(timelineElement, experienceGrid.firstChild);
        
        // Update on window resize
        window.addEventListener('resize', () => {
            timelineElement.style.height = `${experienceGrid.scrollHeight}px`;
        });
    });
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
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.typed) {
                const skillsString = entry.target.dataset.skills;
                const index = parseInt(entry.target.closest('.experience-item').dataset.index);
                entry.target.dataset.typed = 'true';
                typeSkills(entry.target, skillsString, index);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillElements.forEach(element => {
        skillsObserver.observe(element);
    });
}

