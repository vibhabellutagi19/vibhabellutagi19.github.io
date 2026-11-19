// Reading streak for /notes: which days I published a note, and how many days in a row.
// Dates are plain "YYYY-MM-DD" days, handled as UTC so no time zone can shift a day.

const DAY_MS = 86_400_000;

function toTime(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function toIso(time) {
  return new Date(time).toISOString().slice(0, 10);
}

/** The reader's local day as "YYYY-MM-DD". */
export function localToday(now = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** `{ "2026-11-19": 2, ... }`: notes per day. */
export function countByDay(dates) {
  return dates.reduce((counts, date) => ({ ...counts, [date]: (counts[date] ?? 0) + 1 }), {});
}

/**
 * Streaks in days. The current streak still counts if today has no note yet but yesterday did,
 * so it doesn't read 0 every morning before I've written.
 */
export function computeStreaks(dates, today) {
  const days = [...new Set(dates)].map(toTime).sort((a, b) => a - b);
  if (days.length === 0) {
    return { current: 0, longest: 0, activeDays: 0 };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const todayTime = toTime(today);
  const set = new Set(days);
  let cursor = set.has(todayTime) ? todayTime : todayTime - DAY_MS;
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor -= DAY_MS;
  }

  return { current, longest, activeDays: days.length };
}

/**
 * A calendar like GitHub's: `weeks` columns, Monday to Sunday, ending with the week of `today`.
 * Each day is `{ date, count, future }`; days after today are marked `future`.
 */
export function buildCalendar(dates, today, weeks = 26) {
  const counts = countByDay(dates);
  const todayTime = toTime(today);
  const weekday = (new Date(todayTime).getUTCDay() + 6) % 7; // Monday = 0
  const start = todayTime - (weekday + (weeks - 1) * 7) * DAY_MS;

  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (__, day) => {
      const time = start + (week * 7 + day) * DAY_MS;
      const date = toIso(time);
      return { date, count: counts[date] ?? 0, future: time > todayTime };
    })
  );
}

/** Colour step for a day: 0 (none) to 3 (three or more notes). */
export function level(count) {
  return Math.min(3, count);
}
