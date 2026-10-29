'use client';

import { isFinished, isInProgress, useReadingState } from '@/lib/reading-state';

/** "✓ Read" or "40% read" beside a post in a list, from this reader's own history. */
export function ReadMark({ slug }) {
  const { progress } = useReadingState();
  const entry = progress[slug];

  if (isFinished(entry)) {
    return <span className="read-mark is-done">✓ Read</span>;
  }
  if (isInProgress(entry)) {
    return <span className="read-mark">{Math.round(entry.percent * 100)}% read</span>;
  }
  return null;
}
