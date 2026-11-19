import Link from 'next/link';

import { ShareButton } from '@/components/blog/ShareButton';
import { NoteCards } from '@/components/notes/NoteList';
import { COHORT_NAME, COHORT_PATH, getAllNotes, groupByWeek } from '@/lib/notes';

const SITE_URL = 'https://buildwithvibs.in';
const title = `${COHORT_NAME} · Notes · Vibhavari Bellutagi`;
const description = `What I'm learning in the ${COHORT_NAME}, week by week.`;

export const metadata = {
  title,
  description,
  alternates: { canonical: COHORT_PATH },
  openGraph: { url: COHORT_PATH, title, description },
  twitter: { card: 'summary_large_image', title, description },
};

export default async function CohortPage() {
  const notes = (await getAllNotes()).filter((note) => note.status === 'published');
  const weeks = groupByWeek(notes);
  const total = weeks.reduce((sum, { notes: items }) => sum + items.length, 0);

  return (
    <main className="section cohort-page">
      <div className="container container-blog">
        <Link className="text-link back-link" href="/notes/">
          ← All notes
        </Link>
        <div className="section-head">
          <p className="eyebrow">Learning in public</p>
          <h1>{COHORT_NAME}</h1>
          <p className="section-lede">
            What I learn in the cohort, week by week: one note per session or exercise, in my own words. Each week has
            its own link to share.
          </p>
          <div className="cohort-head-actions">
            <p className="post-meta">
              {weeks.length > 0
                ? `${weeks.length} ${weeks.length === 1 ? 'week' : 'weeks'} · ${total} ${total === 1 ? 'note' : 'notes'}`
                : 'Starting January 2027'}
            </p>
            <ShareButton
              title={`My notes from the ${COHORT_NAME}, week by week`}
              text={description}
              url={`${SITE_URL}${COHORT_PATH}`}
            />
          </div>
        </div>

        {weeks.length === 0 ? (
          <p className="cohort-empty">
            The cohort starts in January 2027. Notes appear here as I go; until then, the{' '}
            <Link href="/notes/">daily notes</Link> are where I&rsquo;m writing.
          </p>
        ) : (
          <ol className="cohort-weeks">
            {weeks.map(({ week, notes: items }) => (
              <li key={week} id={`week-${week}`} className="cohort-week">
                <div className="cohort-week-head">
                  <h2>
                    <a href={`#week-${week}`}>Week {week}</a>
                  </h2>
                  <span className="post-meta">
                    {items.length} {items.length === 1 ? 'note' : 'notes'}
                  </span>
                  <ShareButton
                    title={`${COHORT_NAME}, week ${week}: what I learned`}
                    text={items.map((note) => note.title).join(' · ')}
                    url={`${SITE_URL}${COHORT_PATH}#week-${week}`}
                  />
                </div>
                <NoteCards notes={items} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
