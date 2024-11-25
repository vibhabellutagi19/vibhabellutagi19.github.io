import React from 'react';
import './projects.css';

const projects = [
    {
        name: 'Blog Curator',
        description: 'BlogCurator is designed to enhance your blog reading experience by providing a robust system equipped to manage various functionalities including link management, status tracking, tagging, and note-taking.',
        skills: 'Python, FastApi, SQLAlchemy, PostgreSQL',
        link: 'https://github.com/vibhabellutagi19/blogcurator',
    },
];

const ProjectList = () => {
    return (
        <div className="project-list">
            {projects.map((project, index) => (
                <div key={index} className="project-card">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <p className="skills">Skills: {project.skills}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Project
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;