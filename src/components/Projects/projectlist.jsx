import React from 'react';
import './projects.css';

const projects = [
    {
        name: 'Project 1',
        description: 'Description of project 1.',
        link: 'https://github.com/vibhabellutagi19/blogcurator',
    },
    {
        name: 'Project 2',
        description: 'Description of project 2.',
        link: 'https://github.com/vibhabellutagi19/python-cookiecutter',
    },
    // Add more projects as needed
];

const ProjectList = () => {
    return (
        <div className="project-list">
            {projects.map((project, index) => (
                <div key={index} className="project-card">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Project
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;