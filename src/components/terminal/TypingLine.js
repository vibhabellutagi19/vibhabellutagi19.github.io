'use client';

import { useEffect, useState } from 'react';

const PHRASES = [
  'spark-submit portfolio.py --mode prod',
  'git log --oneline --graph --experience',
  'cat blog/spark-basics.md | head -20',
];

export function TypingLine() {
  const [text, setText] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setText(PHRASES[0]);
      return undefined;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    function tick() {
      const current = PHRASES[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        setText(current.slice(0, charIndex));
        if (charIndex >= current.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 55);
        return;
      }

      charIndex -= 1;
      setText(current.slice(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
      }
      timer = setTimeout(tick, 22);
    }

    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bufline typedline">
      <span className="ln">2</span>
      <div className="code">
        <span className="prompt">vibhavari@portfolio:~$</span> {text}
        <span className="cursor" aria-hidden="true" />
      </div>
    </div>
  );
}
