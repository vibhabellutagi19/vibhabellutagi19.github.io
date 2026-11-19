import { describe, expect, it } from 'vitest';

import { buildCalendar, computeStreaks, countByDay, level, localToday } from '../streak';

describe('computeStreaks', () => {
  it('is all zero with no notes', () => {
    expect(computeStreaks([], '2026-11-19')).toEqual({ current: 0, longest: 0, activeDays: 0 });
  });

  it('counts the run ending today, ignoring duplicate days', () => {
    const dates = ['2026-11-17', '2026-11-18', '2026-11-19', '2026-11-19'];
    expect(computeStreaks(dates, '2026-11-19')).toEqual({ current: 3, longest: 3, activeDays: 3 });
  });

  it("keeps the streak alive when today's note isn't written yet", () => {
    expect(computeStreaks(['2026-11-17', '2026-11-18'], '2026-11-19').current).toBe(2);
  });

  it('breaks the streak after a missed day', () => {
    expect(computeStreaks(['2026-11-16', '2026-11-17'], '2026-11-19').current).toBe(0);
  });

  it('finds the longest run anywhere, across month ends', () => {
    const dates = ['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-10', '2026-11-19'];
    expect(computeStreaks(dates, '2026-11-19')).toEqual({ current: 1, longest: 4, activeDays: 6 });
  });
});

describe('buildCalendar', () => {
  it('ends with the week of today, Monday first, and marks future days', () => {
    // 2026-11-19 is a Thursday.
    const calendar = buildCalendar(['2026-11-19', '2026-11-19', '2026-11-16'], '2026-11-19', 2);
    const lastWeek = calendar[1];

    expect(calendar).toHaveLength(2);
    expect(lastWeek[0].date).toBe('2026-11-16');
    expect(lastWeek[0].count).toBe(1);
    expect(lastWeek[3]).toEqual({ date: '2026-11-19', count: 2, future: false });
    expect(lastWeek[4].future).toBe(true);
    expect(calendar[0][0].date).toBe('2026-11-09');
  });
});

describe('helpers', () => {
  it('counts notes per day and caps the colour level', () => {
    expect(countByDay(['a', 'b', 'a'])).toEqual({ a: 2, b: 1 });
    expect([0, 1, 2, 3, 7].map(level)).toEqual([0, 1, 2, 3, 3]);
  });

  it('formats the local day', () => {
    expect(localToday(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});
