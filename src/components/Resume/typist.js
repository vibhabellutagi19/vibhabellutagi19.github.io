import React from 'react';
import Typist from 'react-typist';

const things_I_like = [
    "Python",
    "AWS",
    "Apache Spark",
    "Apache Kafka",
    "FastAPI",
    "PostgreSQL",
    "Redshift"
]

const TypistComponent = () => (
    <Typist>
        <Typist.Delay ms={600} />
        {things_I_like.map((thing, index) => {
            return (
                <strong key={thing}>
                    {thing}
                    <Typist.Backspace count={things_I_like[index].length} delay={1000} />
                </strong>
            )
        })}
        <strong>Javascript.</strong>
    </Typist>
)

TypistComponent.propTypes = {}

export { TypistComponent as Typist }