import Link from 'next/link';

import { ReadMark } from '@/components/blog/ReadMark';
import { noteStateKey } from '@/lib/note-keys';
import { noteHref } from '@/lib/notes';

function NoteMeta({ note }) {
  return (
    <span className="post-meta note-meta">
      <span className={`note-type note-type-${note.type}`}>
        {note.typeLabel}
        {note.cohortWeek ? ` · Week ${note.cohortWeek}` : ''}
      </span>
      {note.displayDate} · {note.readTime}
      {note.status === 'draft' && <span className="note-draft-badge">Draft</span>}
      <ReadMark slug={noteStateKey(note.slug)} />
    </span>
  );
}

/** Notes newest first, one row each. */
export function NoteList({ notes, tagLabels = {} }) {
  return (
    <ul className="post-list note-list">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link className="post-item" href={noteHref(note.slug)}>
            <NoteMeta note={note} />
            <span className="post-title">{note.title}</span>
            {note.summary && <span className="post-excerpt">{note.summary}</span>}
            {note.tags.length > 0 && (
              <ul className="tags post-row-tags">
                {note.tags.map((tag) => (
                  <li key={tag}>{tagLabels[tag] || tag}</li>
                ))}
              </ul>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Small cards: the home page's "Latest notes" and a note's backlinks and related notes. */
export function NoteCards({ notes }) {
  return (
    <ul className="note-cards">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link className="note-card" href={noteHref(note.slug)}>
            <span className={`note-type note-type-${note.type}`}>{note.typeLabel}</span>
            <span className="note-card-title">{note.title}</span>
            {note.summary && <span className="note-card-summary">{note.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
