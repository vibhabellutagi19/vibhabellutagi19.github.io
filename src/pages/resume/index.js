import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const ContactInfo = () => (
  <div className={styles.header}>
    <h1>Vibhavari Bellutagi</h1>
    <p className={styles.contactInfo}>
      Email id: vibhavari.bellutagi@gmail.com | Mobile: +33 752209047 | <a href="https://www.linkedin.com/in/vibhavari-bellutagi-837871189/">LinkedIn</a>
    </p>
  </div>
);

const Summary = () => (
  <div className={styles.summary}>
    <h2>Summary</h2>
    <p>
      Experienced data engineer with a proven track record of over 8+ years in the IT industry, specializing in designing and maintaining scalable Big Data pipelines and automation accelerators to meet complex data processing needs. Dedicated to innovation and efficiency, consistently seeking new challenges in data processing and automation.
    </p>
  </div>
);

const Skills = () => (
  <div className={styles.skills}>
    <h2>Skills</h2>
    <table className={styles.skillsTable}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Skills</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Big Data Technologies</td>
          <td>Hadoop, Spark, Hive, Presto</td>
        </tr>
        <tr>
          <td>Programming Languages</td>
          <td>Python, Scala (with Spark)</td>
        </tr>
        <tr>
          <td>Data Collection Systems</td>
          <td>Kafka</td>
        </tr>
        <tr>
          <td>Data Warehouse</td>
          <td>Postgres, Redshift</td>
        </tr>
        <tr>
          <td>Cloud</td>
          <td>AWS</td>
        </tr>
        <tr>
          <td>IaaC</td>
          <td>Terraform</td>
        </tr>
        <tr>
          <td>CI/CD</td>
          <td>Jenkins</td>
        </tr>
        <tr>
          <td>API Development</td>
          <td>FastAPI (REST APIs)</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Education = () => (
  <div className={styles.education}>
    <h2>Education</h2>
    <p>Bachelor of Engineering - ABC College of Engineering</p>
  </div>
);

const Certifications = () => (
  <div className={styles.certifications}>
    <h2>Certifications</h2>
    <ul>
      <li>Databricks Data Engineer Associate Certification | Databricks | June 2024</li>
      <li>AWS Data Analytics - Specialty | AWS | Dec 2023</li>
    </ul>
  </div>
);

const Experience = () => (
  <div className={styles.experience}>
    <h2>Professional Experience</h2>
    {jobs.map((job, index) => (
      <div key={index} className={styles.job}>
        <h3>{job.title} - {job.company}</h3>
        <p className={styles.jobDuration}>{job.duration}</p>
        <ul>
          {job.responsibilities.map((responsibility, i) => (
            <li key={i}>{responsibility}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const jobs = [
  {
    title: 'Data Engineer',
    company: 'XYZ',
    duration: "Sep '21 - Present, France",
    responsibilities: [
      'Collaborated with a team of 6 data scientists & engineers to deploy cutting-edge Machine Learning Models for production environments, resulting in a 50% reduction in deployment time.',
      'Streamlined ETL pipelines to enhance data quality for ML models, slashing data processing time by 60% using Apache Spark and AWS Analytics services.',
      'Designed and implemented a comprehensive data pipeline using FlinkSQL & Kafka CDC connector, reducing update times for customer profiles by 75-80%.',
      'Achieved 2-3 second query execution times while ensuring GDPR compliance through precise anonymisation rules with Livy, Spark, and Presto.',
      'Spearheaded knowledge transfer sessions and developed a team Wikipedia on Confluence, improving onboarding efficiency by 75%.'
    ]
  },
  {
    title: 'Data Engineer',
    company: 'Company 2',
    duration: "Sep '18 - Aug '21, India",
    responsibilities: [
      'Led the development & execution of a robust ETL pipeline utilizing Hadoop & Spark to process over 30GBs of data daily, improving data-driven decision-making by 30% for cross-departmental teams.',
      'Created reusable orchestration workflows for end-to-end pipelines using UC4 automation tool, reducing workflow duplication by 40%.',
      'Enhanced ETL pipeline auditing efficiency by deploying comprehensive audit data logging, decreasing issue detection and resolution time by 40%.'
    ]
  },
  {
    title: 'Software Engineer',
    company: 'Company 1',
    duration: "Jul '17 - Sep '18, India",
    responsibilities: [
      'Strategised solutions for analysing ~100k credit card transactions during POC using tools like Hive, Sqoop, and HDFS.',
      'Implemented optimisation techniques such as partitioning, bucketing, and compression to automate Hive external table creation, saving 20% time.'
    ]
  },
  {
    title: 'Systems Engineer',
    company: 'Company',
    duration: "Sep '15 - Jun '17, India",
    responsibilities: [
      'Involved in all phases of SDLC for a mid-sized application, focusing on requirement gathering, development, testing, and deployment using Java with Spring and Hibernate frameworks.',
      'Proactively identified and addressed application vulnerabilities, ensuring continuous enhancement and optimal performance.'
    ]
  }
];

const NewResumePage = () => {
  return (
    <Layout title="Resume" description="Resume of Vibhavari Bellutagi">
      <div className={styles.resumeContainer}>
        <ContactInfo />
        <Summary />
        <div className={styles.contentColumns}>
          <div className={styles.leftColumn}>
            <Skills />
            <Education />
            <Certifications />
          </div>
          <div className={styles.rightColumn}>
            <Experience />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewResumePage;
