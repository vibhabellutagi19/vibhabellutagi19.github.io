'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cycles through demo steps, holding each for durations[step] ms.
 * Only runs while the demo is on screen. With reduced motion it stays on
 * restStep, a still frame that shows the finished flow.
 */
export function useStepLoop(durations, restStep = durations.length - 1) {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setStep(restStep);
      return undefined;
    }

    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [restStep]);

  useEffect(() => {
    if (!visible || reduced) {
      return undefined;
    }

    const timer = setTimeout(() => setStep((current) => (current + 1) % durations.length), durations[step]);
    return () => clearTimeout(timer);
  }, [step, visible, reduced, durations]);

  return [ref, step, visible && !reduced];
}

/** A value that animates in each time it changes. */
export function Tick({ value }) {
  return (
    <span key={value} className="tick">
      {value}
    </span>
  );
}
