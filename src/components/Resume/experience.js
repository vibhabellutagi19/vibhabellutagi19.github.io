import React from 'react';
import './common.css';
import { Typist } from './typist.js';

const ProfileInfo = () => (
  <div className="profile-info">
    <img
      className="profile-picture"
      src={require('./assets/vibha.png').default}
      alt="Profile"
    />
    <h1>Vibhavari Bellutagi</h1>
    <p>I'm a Data Engineer based in South of France.</p>
    <Typist />
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

const ExperienceSection = () => (
  <div className="experience-section">
    <h2>Experience</h2>
    <p>
      I have over 8 years of experience in data engineering, specializing in building scalable data pipelines, data warehousing, and data analytics solutions.
      I have worked with various technologies including Hadoop, Spark, Kafka, and AWS. My expertise lies in transforming raw data into actionable insights to drive business decisions.
    </p>
    <div className="work-section">
      <div className="work-card">
        <h3>Data Engineer</h3>
        <p>AgileLab, Remote</p>
        <span>Sept 2021 - Present</span>
      </div>
      <div className="work-card">
        <h3>Big Data Engineer</h3>
        <p>Deloitte, India</p>
        <span>Sept 2018 - Aug 2021</span>
      </div>
      <div className="work-card">
        <h3>Software Engineer</h3>
        <p>Attra InfoTech</p>
        <span>July 2017 - Sept 2018</span>
      </div>
      <div className="work-card">
        <h3>Systems Engineer</h3>
        <p>Infosys LTD, India</p>
        <span>Sept 2015 - June 2017</span>
      </div>
    </div>
  </div>
);

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
