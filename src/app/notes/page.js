import Link from 'next/link';

import { NoteList } from '@/components/notes/NoteList';
import { NotesActivity } from '@/components/notes/NotesActivity';
import { NotesShelf } from '@/components/notes/NotesShelf';
import { COHORT_NAME, COHORT_PATH, countNoteTags, getAllNotes, groupByWeek, noteHref, noteTagHref } from '@/lib/notes';
import { formatTag } from '@/lib/posts';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

const title = 'Notes · Vibhavari Bellutagi';
const description =
  'My second brain: short, linked notes on the engineering blogs I read every day and what I learn along the way.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/notes/' },
  openGraph: { images: SITE_OG_IMAGES, url: '/notes/', title, description },
  twitter: { card: 'summary_large_image', images: SITE_TWITTER_IMAGES, title, description },
};

export default async function NotesIndexPage() {
  const notes = await getAllNotes();
  const concepts = notes.filter((note) => note.type === 'concept').sort((a, b) => a.title.localeCompare(b.title));
  const tagLabels = Object.fromEntries(notes.flatMap((note) => note.tags).map((tag) => [tag, formatTag(tag)]));
  const sources = notes.filter((note) => note.type === 'source').length;
  const publishedDates = notes.filter((note) => note.status === 'published').map((note) => note.date);
  // Only what the browser-side shelf needs, so the page doesn't ship every note's content.
  const shelf = notes.map(({ slug, title }) => ({ slug, title, href: noteHref(slug) }));
  const topics = countNoteTags(notes.filter((note) => note.status === 'published'));
  const cohortWeeks = groupByWeek(notes.filter((note) => note.status === 'published')).length;

  return (
    <main className="section notes-index">
      <div className="container">
        <div className="blog-head">
          <div>
            <p className="eyebrow">Second brain</p>
            <h1>
              What I&rsquo;m <span className="serif">learning,</span> one note at a time.
            </h1>
            <p className="section-lede">
              I read one engineering blog a day and write down what I understood: the idea, how it works, what it
              trades away, and the questions it left me with. Notes link to each other, so ideas build up over time.
              For what I&rsquo;ve found while building software myself, read the <Link href="/blog/">blog</Link>.
            </p>
          </div>
          <p className="post-meta notes-count">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} · {sources} {sources === 1 ? 'blog' : 'blogs'} read
          </p>
        </div>

        <NotesActivity dates={publishedDates} />

        <Link className="cohort-callout" href={COHORT_PATH}>
          <span className="eyebrow">{COHORT_NAME}</span>
          <span className="cohort-callout-text">
            {cohortWeeks > 0
              ? `${cohortWeeks} ${cohortWeeks === 1 ? 'week' : 'weeks'} of notes from the cohort, week by week`
              : 'Notes from the cohort, week by week. Starting January 2027.'}
          </span>
          <span className="text-link" aria-hidden="true">
            →
          </span>
        </Link>
        <NotesShelf notes={shelf} />

        <div className="notes-layout">
          <section aria-label="All notes">
            {notes.length > 0 ? (
              <NoteList notes={notes} tagLabels={tagLabels} />
            ) : (
              <p className="section-lede">The first note is on its way.</p>
            )}
          </section>

          {(concepts.length > 0 || topics.length > 0) && (
            <aside className="notes-aside">
              {concepts.length > 0 && (
                <section aria-labelledby="concepts-title">
                  <h2 id="concepts-title" className="eyebrow">
                    Concepts
                  </h2>
                  <ul className="concept-index">
                    {concepts.map((concept) => (
                      <li key={concept.slug}>
                        <Link href={noteHref(concept.slug)}>{concept.title}</Link>
                        <span className="post-meta">{concept.backlinks.length}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {topics.length > 0 && (
                <section aria-labelledby="topics-title">
                  <h2 id="topics-title" className="eyebrow">
                    <Link href="/notes/tags/">Topics</Link>
                  </h2>
                  <p className="post-tags notes-topics">
                    {topics.map(({ tag, count }) => (
                      <Link key={tag} className="tag-chip" href={noteTagHref(tag)}>
                        {formatTag(tag)} · {count}
                      </Link>
                    ))}
                  </p>
                </section>
              )}
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
