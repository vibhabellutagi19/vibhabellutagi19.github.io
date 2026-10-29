'use client';

import { useEffect, useState } from 'react';

// Simulated minutes after 3:00pm. The clock runs one minute every 600ms.
const TIMEOUT = 15;
const END = 40;
const TICK_MS = 100;
const MINUTES_PER_TICK = 1 / 6;

function formatClock(minutes) {
  const whole = Math.floor(minutes);
  return `3:${String(whole).padStart(2, '0')}pm`;
}

function percent(minutes) {
  return `${(Math.min(minutes, END) / END) * 100}%`;
}

function signIn(at) {
  return { signedInAt: at, dbExpiry: at + TIMEOUT, cookieExpiry: at + TIMEOUT, requests: [], signedOut: null };
}

export function SessionSimulator() {
  const [fixed, setFixed] = useState(false);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [session, setSession] = useState(() => signIn(0));

  // Advance the clock; the browser drops the cookie the moment it expires.
  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    const timer = setInterval(() => {
      setNow((current) => Math.min(END, current + MINUTES_PER_TICK));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (!session.signedOut && now >= session.cookieExpiry) {
      const lastActivity = session.requests.at(-1) ?? session.signedInAt;
      setSession((current) => ({
        ...current,
        signedOut: { at: current.cookieExpiry, whileActive: current.cookieExpiry - lastActivity < TIMEOUT },
      }));
      setPlaying(false);
    } else if (now >= END) {
      setPlaying(false);
    }
  }, [now, session]);

  function reset(nextFixed = fixed) {
    setFixed(nextFixed);
    setNow(0);
    setPlaying(false);
    setSession(signIn(0));
  }

  function makeRequest() {
    if (now >= END) {
      return;
    }
    setPlaying(true);
    setSession((current) => ({
      ...current,
      requests: [...current.requests, now],
      dbExpiry: now + TIMEOUT,
      // The bug: the renewed cookie never reached the browser.
      cookieExpiry: fixed ? now + TIMEOUT : current.cookieExpiry,
    }));
  }

  function signInAgain() {
    setSession(signIn(now));
    setPlaying(true);
  }

  const { signedOut } = session;
  let status;
  if (signedOut?.whileActive) {
    status = `Signed out at ${formatClock(signedOut.at)} while you were active. The database still says the session is valid until ${formatClock(session.dbExpiry)}, but the browser already deleted its cookie.`;
  } else if (signedOut) {
    status = `Signed out at ${formatClock(signedOut.at)} after ${TIMEOUT} idle minutes. That's the security rule working as intended.`;
  } else if (now >= END) {
    status = 'Still signed in at the end of the timeline. Reset to try again.';
  } else if (now === 0) {
    status = 'Signed in at 3:00pm. Press "Make a request" to act like a busy user, or start the clock and stay idle.';
  } else {
    status = `Signed in. Database session valid until ${formatClock(session.dbExpiry)}, browser cookie expires ${formatClock(session.cookieExpiry)}.`;
  }

  const cookieExpired = Boolean(signedOut);

  return (
    <figure className="sim">
      <div className="sim-head">
        <div className="sim-mode" role="group" aria-label="Which version of the code">
          <button type="button" aria-pressed={!fixed} onClick={() => reset(false)}>
            Before the fix
          </button>
          <button type="button" aria-pressed={fixed} onClick={() => reset(true)}>
            After the fix
          </button>
        </div>
        <span className="sim-clock" aria-label={`Simulated time ${formatClock(now)}`}>
          {formatClock(now)}
        </span>
      </div>

      <div className="sim-board" aria-hidden="true">
        <span className="sim-label">Requests</span>
        <span className="sim-lane">
          {session.requests.map((at) => (
            <i key={at} className="sim-dot" style={{ left: percent(at) }} />
          ))}
        </span>

        <span className="sim-label">Database session</span>
        <span className="sim-lane">
          <span
            className="sim-bar sim-bar-db"
            style={{ left: percent(session.signedInAt), width: `calc(${percent(session.dbExpiry)} - ${percent(session.signedInAt)})` }}
          />
        </span>

        <span className="sim-label">Browser cookie</span>
        <span className="sim-lane">
          <span
            className={`sim-bar ${cookieExpired ? 'sim-bar-gone' : fixed ? 'sim-bar-db' : 'sim-bar-cookie'}`}
            style={{ left: percent(session.signedInAt), width: `calc(${percent(session.cookieExpiry)} - ${percent(session.signedInAt)})` }}
          />
        </span>

        <span className="sim-axis">
          {[0, 10, 20, 30, 40].map((m) => (
            <span key={m} style={{ left: percent(m) }}>
              3:{String(m).padStart(2, '0')}
            </span>
          ))}
        </span>

        <span className="sim-now" style={{ '--now': now / END }} />
      </div>

      <p className={`sim-status${signedOut?.whileActive ? ' is-bad' : signedOut ? ' is-ok' : ''}`} aria-live="polite">
        {status}
      </p>

      <div className="sim-controls">
        {signedOut ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={signInAgain} disabled={now >= END}>
            Sign in again
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={makeRequest} disabled={now >= END}>
            Make a request
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setPlaying((current) => !current)}
          disabled={Boolean(signedOut) || now >= END}
        >
          {playing ? 'Pause clock' : 'Start clock'}
        </button>
        <button type="button" className="text-link sim-reset" onClick={() => reset()}>
          Reset
        </button>
      </div>

      <figcaption>
        Each simulated minute takes 0.6 seconds. Keep clicking &ldquo;Make a request&rdquo; in both versions and
        compare when you get signed out.
      </figcaption>
    </figure>
  );
}
