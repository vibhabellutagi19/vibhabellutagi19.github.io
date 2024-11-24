import React from 'react';
import './resume.css';

const Profile = () => {
  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-details">
        <div className="profile-info">
          <img
            className="profile-picture"
            src="./vibha.png"
            alt="Profile"
          />
          <h1>Vibhavari Bellutagi</h1>
          <p>I'm a Data Engineer based in South of France.</p>
        </div>

        {/* Button to download resume */}
        <a 
          href="./vb_8yoe.pdf" 
          download="Vibhavari_Bellutagi_DE.pdf" 
          className="btn-primary"
        >
          Download Resume
        </a>
      </div>

      {/* Experience Section */}
      <div className="experience-section">
        <h2>Experience</h2>
        <p>
          I have over 8 years of experience in data engineering, specializing in building scalable data pipelines, data warehousing, and data analytics solutions. 
          I have worked with various technologies including Hadoop, Spark, Kafka, and AWS. My expertise lies in transforming raw data into actionable insights to drive business decisions.
        </p>
      </div>

      {/* About Me Section */}
        <div className="about-me">
          <h2>About me</h2>
          <p>
            I'm a Data Engineer based in the South of France. I have a passion for transforming raw data into actionable insights and building scalable data solutions.
          </p>
          <p>
            With over 8 years of experience, I have worked with various technologies including Hadoop, Spark, Kafka, and AWS. I enjoy solving complex data problems and helping businesses make data-driven decisions.
          </p>
          <p>
            In my free time, I love exploring new data tools and technologies, and contributing to open-source projects.
          </p>
        </div>

        {/* Work Section */}
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
};

export default Profile;
