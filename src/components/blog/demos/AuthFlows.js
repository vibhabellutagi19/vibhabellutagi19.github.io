'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { usePlayer } from './usePlayer';

// Demos for "Authentication Explained: Sessions vs JWT": Alice and the shop server, played
// step by step, plus a logout race between a session and a JWT.
//
// Record mode (for Instagram Reels): a 9:16 frame that plays on its own and loops, with big
// captions, no buttons and a watermark. It only switches on in `pnpm dev`, by opening the post
// with ?record=<demo name>, e.g. /blog/auth-sessions-vs-jwt?record=auth-session-cloakroom.
// In the production build NODE_ENV is "production", so visitors can't turn it on.
const RECORD_ENABLED = process.env.NODE_ENV === 'development';
const WATERMARK = 'buildwithvibs.in';

function useRecordMode(name) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!RECORD_ENABLED) {
      return;
    }
    setOn(new URLSearchParams(window.location.search).get('record') === name);
  }, [name]);
  return on;
}

// Rendered straight into <body>, so no transformed ancestor can trap the fixed overlay.
// Record mode only switches on after mount, so `document` always exists here.
function RecordFrame({ title, caption, captionKey, children }) {
  return createPortal(
    <div className="af-record">
      <div className="af-reel">
        <p className="af-reel-title">{title}</p>
        <div className="af-reel-body">{children}</div>
        <p key={captionKey} className="af-reel-caption af-fade-in" aria-live="polite">
          {caption}
        </p>
        <p className="af-reel-mark">{WATERMARK}</p>
      </div>
    </div>,
    document.body,
  );
}

// ---------- Icons (stroke icons, coloured by currentColor) ----------

function BrowserIcon() {
  return (
    <svg className="af-icon" viewBox="0 0 34 26" aria-hidden="true">
      <rect x="1.5" y="1.5" width="31" height="23" rx="4" />
      <path d="M1.5 8h31" />
      <circle className="af-icon-fill" cx="6" cy="4.8" r="1.2" />
      <circle className="af-icon-fill" cx="10" cy="4.8" r="1.2" />
      <circle className="af-icon-fill" cx="14" cy="4.8" r="1.2" />
      <path d="M7 14h14M7 18.5h9" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg className="af-icon" viewBox="0 0 30 28" aria-hidden="true">
      <rect x="1.5" y="1.5" width="27" height="10.5" rx="3" />
      <rect x="1.5" y="16" width="27" height="10.5" rx="3" />
      <circle className="af-icon-fill" cx="7" cy="6.75" r="1.4" />
      <circle className="af-icon-fill" cx="7" cy="21.25" r="1.4" />
      <path d="M13 6.75h10M13 21.25h10" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className="af-icon af-icon-sm" viewBox="0 0 24 28" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="10" ry="3.5" />
      <path d="M2 5v18c0 1.9 4.5 3.5 10 3.5s10-1.6 10-3.5V5" />
      <path d="M2 14c0 1.9 4.5 3.5 10 3.5s10-1.6 10-3.5" />
    </svg>
  );
}

// ---------- Step data ----------

// Each step only lists what changes. The message and the panel last for one step.
function build(deltas) {
  let state = { holding: null, store: null, memory: undefined };
  return deltas.map((delta) => {
    state = { ...state, msg: null, tone: null, panel: null, ...delta };
    return state;
  });
}

const SESSION_ID = '0PXJ…';

const TOKEN = {
  header: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  payload: 'eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIiwiaXNzIjoi…',
  signature: 'ztAqcXMGO1SudJZT6qMmUos1Al88n_xwFjOzDjkQnWA',
};

