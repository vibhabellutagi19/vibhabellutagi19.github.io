import React from 'react';
import '../css/ResumePage.css';

const ResumePage = () => {
  return (
    <div className="resume-container">
      <div className="header">
        <h1>Vibhavari Bellutagi</h1>
        <p className="contact-info">
          vibhavari.bellutagi@gmail.com | <a href="https://www.linkedin.com/in/vibhavari-bellutagi-837871189/">LinkedIn</a>
        </p>
      </div>
      <div className="summary">
        <h2>Summary</h2>
        <p>
          Experienced data engineer with a proven track record of over 8+ years in the IT industry, specialising in designing and maintaining scalable Big Data pipelines and automation accelerators to meet complex data processing needs. Dedicated to innovation and efficiency, consistently seeking new challenges in data processing and automation.
        </p>
      </div>
      <div className="content-columns">
        <div className="left-column">
          <div className="skills">
            <h2>Skills</h2>
            <table className="skills-table">
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
          <div className="education">
            <h2>Education</h2>
            <p>Bachelor of Engineering - ABC College of Engineering</p>
          </div>
          <div className="certifications">
            <h2>Certifications</h2>
            <ul>
              <li>Databricks Data Engineer Associate Certification | Databricks | June 2024</li>
              <li>AWS Data Analytics - Specialty | AWS | Dec 2023</li>
            </ul>
          </div>
        </div>
        <div className="right-column">
          <div className="experience">
            <h2>Professional Experience</h2>
            <div className="job">
              <h3>Data Engineer - XYZ</h3>
              <p className="job-duration">Sep '21 - Present, France</p>
              <ul>
                <li>Collaborated with a team of 6 data scientists & engineers to deploy cutting-edge Machine Learning Models for production environments, resulting in a 50% reduction in deployment time.</li>
                <li>Streamlined ETL pipelines to enhance data quality for ML models, slashing data processing time by 60% using Apache Spark and AWS Analytics services.</li>
                <li>Designed and implemented a comprehensive data pipeline using FlinkSQL & Kafka CDC connector, reducing update times for customer profiles by 75-80%.</li>
                <li>Achieved 2-3 second query execution times while ensuring GDPR compliance through precise anonymisation rules with Livy, Spark, and Presto.</li>
                <li>Spearheaded knowledge transfer sessions and developed a team Wikipedia on Confluence, improving onboarding efficiency by 75%.</li>
              </ul>
            </div>
            <div className="job">
              <h3>Data Engineer - Company 2</h3>
              <p className="job-duration">Sep '18 - Aug '21, India</p>
              <ul>
                <li>Led the development & execution of a robust ETL pipeline utilizing Hadoop & Spark to process over 30GBs of data daily, improving data-driven decision-making by 30% for cross-departmental teams.</li>
                <li>Created reusable orchestration workflows for end-to-end pipelines using UC4 automation tool, reducing workflow duplication by 40%.</li>
                <li>Enhanced ETL pipeline auditing efficiency by deploying comprehensive audit data logging, decreasing issue detection and resolution time by 40%.</li>
              </ul>
            </div>
            <div className="job">
              <h3>Software Engineer - Company 1</h3>
              <p className="job-duration">Jul '17 - Sep '18, India</p>
              <ul>
                <li>Strategised solutions for analysing ~100k credit card transactions during POC using tools like Hive, Sqoop, and HDFS.</li>
                <li>Implemented optimisation techniques such as partitioning, bucketing, and compression to automate Hive external table creation, saving 20% time.</li>
              </ul>
            </div>
            <div className="job">
              <h3>Systems Engineer - Company</h3>
              <p className="job-duration">Sep '15 - Jun '17, India</p>
              <ul>
                <li>Involved in all phases of SDLC for a mid-sized application, focusing on requirement gathering, development, testing, and deployment using Java with Spring and Hibernate frameworks.</li>
                <li>Proactively identified and addressed application vulnerabilities, ensuring continuous enhancement and optimal performance.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;