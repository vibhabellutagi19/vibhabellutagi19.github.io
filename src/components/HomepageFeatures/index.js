import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import './ResponsiveScrollComponent.css';

const ResponsiveScrollComponent = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Throttle function to optimize scroll performance
  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <div className="page-container">
      <div className="header" style={{
        backgroundColor: scrollPosition > 50 ? '#282c34' : 'transparent',
        transition: 'background-color 0.3s ease',
      }}>
        <h1>Responsive Scroll Header</h1>
      </div>
      <div className="scrollable-section">
        <div className="timeline-container">
          <h2>My Journey</h2>
          <div className="timeline">
          <TimelineItem year="2023" icon="🔖" text="Certified as AWS Specialty - Big Data Analytics" />
          <TimelineItem year="2021" icon="🖥️" text="Joined AgileLab as Data Engineer" />
          <TimelineItem year="2021" icon="🇫🇷" text="Moved to France with my spouse" /> 
          <TimelineItem year="2019" icon="👩‍❤️‍👨" text="Started New Journey, Married to one of the best human being" />
          <TimelineItem year="2018" icon="📊" text="Joined Deloitte as Consultant ( Big Data Engineer )" />
          <TimelineItem year="2017" icon="📈" text="Started my career as Big Data Engineer, After joining Attra Infotech" />
          <TimelineItem year="2015" icon="💻" text="Joined Infosys as Systems Trainee" />
          <TimelineItem year="2015" icon="👩🏼‍💻" text="Graduated as Computer Science Student From Sapthagiri College Of Engineering" />
          <TimelineItem year="1994" icon="🇮🇳" text="I was born in Karnataka, Southern India" />
          </div>
        </div>
      </div>
      <div className="activities-section">
        <h2>Things I Do Outside of Work</h2>
        <div className="activities">
          <div className="activity-item">
            <span role="img" aria-label="Travel">✈️</span>
            <p>I love traveling and exploring new cultures, cuisines, and landscapes. It's my way to recharge and find inspiration.</p>
          </div>
          <div className="activity-item">
            <span role="img" aria-label="Photography">📸</span>
            <p>Photography is my passion. Capturing moments, whether during travels or in daily life, allows me to tell stories visually.</p>
          </div>
        </div>
      </div>
      <div className="gallery-section">
        <h2>Photography Gallery</h2>
        <div className="gallery">
          <div className="gallery-column">
          <img src={require('./images/photo1.jpg').default} alt="Travel Photo 1" className="gallery-image" />
          <img src={require('./images/photo2.jpg').default} alt="Travel Photo 2" className="gallery-image" />
          </div>
        </div>
        <p>Check out more of my photography on <a href="https://www.instagram.com/your_instagram" target="_blank" rel="noopener noreferrer">Instagram</a>.</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ year, icon, text }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <div ref={ref} className={`timeline-item ${inView ? 'visible' : ''}`}>
      <div className="timeline-icon">{icon}</div>
      <div className="timeline-content">
        <h3>{year}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ResponsiveScrollComponent;