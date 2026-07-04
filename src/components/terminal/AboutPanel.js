'use client';

import { useEffect, useState } from 'react';

const COMMAND = 'cat about.md';

export function AboutPanel({ paragraphs, highlights }) {
  const [command, setCommand] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setCommand(COMMAND);
      setShowContent(true);
      return undefined;
    }

    let charIndex = 0;
    let timer;

    function typeCommand() {
      charIndex += 1;
      setCommand(COMMAND.slice(0, charIndex));
      if (charIndex >= COMMAND.length) {
        timer = setTimeout(() => setShowContent(true), 320);
        return;
      }
      timer = setTimeout(typeCommand, 48);
    }

    timer = setTimeout(typeCommand, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="about-md">
      <div className="about-head">
        <span className="ln">3</span>
        <div className="about-cmd">
          <span className="prompt">vibhavari@portfolio:~$</span> {command}
          {!showContent && <span className="cursor" aria-hidden="true" />}
        </div>
      </div>
      {showContent && (
        <div className="about-body about-body-reveal">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="about-p">
              {paragraph}
            </p>
          ))}
          <ul className="about-list">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
