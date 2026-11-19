'use client';

import { useEffect, useRef, useState } from 'react';

import { buildCalendar, computeStreaks, level, localToday } from '@/lib/streak';

const WEEKS = 26;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDay(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/**
 * Days I published a note, like GitHub's contribution graph, plus the streak.
 * Rendered in the browser: "today" is the reader's day, not the day the site was built,
 * so the streak never goes stale between deploys. Space is reserved, so nothing jumps.
 */
export function NotesActivity({ dates }) {
  const [today, setToday] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    setToday(localToday());
  }, []);

  useEffect(() => {
    // On narrow screens the grid scrolls; start at the most recent weeks.
    if (today && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [today]);

  if (!today) {
    return <section className="notes-activity is-loading" aria-hidden="true" />;
  }

  const calendar = buildCalendar(dates, today, WEEKS);
  const { current, longest, activeDays } = computeStreaks(dates, today);
  // A label where a month starts, but never closer than 3 columns to the last one (each is ~3 wide).
  let lastLabel = -3;
  const monthLabels = calendar.map((week, index) => {
    const month = week[0].date.slice(5, 7);
    const starts = index === 0 || month !== calendar[index - 1][0].date.slice(5, 7);
    const nextStart = calendar.findIndex((w, i) => i > index && w[0].date.slice(5, 7) !== month);
    // Skip a first-column label when the next month starts right after it.
    const crowded = index === 0 && nextStart !== -1 && nextStart < 3;
    if (!starts || crowded || index - lastLabel < 3) return '';
    lastLabel = index;
    return MONTHS[Number(month) - 1];
  });

  return (
    <section className="notes-activity" aria-labelledby="activity-title">
      <div className="activity-head">
        <h2 id="activity-title" className="eyebrow">
          Reading streak
        </h2>
        <dl className="activity-stats">
          <div>
            <dt>Current</dt>
            <dd>
              {current} {current === 1 ? 'day' : 'days'}
            </dd>
          </div>
          <div>
            <dt>Longest</dt>
            <dd>
              {longest} {longest === 1 ? 'day' : 'days'}
            </dd>
          </div>
          <div>
            <dt>Days with a note</dt>
            <dd>{activeDays}</dd>
          </div>
        </dl>
      </div>

      <div className="activity-scroll" ref={scrollRef}>
        <div
          className="activity-grid"
          role="img"
          aria-label={`Notes published over the last ${WEEKS} weeks: ${activeDays} days with a note, current streak ${current} days.`}
          style={{ '--weeks': WEEKS }}
        >
          {monthLabels.map((label, index) => (
            <span key={`m${index}`} className="activity-month" style={{ gridColumn: index + 1 }} aria-hidden="true">
              {label}
            </span>
          ))}
          {calendar.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <span
                key={day.date}
                className={`activity-day level-${day.future ? 'future' : level(day.count)}`}
                style={{ gridColumn: weekIndex + 1, gridRow: dayIndex + 2 }}
                title={
                  day.future
                    ? undefined
                    : `${formatDay(day.date)}: ${day.count === 0 ? 'no notes' : `${day.count} ${day.count === 1 ? 'note' : 'notes'}`}`
                }
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
