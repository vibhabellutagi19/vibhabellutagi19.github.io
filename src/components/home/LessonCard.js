'use client';

import Link from 'next/link';
import { useState } from 'react';

/** One thing a post teaches, as a question. The answer is a click away, the post one more. */
export function LessonCard({ lessons }) {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  if (lessons.length === 0) {
    return null;
  }
  const lesson = lessons[index];

  const next = () => {
    setIndex((current) => (current + 1) % lessons.length);
    setShown(false);
  };

  return (
    <section className="lesson" aria-label="One-minute lesson">
      <p className="lesson-bar">
        <span>
          <span className="ledger-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span aria-hidden="true">$ learn --one-thing</span>
        </span>
        <span>
          {index + 1} / {lessons.length}
        </span>
      </p>
      <p className="lesson-tag">#{lesson.tag}</p>
      <h2 className="lesson-q">{lesson.question}</h2>

      <div className="lesson-a" aria-live="polite">
        {shown && (
          <>
            <p>{lesson.answer}</p>
            <Link href={lesson.href}>Full story: {lesson.title} →</Link>
          </>
        )}
      </div>

      <div className="lesson-actions">
        {!shown && (
          <button type="button" className="btn btn-sand" onClick={() => setShown(true)}>
            Show the answer
          </button>
        )}
        {lessons.length > 1 && (
          <button type="button" className="btn btn-ghost-dark" onClick={next}>
            Next question →
          </button>
        )}
      </div>
    </section>
  );
}
