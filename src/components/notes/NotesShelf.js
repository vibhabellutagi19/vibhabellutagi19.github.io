'use client';

import Link from 'next/link';

import { isInProgress, useReadingState } from '@/lib/reading-state';
import { noteStateKey } from '@/lib/note-keys';

/** "Continue reading" and "Saved" for this reader, from their own browser. Hidden when both are empty. */
export function NotesShelf({ notes }) {
  const { progress, saved } = useReadingState();
  const inProgress = notes
    .filter((note) => isInProgress(progress[noteStateKey(note.slug)]))
    .sort((a, b) => progress[noteStateKey(b.slug)].updatedAt - progress[noteStateKey(a.slug)].updatedAt)
    .slice(0, 3);
  const savedNotes = notes
    .filter((note) => saved[noteStateKey(note.slug)])
    .sort((a, b) => saved[noteStateKey(b.slug)] - saved[noteStateKey(a.slug)]);

  if (inProgress.length === 0 && savedNotes.length === 0) {
    return null;
  }

  return (
    <div className="notes-shelf">
      {inProgress.length > 0 && (
        <section aria-labelledby="shelf-continue">
          <h2 id="shelf-continue" className="eyebrow">
            Continue reading
          </h2>
          <ul>
            {inProgress.map((note) => (
              <li key={note.slug}>
                <Link href={`${note.href}#continue`}>{note.title}</Link>
                <span className="post-meta">
                  {Math.round(progress[noteStateKey(note.slug)].percent * 100)}% read
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {savedNotes.length > 0 && (
        <section aria-labelledby="shelf-saved">
          <h2 id="shelf-saved" className="eyebrow">
            Saved
          </h2>
          <ul>
            {savedNotes.map((note) => (
              <li key={note.slug}>
                <Link href={note.href}>{note.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
