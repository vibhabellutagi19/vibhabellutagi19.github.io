import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import { FaLinkedin } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { BsEnvelopeAtFill } from "react-icons/bs";
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const ContactInfo = () => (
  <div className={styles.header}>
    <h1>Vibhavari Bellutagi</h1>
    <p className={styles.ContactInfo}>
      <BsEnvelopeAtFill /> vibhavari.bellutagi@gmail.com | <FaPhone /> +33 752209047 |
      <a href="https://www.linkedin.com/in/vibhavari-bellutagi-837871189/" target="_blank" rel="noopener noreferrer" ><FaLinkedin/> vibhavari-bellutagi</a>
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
    <h2>My Journey</h2>
    <div className={styles.timeline}>
      {jobs.map((job, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineYear}>
            <div className={styles.yearContainer}>
              <FaCalendarAlt className={styles.yearIcon} />
              <span>{job.year}</span>
            </div>
            <div className={styles.locationContainer}>
              <FaMapMarkerAlt className={styles.locationIcon} />
              <span>{job.Location}</span>
            </div>
          </div>
          <div className={styles.timelineContent}>
            <h3>{job.title} - {job.company}</h3>
            <ul>
              {job.responsibilities.map((responsibility, i) => (
                <li key={i}>{responsibility}</li>
              ))}
            </ul>
            {job.skills && (
              <p className={styles.highlightedSkills}>
                <strong>Skills:</strong> {job.skills.join(', ')}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
  );

const jobs = [
  {
    year: "2021-2024",
    title: 'Data Engineer',
    company: 'XYZ',
    Location: "France",
    skills: ['Spark', 'AWS', 'FlinkSQL', 'Kafka', 'Livy', 'Presto'],
    responsibilities: [
      'Collaborated with a team of 6 data scientists & engineers to deploy cutting-edge Machine Learning Models for production environments, resulting in a 50% reduction in deployment time.',
      'Streamlined ETL pipelines to enhance data quality for ML models, slashing data processing time by 60% using Apache Spark and AWS Analytics services.',
      'Designed and implemented a comprehensive data pipeline using FlinkSQL & Kafka CDC connector, reducing update times for customer profiles by 75-80%.',
      'Achieved 2-3 second query execution times while ensuring GDPR compliance through precise anonymisation rules with Livy, Spark, and Presto.',
      'Spearheaded knowledge transfer sessions and developed a team Wikipedia on Confluence, improving onboarding efficiency by 75%.'
    ]
  },
  {
    year: '2018-2021',
    title: 'Data Engineer',
    company: 'Company 2',
    Location: "India",
    skills: ['Hadoop', 'Spark', 'UC4 Automation', 'ETL'],
    responsibilities: [
      'Led the development & execution of a robust ETL pipeline utilizing Hadoop & Spark to process over 30GBs of data daily, improving data-driven decision-making by 30% for cross-departmental teams.',
      'Created reusable orchestration workflows for end-to-end pipelines using UC4 automation tool, reducing workflow duplication by 40%.',
      'Enhanced ETL pipeline auditing efficiency by deploying comprehensive audit data logging, decreasing issue detection and resolution time by 40%.'
    ]
  },
  {
    year: '2017-2018',
    title: 'Software Engineer',
    company: 'Company 1',
    Location: "India",
    skills: ['Hive', 'Sqoop', 'HDFS', 'Java'],
    responsibilities: [
      'Strategised solutions for analysing ~100k credit card transactions during POC using tools like Hive, Sqoop, and HDFS.',
      'Implemented optimisation techniques such as partitioning, bucketing, and compression to automate Hive external table creation, saving 20% time.'
    ]
  },
  {
    year: '2015-2017',
    title: 'Systems Engineer',
    company: 'Company',
    Location: "India",
    skills: ['Java', 'Spring', 'Hibernate', 'SDLC'],
    responsibilities: [
      'Involved in all phases of SDLC for a mid-sized application, focusing on requirement gathering, development, testing, and deployment using Java with Spring and Hibernate frameworks.',
      'Proactively identified and addressed application vulnerabilities, ensuring continuous enhancement and optimal performance.'
    ]
  }
];


const resumePage = () => {
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

export default resumePage;
