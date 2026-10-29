'use client';

import { useEffect, useState } from 'react';

const STEP_MS = 1100;

// Each step: what A and B log, the row's count afterwards, and who holds the row lock.
const SCRIPTS = {
  none: [
    { a: 'SELECT … → sees 9/10', count: 9, lock: null },
    { b: 'SELECT … → sees 9/10', count: 9, lock: null },
    { a: '9 < 10, so INSERT booking and count + 1. COMMIT', count: 10, lock: null },
    { b: '9 < 10 (stale!), so INSERT booking and count + 1. COMMIT', count: 11, lock: null, bad: true },
  ],
  lock: [
    { a: 'SELECT … FOR UPDATE → gets the lock, sees 9/10', count: 9, lock: 'A' },
    { b: 'SELECT … FOR UPDATE → waits for A', count: 9, lock: 'A', bWaiting: true },
    { a: '9 < 10, so INSERT booking and count + 1. COMMIT, lock released', count: 10, lock: null, bWaiting: true },
    { b: 'Gets the lock, re-reads 10/10 → rejected: session full', count: 10, lock: 'B' },
    { b: 'ROLLBACK, lock released', count: 10, lock: null },
  ],
};

const RESULTS = {
  none: { tone: 'is-bad', text: 'Overbooked: 11 people in a class with 10 spots. Both requests checked the same stale count.' },
  lock: { tone: 'is-ok', text: '10/10. B waited for A, saw the real count and was turned away. No overbooking.' },
};

export function BookingRace() {
  const [mode, setMode] = useState('none');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const script = SCRIPTS[mode];
  const done = step >= script.length;

  useEffect(() => {
    if (!playing || done) {
      if (done) setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setStep((current) => current + 1), STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, step, done]);

  function choose(nextMode) {
    setMode(nextMode);
    setStep(0);
    setPlaying(false);
  }

  function play() {
    if (done) {
      setStep(0);
    }
    setPlaying(true);
  }

  const shown = script.slice(0, step);
  const current = shown.at(-1) ?? { count: 9, lock: null };
  const logFor = (who) => shown.filter((entry) => entry[who]).map((entry) => entry[who]);
  const bWaiting = Boolean(current.bWaiting);

  return (
    <figure className="sim race">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Locking strategy">
          <button type="button" aria-pressed={mode === 'none'} onClick={() => choose('none')}>
            No lock
          </button>
          <button type="button" aria-pressed={mode === 'lock'} onClick={() => choose('lock')}>
            SELECT … FOR UPDATE
          </button>
        </div>
        <span className="race-step">
          Step {Math.min(step, script.length)} / {script.length}
        </span>
      </div>

      <div className="race-board">
        <div className="race-client">
          <p className="race-who">Client A taps Book</p>
          <ol className="race-log">
            {logFor('a').map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>

        <div className={`race-row${current.bad ? ' is-bad' : ''}`} aria-live="polite">
          <p className="race-row-label">sessions row · HIIT 7:00am</p>
          <p className="race-count">
            <span key={current.count} className="tick">
              {current.count}
            </span>
            /10
          </p>
          <p className={`race-lock${current.lock ? ' is-held' : ''}`}>
            {current.lock ? `Locked by ${current.lock}` : 'Unlocked'}
          </p>
        </div>

        <div className="race-client">
          <p className="race-who">
            Client B taps Book
            {bWaiting && <span className="race-wait">waiting…</span>}
          </p>
          <ol className="race-log">
            {logFor('b').map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </div>

      <p className={`sim-status${done ? ` ${RESULTS[mode].tone}` : ''}`} aria-live="polite">
        {done
          ? RESULTS[mode].text
          : step === 0
            ? 'The class has 9 of 10 spots booked. Both clients tap Book at the same moment.'
            : playing
              ? 'Running…'
              : 'Paused. Press Continue, or Step for the next statement.'}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={play} disabled={playing}>
          {done ? 'Replay' : step === 0 ? 'Both tap Book' : 'Continue'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setPlaying(false);
            setStep((current) => Math.min(script.length, current + 1));
          }}
          disabled={done}
        >
          Step
        </button>
        <button type="button" className="text-link sim-reset" onClick={() => choose(mode)}>
          Reset
        </button>
      </div>

      <figcaption>
        Each step is one statement. Play it in both modes, or use Step to go one statement at a time.
      </figcaption>
    </figure>
  );
}
