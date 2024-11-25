import React from 'react';
import Typist from 'react-typist';
import './resume.css';

const DataEngineerTypist = () => (
    <Typist>
        <Typist.Delay ms={1000} />
        <span className="detypist-strong">Data Engineer</span>
    </Typist>
);

export default DataEngineerTypist;