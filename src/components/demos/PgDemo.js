'use client';

import { Tick, useStepLoop } from './useStepLoop';

// 0 idle · 1 due bed highlighted · 2 rent received · 3 vacant bed highlighted · 4 move-in · 5 hold
const DURATIONS = [1500, 900, 1300, 900, 1500, 1300];

// p = paid, d = rent due, v = vacant. Bed 4 pays, then bed 2 gets a tenant.
const FLOOR = 'ppvpdpppvpppdppvppppvpdp'.split('');
const PAYING_BED = 4;
const MOVE_IN_BED = 2;

/** A floor of beds: due rent gets paid, then a vacant bed fills. */
export function PgDemo() {
  const [ref, step] = useStepLoop(DURATIONS, 4);

  const beds = FLOOR.map((status, index) => {
    if (index === PAYING_BED && step >= 2) return 'p';
    if (index === MOVE_IN_BED && step >= 4) return 'p';
    return status;
  });
  const hot = step === 1 || step === 2 ? PAYING_BED : step === 3 || step === 4 ? MOVE_IN_BED : -1;
  const occupied = beds.filter((status) => status !== 'v').length;
  const event = hot === PAYING_BED ? 'Rent received · 2E' : hot === MOVE_IN_BED ? 'Move-in · 2C' : 'Beds';

  return (
    <div className="demo pd" ref={ref} aria-hidden="true">
      <div className="pd-inner">
        <div className="pd-head">
          <span>
            Floor 2 · <Tick value={event} />
          </span>
          <span>
            <Tick value={`${occupied}/24`} /> occupied · <Tick value={step >= 2 ? '₹1,92,500' : '₹1,84,000'} />
          </span>
        </div>

        <ul className="pd-beds">
          {beds.map((status, index) => (
            <li key={index} className={`pd-bed is-${status}${index === hot ? ' is-hot' : ''}`} />
          ))}
        </ul>

        <ul className="pd-legend">
          <li>
            <i className="is-p" />
            Paid
          </li>
          <li>
            <i className="is-d" />
            Due
          </li>
          <li>
            <i className="is-v" />
            Vacant
          </li>
        </ul>
      </div>
    </div>
  );
}