function TokenPanel() {
  const parts = [
    { tone: 'h', title: 'Header', body: '{ "alg": "HS256", "typ": "JWT" }' },
    { tone: 'p', title: 'Payload · anyone can read this', body: '{ "sub": "user_42", "name": "Alice", "exp": 6 pm }' },
    { tone: 's', title: 'Signature', body: 'the stamp only the server can make' },
  ];
  return (
    <div className="af-panel af-passport">
      <p className="af-token">
        <span className="af-part is-h">{TOKEN.header}</span>
        <span className="af-dot">.</span>
        <span className="af-part is-p">{TOKEN.payload}</span>
        <span className="af-dot">.</span>
        <span className="af-part is-s">{TOKEN.signature}</span>
      </p>
      <div className="af-decoded">
        {parts.map((part, index) => (
          <div key={part.tone} className={`af-box is-${part.tone}`} style={{ animationDelay: `${0.2 + index * 0.25}s` }}>
            <b>{part.title}</b>
            <code>{part.body}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

const CHECKS = [
  { ok: true, text: 'signature matches: nobody changed it' },
  { ok: true, text: 'exp is 6 pm: not expired' },
  { ok: true, text: 'aud is shop-api: meant for this server' },
  { ok: false, text: 'sub is user_42: this is Alice' },
];

function CheckPanel() {
  return (
    <ul className="af-panel af-checks">
      {CHECKS.map((check, index) => (
        <li key={check.text} style={{ animationDelay: `${0.15 + index * 0.35}s` }}>
          <span className={`af-check${check.ok ? '' : ' is-arrow'}`}>{check.ok ? '✓' : '→'}</span>
          {check.text}
        </li>
      ))}
    </ul>
  );
}

// ---------- The browser ⇄ server flow ----------

function Node({ kind, name, sending, receiving, result, step, children }) {
  return (
    <div className={`af-node is-${kind}${sending ? ' is-sending' : ''}`}>
      {receiving && <span key={`pulse-${step}`} className="af-pulse" />}
      {receiving && result && (
        <span key={`badge-${step}`} className={`af-badge is-${result}`}>
          {result === 'ok' ? '✓' : '✕'}
        </span>
      )}
      <span className="af-node-icon">{kind === 'browser' ? <BrowserIcon /> : <ServerIcon />}</span>
      <span className="af-name">{name}</span>
      {children}
    </div>
  );
}

function FlowDemo({ name, title, steps, server, serverNote, memoryLabel, store, caption }) {
  const record = useRecordMode(name);
  const player = usePlayer(steps.length - 1, record ? 2600 : 2100);
  const s = steps[player.step];

  // Record mode starts by itself and loops after a pause on the last step.
  useEffect(() => {
    if (record && !player.playing) {
      const timer = setTimeout(player.play, player.done ? 2500 : 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [record, player.playing, player.done, player.play]);

  const from = s.msg?.from;
  const to = from === 'browser' ? 'server' : from === 'server' ? 'browser' : null;
  const msgTone = s.msg?.tone ?? '';

  const stage = (
    <>
      <div className="af-stage" aria-hidden="true">
        <Node kind="browser" name="Alice’s browser" sending={from === 'browser'} receiving={to === 'browser'} result={msgTone} step={player.step}>
          <span key={s.holding ?? 'none'} className={`af-hold${s.holding ? ' is-on' : ''}`}>
            {s.holding ?? 'holding nothing'}
          </span>
        </Node>

        <div className="af-wire">
          <span className="af-rail" />
          {s.msg && <span key={`trail-${player.step}`} className={`af-trail from-${from}${msgTone ? ` is-${msgTone}` : ''}`} />}
          {/* The request in plain text above the line, and a dot carrying it across. */}
          {s.msg && (
            <span key={`label-${player.step}`} className={`af-label from-${from}${msgTone ? ` is-${msgTone}` : ''}`}>
              {s.msg.label}
            </span>
          )}
          {s.msg && <span key={`dot-${player.step}`} className={`af-packet from-${from}${msgTone ? ` is-${msgTone}` : ''}`} />}
          {s.msg && <span key={`head-${player.step}`} className={`af-head from-${from}${msgTone ? ` is-${msgTone}` : ''}`} />}
        </div>

        <Node kind="server" name={server} sending={from === 'server'} receiving={to === 'server'} result={null} step={player.step}>
          {memoryLabel && (
            <span key={s.memory || 'empty'} className={`af-memory${s.memory ? ' is-on' : ''}`}>
              {memoryLabel}: {s.memory || 'nothing'}
            </span>
          )}
          {serverNote && <span className="af-note">{serverNote}</span>}
        </Node>

        {store && (
          <div className="af-store">
            <span className="af-store-label">
              <StoreIcon /> Session store
            </span>
            {s.store?.length ? (
              s.store.map((card) => (
                <span
                  key={`${card.label}-${card.torn ? 'torn' : card.hit ? 'hit' : 'on'}`}
                  className={`af-card${card.torn ? ' is-torn' : ''}${card.hit ? ' is-hit' : ''}`}
                >
                  {card.label}
                </span>
              ))
            ) : (
              <span className="af-empty">empty</span>
            )}
          </div>
        )}
      </div>
      {s.panel === 'token' && <TokenPanel />}
      {s.panel === 'checks' && <CheckPanel />}
    </>
  );

  if (record) {
    return (
      <RecordFrame title={title} caption={s.text} captionKey={player.step}>
        {stage}
      </RecordFrame>
    );
  }

  return (
    <figure className="sim af">
      {stage}

      <p
        key={player.step}
        className={`sim-status af-fade-in${s.tone === 'ok' ? ' is-ok' : s.tone === 'bad' ? ' is-bad' : ''}`}
        aria-live="polite"
      >
        {s.text}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={player.play} disabled={player.playing}>
          {player.done ? 'Replay' : player.step === 0 ? 'Play' : 'Continue'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={player.next} disabled={player.done}>
          Next step
        </button>
        <button type="button" className="text-link sim-reset" onClick={player.reset}>
          Reset
        </button>
      </div>

      <figcaption>{caption}</figcaption>
    </figure>
  );
}

const HTTP_FORGETS = build([
  { text: 'Alice is about to log in to the shop. Press Play, or step through it.', memory: '' },
  { text: 'Alice sends her email and password.', msg: { from: 'browser', label: 'POST /login' } },
  {
    text: 'The password is right. For this one request, the server knows it’s Alice.',
    msg: { from: 'server', label: '200 OK', tone: 'ok' },
    memory: 'Alice',
    tone: 'ok',
  },
  { text: 'The response is sent, and the server forgets. Nothing is kept for the next request.', memory: '' },
  { text: 'Alice opens her orders page. Nothing in this request says who she is.', msg: { from: 'browser', label: 'GET /orders' } },
  {
    text: 'The server has no idea who’s asking, so it answers 401 Unauthorized.',
    msg: { from: 'server', label: '401 Who are you?', tone: 'bad' },
    tone: 'bad',
  },
]);

export function AuthHttpForgets() {
  return (
    <FlowDemo
      name="auth-http-forgets"
      title="HTTP forgets you after every request"
      steps={HTTP_FORGETS}
      server="Shop server"
      memoryLabel="remembers"
      caption="Play it, or use Next step to go one step at a time."
    />
  );
}

const SESSION_FLOW = build([
  { text: 'Alice is about to log in. Press Play, or step through it.', store: [] },
  { text: 'Alice logs in with her email and password.', msg: { from: 'browser', label: 'POST /login' } },
  {
    text: 'The password is right. The server saves a record in the session store, like the cloakroom counter keeping her bag.',
    store: [{ label: `${SESSION_ID} → Alice` }],
  },
  {
    text: 'It sends back only the session ID, in a cookie. That’s Alice’s cloakroom token.',
    msg: { from: 'server', label: `Set-Cookie: ${SESSION_ID}` },
    holding: `cookie: ${SESSION_ID}`,
  },
  { text: 'On her next click, the browser sends the cookie automatically.', msg: { from: 'browser', label: 'GET /orders + cookie' } },
  {
    text: `The server looks up ${SESSION_ID} in the store, finds Alice, and returns her orders.`,
    msg: { from: 'server', label: '200 Alice’s orders', tone: 'ok' },
    store: [{ label: `${SESSION_ID} → Alice`, hit: true }],
    tone: 'ok',
  },
  { text: 'Alice logs out.', msg: { from: 'browser', label: 'POST /logout' }, store: [{ label: `${SESSION_ID} → Alice` }] },
  {
    text: 'The server deletes the record. The cookie is still in the browser, but it points to nothing now.',
    store: [{ label: `${SESSION_ID} → Alice`, torn: true }],
  },
  { text: 'Now send the same cookie again.', msg: { from: 'browser', label: 'GET /orders + cookie' } },
  {
    text: 'No record, no Alice. The old session ID is useless.',
    msg: { from: 'server', label: '401 Who are you?', tone: 'bad' },
    tone: 'bad',
  },
]);

export function AuthSessionCloakroom() {
  return (
    <FlowDemo
      name="auth-session-cloakroom"
      title="Sessions: the server remembers you"
      steps={SESSION_FLOW}
      server="Shop server"
      store
      caption="The session store is the cloakroom counter. The cookie is the token."
    />
  );
}

const JWT_FLOW = build([
  { text: 'Alice is about to log in. Press Play, or step through it.' },
  { text: 'Alice logs in with her email and password.', msg: { from: 'browser', label: 'POST /login' } },
  {
    text: 'The server writes Alice’s details into a token, signs it, and hands it over. It saves nothing.',
    msg: { from: 'server', label: 'JWT: Alice, until 6 pm' },
    holding: 'JWT: Alice, until 6 pm',
  },
  {
    text: 'The token has three parts. Anyone can decode the first two: they’re plain JSON. The third is the signature.',
    panel: 'token',
  },
  {
    text: 'On her next click, the browser sends the token in the Authorization header.',
    msg: { from: 'browser', label: 'GET /orders + Bearer JWT' },
  },
  { text: 'The server checks the stamp, the expiry and who the token is for. No database, no lookup.', panel: 'checks' },
  {
    text: 'Every check passes, so it’s Alice. Here are her orders.',
    msg: { from: 'server', label: '200 Alice’s orders', tone: 'ok' },
    tone: 'ok',
  },
]);

export function AuthJwtPassport() {
  return (
    <FlowDemo
      name="auth-jwt-passport"
      title="JWT: the token remembers you"
      steps={JWT_FLOW}
      server="Shop server"
      serverNote="no session store"
      caption="There’s no session store in this picture. That’s the point."
    />
  );
}

// ---------- Logout race ----------

// Minutes after 5:00 pm. Both logins would last until 6:00 pm.
const END = 70;
const EXPIRES = 60;
const TICK_MS = 100;
const MINUTES_PER_TICK = 0.25;
const RECORD_SCRIPT = [
  { at: 12, type: 'logout' },
  { at: 22, type: 'attempt' },
  { at: 42, type: 'attempt' },
  { at: 64, type: 'attempt' },
];

function clock(minutes) {
  const total = 17 * 60 + Math.floor(minutes);
  return `${Math.floor(total / 60) - 12}:${String(total % 60).padStart(2, '0')} pm`;
}

function percent(minutes) {
  return `${(Math.min(minutes, END) / END) * 100}%`;
}

function describe(event) {
  if (!event) {
    return 'At 5:00 pm Alice logs in, and someone copies her login. Start the clock, log Alice out, then let the attacker try.';
  }
  if (event.type === 'logout') {
    return `${clock(event.at)}: Alice logs out. The server deletes her session record. There’s nothing to delete for the JWT, so it’s still valid until 6:00 pm.`;
  }
  const when = `${clock(event.at)}: the attacker tries the copied login.`;
  if (event.session && event.jwt) {
    return `${when} Both work, because Alice is still logged in. Log her out and try again.`;
  }
  if (event.jwt) {
    return `${when} Session: 401, the record is gone. JWT: 200, the server sees a valid signature and an expiry in the future.`;
  }
  return `${when} Both fail. The session was deleted at logout, and the JWT expired at 6:00 pm.`;
}

function Hit({ at, inside }) {
  return (
    <span className={`af-hit${inside ? ' is-in' : ''}`} style={{ left: percent(at) }}>
      {inside ? '200 in' : '401'}
    </span>
  );
}

export function AuthLogoutRace() {
  const record = useRecordMode('auth-logout-race');
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loggedOutAt, setLoggedOutAt] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [last, setLast] = useState(null);
  const scriptIndex = useRef(0);

  const sessionEnd = loggedOutAt ?? EXPIRES;

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
    if (now >= END) {
      setPlaying(false);
    }
  }, [now]);

  function reset() {
    setNow(0);
    setPlaying(false);
    setLoggedOutAt(null);
    setAttempts([]);
    setLast(null);
    scriptIndex.current = 0;
  }

  function logOut(at = now) {
    if (loggedOutAt !== null || at >= EXPIRES) {
      return;
    }
    setLoggedOutAt(at);
    setLast({ type: 'logout', at });
    setPlaying(true);
  }

  function attempt(at = now) {
    const event = { type: 'attempt', at, session: at < sessionEnd, jwt: at < EXPIRES };
    setAttempts((current) => [...current, event]);
    setLast(event);
    setPlaying(true);
  }

  // Record mode plays a fixed script, then loops.
  useEffect(() => {
    if (!record) {
      return undefined;
    }
    if (now === 0 && !playing) {
      const timer = setTimeout(() => setPlaying(true), 800);
      return () => clearTimeout(timer);
    }
    const next = RECORD_SCRIPT[scriptIndex.current];
    if (next && now >= next.at) {
      scriptIndex.current += 1;
      if (next.type === 'logout') {
        logOut(next.at);
      } else {
        attempt(next.at);
      }
    }
    if (now >= END) {
      const timer = setTimeout(reset, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
    // logOut and attempt read the latest state on each render, so they don't need to be deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, now, playing]);

  const bad = last?.type === 'attempt' && last.jwt && !last.session;
  const status = describe(last);
  const lastKey = last ? `${last.type}-${last.at}` : 'start';

  const board = (
    <div className="sim-board af-race" aria-hidden="true">
      <span className="sim-label af-lane-label">Alice</span>
      <span className="sim-lane">
        <span className="af-event" style={{ left: percent(0) }}>
          logs in
        </span>
        {loggedOutAt !== null && (
          <span className="af-event is-out" style={{ left: percent(loggedOutAt) }}>
            logs out
          </span>
        )}
      </span>

      <span className="sim-label af-lane-label">
        <i className="af-swatch is-db" /> Session
      </span>
      <span className="sim-lane">
        <span className={`sim-bar sim-bar-db${loggedOutAt !== null ? ' is-cut' : ''}`} style={{ left: 0, width: percent(sessionEnd) }} />
        {attempts.map((event) => (
          <Hit key={event.at} at={event.at} inside={event.session} />
        ))}
      </span>

      <span className="sim-label af-lane-label">
        <i className="af-swatch is-jwt" /> JWT
      </span>
      <span className="sim-lane">
        <span className="sim-bar sim-bar-cookie" style={{ left: 0, width: percent(EXPIRES) }} />
        {attempts.map((event) => (
          <Hit key={event.at} at={event.at} inside={event.jwt} />
        ))}
      </span>

      <span className="sim-axis">
        {[0, 20, 40, 60].map((m) => (
          <span key={m} style={{ left: percent(m) }}>
            {clock(m).replace(' pm', '')}
          </span>
        ))}
        <span style={{ left: percent(END) }}>{clock(END).replace(' pm', '')}</span>
      </span>

      {loggedOutAt !== null && <span className="af-marker is-logout" style={{ '--at': loggedOutAt / END }} />}
      <span className="af-marker is-expiry" style={{ '--at': EXPIRES / END }} />
      <span className="sim-now" style={{ '--now': now / END }} />
    </div>
  );

  if (record) {
    return (
      <RecordFrame title="Logging out doesn’t stop a JWT" caption={status} captionKey={lastKey}>
        <p className="sim-clock af-reel-clock">{clock(now)}</p>
        {board}
      </RecordFrame>
    );
  }

  return (
    <figure className="sim af">
      <div className="sim-head">
        <span className="af-legend">
          <span>
            <i className="af-swatch is-in" /> attacker got in
          </span>
          <span>
            <i className="af-swatch is-out" /> attacker blocked
          </span>
        </span>
        <span className="sim-clock" aria-label={`Simulated time ${clock(now)}`}>
          {clock(now)}
        </span>
      </div>

      {board}

      <p key={lastKey} className={`sim-status af-fade-in${bad ? ' is-bad' : ''}`} aria-live="polite">
        {status}
      </p>

      <div className="sim-controls">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => logOut()} disabled={loggedOutAt !== null || now >= EXPIRES}>
          Log Alice out
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => attempt()}
          disabled={now >= END || attempts.some((event) => event.at === now)}
        >
          Attacker uses copied login
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlaying((current) => !current)} disabled={now >= END}>
          {playing ? 'Pause clock' : 'Start clock'}
        </button>
        <button type="button" className="text-link sim-reset" onClick={reset}>
          Reset
        </button>
      </div>

      <figcaption>
        Each simulated minute takes 0.4 seconds. Both logins were set to last until 6:00 pm (the dashed line). Try the
        attacker before logout, after logout, and after 6:00.
      </figcaption>
    </figure>
  );
}
