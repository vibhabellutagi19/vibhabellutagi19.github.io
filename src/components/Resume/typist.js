import React from 'react';
import Typist from 'react-typist';
import './resume.css';

const things_I_like = [
    "AWS Analytics Services.",
    "Apache Spark.",
    "Apache Kafka.",
    "FastAPI.",
    "PostgreSQL.",
    "Redshift."
];

const TypistComponent = () => (
    <div className="typist-container">
        <Typist>
            <Typist.Delay ms={600} />
            {things_I_like.map((thing, index) => (
                <span key={thing} className="typist-strong">
                    {thing}
                    <Typist.Backspace count={thing.length} delay={1000} />
                </span>
            ))}
            <span className="typist-strong">Python.</span>
        </Typist>
    </div>
);

export { TypistComponent as Typist };