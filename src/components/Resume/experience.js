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
        I have over 8 years of experience in data engineering, specializing in building scalable data pipelines, data warehousing, and data analytics solutions.
        I have worked with various technologies including Hadoop, Spark, Kafka, and AWS. My expertise lies in transforming raw data into actionable insights to drive business decisions.
      </p>
      <div className="work-section">
        <div className="work-card" onClick={() => handleCardClick('Data Engineer', [
          'Developed and maintained data pipelines',
          'Implemented data warehousing solutions',
          'Collaborated with data scientists to provide data insights'
        ])}>
          <h3>Data Engineer</h3>
          <p>AgileLab, Remote</p>
          <span>Sept 2021 - Present</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Big Data Engineer', [
          'Designed and implemented big data solutions',
          'Managed Hadoop and Spark clusters',
          'Optimized data processing workflows'
        ])}>
          <h3>Big Data Engineer</h3>
          <p>Deloitte, India</p>
          <span>Sept 2018 - Aug 2021</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Software Engineer', [
          'Developed software applications',
          'Participated in code reviews',
          'Collaborated with cross-functional teams'
        ])}>
          <h3>Software Engineer</h3>
          <p>Attra InfoTech</p>
          <span>July 2017 - Sept 2018</span>
        </div>
        <div className="work-card" onClick={() => handleCardClick('Systems Engineer', [
          'Maintained IT infrastructure',
          'Provided technical support',
          'Implemented system upgrades'
        ])}>
          <h3>Systems Engineer</h3>
          <p>Infosys LTD, India</p>
          <span>Sept 2015 - June 2017</span>
        </div>
      </div>
      <Modal show={showModal} onClose={handleCloseModal} title={modalContent.title}>
        <ul>
          {modalContent.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
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
