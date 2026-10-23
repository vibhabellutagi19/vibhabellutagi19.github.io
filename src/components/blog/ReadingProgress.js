'use client';

import { useEffect, useRef } from 'react';

// A thin bar along the top of the window that fills as the reader moves through the article.
// It writes the transform directly so scrolling never re-renders React.
export function ReadingProgress({ targetId }) {
  const barRef = useRef(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const bar = barRef.current;
    if (!target || !bar) {
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      const distance = height - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -top / distance)) : 1;
      bar.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [targetId]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={barRef} className="reading-progress-bar" />
    </div>
  );
}
