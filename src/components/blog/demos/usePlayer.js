'use client';

import { useEffect, useState } from 'react';

/**
 * Play / step / reset over a fixed number of steps, for demos that run once when asked.
 * `step` counts the steps already shown, from 0 (nothing yet) to `length` (done).
 */
export function usePlayer(length, stepMs = 900) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const done = step >= length;

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    if (done) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setStep((current) => current + 1), stepMs);
    return () => clearTimeout(timer);
  }, [playing, step, done, stepMs]);

  return {
    step,
    done,
    playing,
    play() {
      if (done) {
        setStep(0);
      }
      setPlaying(true);
    },
    next() {
      setPlaying(false);
      setStep((current) => Math.min(length, current + 1));
    },
    go(target) {
      setPlaying(false);
      setStep(target);
    },
    reset() {
      setPlaying(false);
      setStep(0);
    },
  };
}
