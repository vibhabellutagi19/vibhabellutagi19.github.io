import React, { useState } from 'react';
import './resume.css';
import { Typist } from './typist.js';
import DataEngineerTypist from './detypist.js';
import Modal from './modal';

const ProfileInfo = () => (
  <div className="profile-info">
    <p>
      I'm a <span className="detypist-container"><DataEngineerTypist /></span> based in South of France.
    </p>
    <div className="typist-container">
      <Typist />
    </div>
  </div>
);

const DownloadResumeButton = () => (
  <a
    href={require('./assets/vb_8yoe.pdf').default}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-primary"
  >
    Download Resume
  </a>
);

const ExperienceSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', responsibilities: [] });

  const handleCardClick = (title, responsibilities) => {
    setModalContent({ title, responsibilities });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="experience-section">
      <h2>Experience</h2>
      <p>
        <strong>Data Engineer Enthusiast</strong> with over 8 years of experience in designing and managing scalable Big Data pipelines and automation solutions.
        Proven ability in delivering complex, high-impact projects that enhance efficiency and drive innovation.
        Committed to strategic planning, mentoring, and aligning technology with business goals to achieve outstanding results.
      </p>
      <div className="work-section">
        <div className="work-card" onClick={() => handleCardClick('Data Engineer', [
          'Led a collaborative effort with data engineers and scientists to implement advanced machine learning models in production, resulting in a <strong>50% reduction in deployment time</strong> and substantial enhancements to operational efficiency',
          'Designed and implemented a comprehensive data pipeline using FlinkSQL & Kafka CDC connector to process 100s of GBs of diverse customer data, resulting in a substantial <strong>75-80% decrease in update times</strong> for customer profiles.',
          'Achieved <strong>2-3 second query execution times</strong> while ensuring GDPR compliance through precise anonymisation rules with Livy, Spark, and Presto, enhancing operational efficiency and data security'
        ])}>
          <h3>Data Engineer</h3>
          <p>AgileLab, Remote</p>
          <span>Sept 2021 - Dec 2024</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Big Data Engineer', [
          'Developed and executed a robust ETL pipeline using Hadoop, Spark, Hive, and Sqoop to process 30GBs of data daily, resulting in a <strong>30% enhancement in data-driven decision-making</strong>',
          'Created reusable orchestration workflows for end-to-end pipelines using the UC4 automation tool, <strong>leading to a ~40% reduction in the duplication of workflows.</strong>',
          'Enhanced ETL pipeline auditing efficiency by deploying comprehensive audit data logging, <strong>leading to a 40% decrease in issue detection and resolution time</strong>, resulting in expedited troubleshooting and optimised system performance.'
        ])}>
          <h3>Big Data Engineer</h3>
          <p>Deloitte, India</p>
          <span>Sept 2018 - Aug 2021</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Software Engineer', [
          'Strategised comprehensive solutions for analysing ~100k credit card transaction data during the initial Proof of Concept (POC) using tools like Hive, Sqoop, and HDFS.',
          'Implemented optimisation techniques such as partitioning, bucketing, & compression to automate Hive external table creation & enable dynamic data loading from HDFS, <strong>resulting in a 20% time savings.</strong>',
        ])}>
          <h3>Software Engineer</h3>
          <p>Attra InfoTech</p>
          <span>July 2017 - Sept 2018</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Systems Engineer', [
          'Involved in all phases of the Software Development Life Cycle (SDLC) for a mid-sized standalone application, focusing on requirement gathering, development, testing, and deployment using Java with Spring and Hibernate frameworks to enhance process efficiency.',
          'Developed a comprehensive web application using Java, Spring, and Hibernate frameworks, <strong>resulting in a 30% reduction in manual data entry</strong> and a substantial increase in operational efficiency.',
        ])}>
          <h3>Systems Engineer</h3>
          <p>Infosys LTD, India</p>
          <span>Sept 2015 - June 2017</span>
        </div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal} title={modalContent.title}>
        <ul>
          {modalContent.responsibilities.map((responsibility, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: responsibility }}></li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

const Profile = () => (
  <div className="profile-container">
    {/* Profile Section */}
    <div className="profile-details">
      <ProfileInfo />
      <DownloadResumeButton />
    </div>

    {/* Experience Section */}
    <ExperienceSection />
  </div>
);

export default Profile;
