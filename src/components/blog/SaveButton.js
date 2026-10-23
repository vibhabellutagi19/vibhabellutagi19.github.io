'use client';

import { toggleSaved, useReadingState } from '@/lib/reading-state';

/** Saves the post to the reader's list on /blog (kept in their browser only). */
export function SaveButton({ slug }) {
  const { saved } = useReadingState();
  const isSaved = Boolean(saved[slug]);

  return (
    <button
      type="button"
      className="save-button"
      aria-pressed={isSaved}
      aria-label="Save for later"
      title={isSaved ? 'Saved. Find it under Saved on the blog page' : 'Save for later'}
      onClick={() => toggleSaved(slug)}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  );
}
