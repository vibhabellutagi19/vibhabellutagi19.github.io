'use client';

import { Tick, useStepLoop } from './useStepLoop';

// 0 idle · 1 buy pressed · 2 Razorpay checkout · 3 payment success · 4 credits added
// 5 book pressed · 6 booked + toast · 7 hold
const DURATIONS = [1500, 450, 1500, 1200, 1300, 450, 2400, 800];

export function MoveDemo() {
  const [ref, step] = useStepLoop(DURATIONS, 6);
  const hasPlan = step >= 4;
  const booked = step >= 6;
  const credits = booked ? '15' : hasPlan ? '16' : '0';

  return (
    <div className="demo mv" ref={ref} aria-hidden="true">
      <div className="mv-head">
        <span className="mv-brand">MOVE</span>
        <span className="mv-credits">
          Credits <b><Tick value={credits} /></b>
        </span>
      </div>

      <div className="mv-main">
        <div className="mv-panel">
          <p className="mv-label">Today · Tue</p>
          <ul className="mv-classes">
            <li className={step === 5 || booked ? 'is-active' : ''}>
              <span className="mv-time">06:30</span>
              <span className="mv-class">
                <i className="mv-dot mv-sgpt" />
                Small Group PT
                <span className="mv-spots">
                  <span className="mv-bar">
                    <span style={{ width: booked ? '83%' : '66%' }} />
                  </span>
                  <Tick value={booked ? '5/6' : '4/6'} />
                </span>
              </span>
              <span
                className={`mv-btn${hasPlan ? '' : ' is-off'}${step === 5 ? ' is-pressed' : ''}${
                  booked ? ' is-done' : ''
                }`}
              >
                {booked ? 'Booked ✓' : 'Book'}
              </span>
            </li>
            <li>
              <span className="mv-time">07:30</span>
              <span className="mv-class">
                <i className="mv-dot mv-cond" />
                Conditioning
                <span className="mv-spots">
                  <span className="mv-bar">
                    <span style={{ width: '38%' }} />
                  </span>
                  3/8
                </span>
              </span>
              <span className={`mv-btn${hasPlan ? '' : ' is-off'}`}>Book</span>
            </li>
            <li>
              <span className="mv-time">18:00</span>
              <span className="mv-class">
                <i className="mv-dot mv-pt" />
                PT 1:1
                <span className="mv-spots">
                  <span className="mv-bar">
                    <span style={{ width: '100%' }} />
                  </span>
                  Full
                </span>
              </span>
              <span className="mv-btn is-off">Full</span>
            </li>
            <li>
              <span className="mv-time">19:30</span>
              <span className="mv-class">
                <i className="mv-dot mv-sgpt" />
                Small Group PT
                <span className="mv-spots">
                  <span className="mv-bar">
                    <span style={{ width: '33%' }} />
                  </span>
                  2/6
                </span>
              </span>
              <span className={`mv-btn${hasPlan ? '' : ' is-off'}`}>Book</span>
            </li>
          </ul>
        </div>

        <div className="mv-panel mv-plan">
          <p className="mv-label">My plan</p>
          {hasPlan ? (
            <div key="active" className="tick">
              <p className="mv-plan-name">Small Group</p>
              <p className="mv-plan-meta">16 sessions · Active</p>
              <span className="mv-status">● Active</span>
              {booked && (
                <div className="mv-next tick">
                  <small>Next session</small>
                  <b>Today · 06:30</b>
                  <span>Small Group PT</span>
                </div>
              )}
            </div>
          ) : (
            <div key="none">
              <p className="mv-plan-name">No active plan</p>
              <p className="mv-plan-meta">Buy a pack to book classes</p>
              <span className={`mv-buy${step === 1 ? ' is-pressed' : ''}`}>Buy · ₹5,000</span>
            </div>
          )}
        </div>
      </div>

      <div className={`rzp${step === 2 || step === 3 ? ' is-on' : ''}`}>
        <div className="rzp-card">
          <div className="rzp-top">
            <b>Razorpay</b>
            <small>Move · The Movement Clan</small>
          </div>
          {step === 3 ? (
            <div key="ok" className="rzp-ok tick">
              <span className="rzp-tick">✓</span>
              Payment successful
              <small>₹5,000 · UPI</small>
            </div>
          ) : (
            <div key="pay" className="rzp-pay">
              <p className="rzp-amount">₹5,000</p>
              <p className="rzp-method">
                UPI <span>selected</span>
              </p>
              <span className="rzp-btn">Pay ₹5,000</span>
            </div>
          )}
        </div>
      </div>

      <div className={`demo-toast mv-toast${step === 6 ? ' is-on' : ''}`}>
        <span className="demo-check">✓</span> Booked · Small Group PT, 06:30
      </div>
    </div>
  );
}
