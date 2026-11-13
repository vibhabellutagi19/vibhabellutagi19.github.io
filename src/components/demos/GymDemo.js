'use client';

import { Tick, useStepLoop } from './useStepLoop';

// 0 idle · 1 book pressed · 2 booking · 3 booked + toast · 4–5 hold · 6 toast out
const DURATIONS = [1500, 450, 900, 1300, 1300, 1300, 900];

const OTHER_CLASSES = [
  { time: '18:00', name: 'Strength', spots: '10/10', fill: 100, full: true },
  { time: '19:30', name: 'Mobility', spots: '2/8', fill: 25 },
];

/** Book a class, watch a credit drop and the spot count tick up. */
export function GymDemo() {
  const [ref, step] = useStepLoop(DURATIONS, 4);
  const booked = step >= 3;
  const pressed = step === 1;
  const busy = step === 1 || step === 2;
  const toast = step >= 3 && step <= 5;

  return (
    <div className="demo gd" ref={ref} aria-hidden="true">
      <div className="gd-inner">
        <div className="gd-head">
          <span>Today · Tue</span>
          <span className="gd-credits">
            Credits <b><Tick value={booked ? '15' : '16'} /></b>
          </span>
        </div>

        <ul className="gd-rows">
          <li className={step >= 1 ? 'is-active' : ''}>
            <span className="gd-time">06:30</span>
            <span className="gd-name">Small Group PT</span>
            <span className="gd-spots">
              <span className="gd-bar">
                <span style={{ width: booked ? '83%' : '66%' }} />
              </span>
              <Tick value={booked ? '5/6' : '4/6'} />
            </span>
            <span className={`gd-btn${busy ? ' is-busy' : ''}${booked ? ' is-done' : ''}${pressed ? ' is-pressed' : ''}`}>
              {booked ? 'Booked' : step === 2 ? 'Booking…' : 'Book'}
            </span>
          </li>
          {OTHER_CLASSES.map((item) => (
            <li key={item.time}>
              <span className="gd-time">{item.time}</span>
              <span className="gd-name">{item.name}</span>
              <span className="gd-spots">
                <span className="gd-bar">
                  <span style={{ width: `${item.fill}%` }} />
                </span>
                {item.spots}
              </span>
              <span className={`gd-btn${item.full ? ' is-full' : ''}`}>{item.full ? 'Full' : 'Book'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`demo-toast gd-toast${toast ? ' is-on' : ''}`}>
        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        Booked · Small Group PT, 06:30 · 1 credit used
      </div>
    </div>
  );
}
