import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AuthorCard } from '@/components/blog/AuthorCard';
import { CodeCopy } from '@/components/blog/CodeCopy';
import { ImageZoom } from '@/components/blog/ImageZoom';
import { LikeButton } from '@/components/blog/LikeButton';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ResumeReading } from '@/components/blog/ResumeReading';
import { SaveButton } from '@/components/blog/SaveButton';
import { SelectionShare } from '@/components/blog/SelectionShare';
import { ShareButton } from '@/components/blog/ShareButton';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { NoteCards } from '@/components/notes/NoteList';
import { profile } from '@/data/site';
import { noteLikeKey, noteStateKey } from '@/lib/note-keys';
import {
  COHORT_NAME,
  cohortWeekHref,
  getAllNotes,
  getNoteBySlug,
  getRelatedNotes,
  noteHref,
  noteTagHref,
  renderInline,
} from '@/lib/notes';
import { formatTag, getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://buildwithvibs.in';

export const dynamicParams = false;

// A static export refuses a dynamic route with no pages, which would break the whole site's build
// on a day with only drafts. A placeholder slug that renders as not-found keeps it building.
const NO_NOTES = '_none';

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.length > 0 ? notes.map((note) => ({ slug: note.slug })) : [{ slug: NO_NOTES }];
}

function sourceHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) {
    return {};
  }

  const title = `${note.title} · Notes · Vibhavari Bellutagi`;
  const description = note.summary;
  const path = noteHref(note.slug);

  return {
    title,
    description,
    keywords: note.tags.map(formatTag),
    authors: [{ name: profile.name, url: SITE_URL }],
    alternates: { canonical: path },
    // Drafts only exist in `next dev`, but keep them out of search engines regardless.
    robots: note.status === 'draft' ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      publishedTime: note.date,
      authors: [profile.name],
      tags: note.tags.map(formatTag),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function NotePage({ params }) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) {
    notFound();
  }

  const notes = await getAllNotes();
  const related = getRelatedNotes(notes, note);
  const posts = await getAllPosts();
  const usedIn = note.blogPosts.map((postSlug) => posts.find((post) => post.slug === postSlug)).filter(Boolean);
  const url = `${SITE_URL}${noteHref(note.slug)}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.title,
    description: note.summary,
    datePublished: note.date,
    url,
    mainEntityOfPage: url,
    image: `${url}opengraph-image`,
    keywords: note.tags.map(formatTag).join(', '),
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    ...(note.sourceUrl ? { isBasedOn: note.sourceUrl } : {}),
  };

  return (
    <main className="section post-page note-page">
      <script
        type="application/ld+json"
        // JSON.stringify doesn't escape "<", so a title containing "</script>" could break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <ReadingProgress targetId="note-body" />
      <ResumeReading slug={noteStateKey(note.slug)} targetId="note-body" />
      <CodeCopy />
      <ImageZoom targetId="note-body" />
      <SelectionShare targetId="note-body" url={url} />

      <div className="container article-layout">
        <article className="article" data-pagefind-filter="type:Notes" data-pagefind-body={note.status === 'published' ? '' : undefined}>
          <header className="article-head">
            <p className="eyebrow" data-pagefind-ignore>
              <Link href="/notes/">Notes</Link> ·{' '}
              {note.type === 'cohort' && note.cohortWeek ? (
                <Link href={cohortWeekHref(note.cohortWeek)}>
                  {COHORT_NAME} · Week {note.cohortWeek}
                </Link>
              ) : (
                note.typeLabel
              )}
              {note.status === 'draft' && <span className="note-draft-badge">Draft, only visible locally</span>}
            </p>
            <h1>{note.title}</h1>
            {note.summary && note.type !== 'quick' && <p className="note-lede">{note.summary}</p>}
            <div className="article-tools" data-pagefind-ignore>
              <div className="byline">
                <Image className="byline-photo" src={profile.avatar} alt="" width={44} height={44} />
                <div>
                  <p className="byline-name">{profile.name}</p>
                  <p className="post-meta">
                    {note.displayDate} · {note.readTime}
                  </p>
                </div>
              </div>
              <div className="post-actions">
                {note.status === 'published' && <LikeButton slug={noteLikeKey(note.slug)} />}
                <SaveButton slug={noteStateKey(note.slug)} hint="Saved. Find it under Saved on the notes page" />
                <ShareButton title={note.tweet || note.title} text={note.summary} url={url} />
              </div>
            </div>

            {(note.sourceUrl || note.aiAssisted) && (
              <div className="note-provenance" data-pagefind-ignore>
                {note.sourceUrl && (
                  <p>
                    <span className="note-provenance-label">Notes on</span>{' '}
                    <a href={note.sourceUrl} target="_blank" rel="noreferrer">
                      {note.sourceAuthor ? `${note.sourceAuthor} · ` : ''}
                      {sourceHost(note.sourceUrl)} ↗
                    </a>
                  </p>
                )}
                {note.aiAssisted && (
                  <p className="note-ai">Drafted with AI from my own explanation, then checked by me.</p>
                )}
              </div>
            )}
          </header>

          <div data-pagefind-ignore>
            <TableOfContents headings={note.headings} variant="inline" />
          </div>

          <div id="note-body" className="article-content">
            <div className="article-html" dangerouslySetInnerHTML={{ __html: note.html }} />
          </div>

          {note.recall.length > 0 && (
            <section className="note-section recall" aria-labelledby="recall-title">
              <h2 id="recall-title" className="note-section-title">
                Test yourself
              </h2>
              <p className="note-section-hint">Answer in your head, then open the card.</p>
              <ol className="recall-cards">
                {note.recall.map((card) => (
                  <li key={card.q}>
                    <details className="recall-card">
                      <summary dangerouslySetInnerHTML={{ __html: renderInline(card.q) }} />
                      <p dangerouslySetInnerHTML={{ __html: renderInline(card.a) }} />
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {usedIn.length > 0 && (
            <section className="note-section" aria-labelledby="used-title" data-pagefind-ignore>
              <h2 id="used-title" className="note-section-title">
                Where I used this
              </h2>
              <ul className="note-used">
                {usedIn.map((post) => (
                  <li key={post.slug}>
                    <Link className="text-link" href={`/blog/${post.slug}/`}>
                      {post.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {note.backlinks.length > 0 && (
            <section className="note-section" aria-labelledby="backlinks-title" data-pagefind-ignore>
              <h2 id="backlinks-title" className="note-section-title">
                Mentioned in
              </h2>
              <NoteCards notes={note.backlinks} />
            </section>
          )}

          {related.length > 0 && (
            <section className="note-section" aria-labelledby="related-title" data-pagefind-ignore>
              <h2 id="related-title" className="note-section-title">
                Related notes
              </h2>
              <NoteCards notes={related} />
            </section>
          )}

          {note.tags.length > 0 && (
            <p className="post-tags article-tags note-tags" data-pagefind-ignore>
              {note.tags.map((tag) => (
                <Link key={tag} className="tag-chip" href={noteTagHref(tag)}>
                  {formatTag(tag)}
                </Link>
              ))}
            </p>
          )}

          <div data-pagefind-ignore>
            <AuthorCard />
          </div>

          <footer className="article-foot" data-pagefind-ignore>
            <Link className="text-link" href="/notes/">
              ← All notes
            </Link>
            <Link className="text-link" href="/blog/">
              Read the blog →
            </Link>
          </footer>
        </article>

        <aside className="post-sidebar">
          <TableOfContents headings={note.headings} variant="side" />
        </aside>
      </div>
    </main>
  );
}
