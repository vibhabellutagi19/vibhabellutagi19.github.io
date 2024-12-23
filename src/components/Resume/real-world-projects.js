import React, { useState } from 'react';
import './real-world-projects.css';

const projects = [
    {
        id: 1,
        title: 'Near Real-Time Customer Profile Update',
        description: 'Hundreds of gigabytes of data need to be processed daily to maintain updated customer information. The Digital Integration Hub must collect and transform all customer-associated data while preserving the latest state. The existing process relies on scheduled Spark jobs that run multiple times per day, taking hours to complete. FlinkSQL offers near real-time processing capabilities, maintains computation state, and guarantees exactly-once processing.',
        details: [
            'Rewrote the SQL queries as Flink-compliant queries, significantly reducing query runtime by analyzing and optimizing query plans. This improved processing speed, ensuring data updates reached the end users within a minute.',
            'Built a customized CDC connector for FlinkSQL to enable seamless integration with Infosphere, and managed historical computation states on S3, enabling efficient incremental data loads while overcoming S3’s limitations on request rates.',
            'Streamlined intermediate state storage on S3 using optimized savepoints and checkpoints, resolving "500 slow down" errors and reducing cloud costs by approximately 30%, and achieving a 75-80% decrease in update times for customer profiles.'
        ],
        technologies: "FlinkSQL, Kafka, SQL, Python"
    },
    {
        id: 2,
        title: 'Querying Anonymized Data',
        description: 'The client wanted to expose the data to external users, but it was important to ensure GDPR compliance to maintain data security. The data needed to be anonymized based on user roles (determined by metadata).',
        details: [
            'Designed and implemented a solution to anonymize the data on the fly by deploying Spark jobs on a Livy server, allowing users to submit queries using a REST API.',
            'Achieved 2-3 second query execution times while ensuring GDPR compliance through precise anonymization rules, enhancing operational efficiency and data security.'
        ],
        technologies: "Spark, Livy, Presto, Python"
    },
    {
        id: 3,
        title: 'Industrializing Machine Learning Models (NLP)',
        description: 'Managed the deployment of machine learning models for document classification, which required a robust ETL pipeline to preprocess and parse documents. The pipeline was initially designed for a single model, but the client wanted to expand it to support multiple models. The client also requested a CI/CD process to ensure the pipeline was tested and deployed in a controlled manner.',
        details: [
            'Led a team of 2 data engineers, collaborating with data scientists to create an optimized end-to-end ETL pipeline for machine learning models.',
            'Spearheaded generalizing the pipeline to support multiple models, creating common phases for preprocessing and parsing documents, which reduced the time to production by 50%.',
            'Strictly followed the CI/CD process, unit tests, and data quality checks, ensuring the pipeline was tested and deployed in a controlled manner, reducing the number of failed deployments.'
        ],
        technologies: "Python, Sagemaker, Glue, EMR, DynamoDB, Rest API"
    },
];

const ProjectCard = ({ project }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className={`card ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
        >
            {/* Front Side */}
            <div className="card__front">
                <p className="card__title">{project.title}</p>
                <div className="card__content">
                    <p className="card__description">{project.description}</p>
                    <p className="card__technologies">Technologies: {project.technologies}</p>
                </div>
            </div>

            {/* Back Side */}
            <div className="card__back">
                <ul className="card__details">
                    {project.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const ProjectCards = () => {
    return (
        <div className="cards-container">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};

export default ProjectCards;
