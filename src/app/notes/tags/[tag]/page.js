import Link from 'next/link';
import { notFound } from 'next/navigation';

import { NoteList } from '@/components/notes/NoteList';
import { countNoteTags, getAllNotes, noteTagHref } from '@/lib/notes';
import { formatTag, getAllTags } from '@/lib/posts';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

export const dynamicParams = false;

// A static export refuses a dynamic route with no pages; before any note is published there are
// no tags, so a placeholder that renders as not-found keeps the site building.
const NO_TAGS = '_none';

async function publishedNotes() {
  return (await getAllNotes()).filter((note) => note.status === 'published');
}

export async function generateStaticParams() {
  const tags = countNoteTags(await publishedNotes());
  return tags.length > 0 ? tags.map(({ tag }) => ({ tag })) : [{ tag: NO_TAGS }];
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const label = formatTag(tag);
  const title = `${label} · Notes · Vibhavari Bellutagi`;
  const description = `My notes on ${label}.`;

  return {
    title,
    description,
    alternates: { canonical: noteTagHref(tag) },
    openGraph: { images: SITE_OG_IMAGES, url: noteTagHref(tag), title, description },
    twitter: { card: 'summary_large_image', images: SITE_TWITTER_IMAGES, title, description },
  };
}

export default async function NoteTagPage({ params }) {
  const { tag } = await params;
  const notes = (await publishedNotes()).filter((note) => note.tags.includes(tag));
  if (notes.length === 0) {
    notFound();
  }

  // The same topic on the blog, if it has posts there.
  const blogTag = (await getAllTags()).find((item) => item.tag === tag);
  const tagLabels = Object.fromEntries(notes.flatMap((note) => note.tags).map((item) => [item, formatTag(item)]));

  return (
    <main className="section">
      <div className="container container-blog">
        <Link className="text-link back-link" href="/notes/tags/">
          ← All topics
        </Link>
        <div className="section-head">
          <p className="eyebrow">Notes on</p>
          <h1>{formatTag(tag)}</h1>
          <p className="section-lede">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}.
            {blogTag && (
              <>
                {' '}
                Also on the blog:{' '}
                <Link href={`/blog/tags/${tag}/`}>
                  {blogTag.count} {blogTag.count === 1 ? 'post' : 'posts'} on {formatTag(tag)}
                </Link>
                .
              </>
            )}
          </p>
        </div>

        <NoteList notes={notes} tagLabels={tagLabels} />
      </div>
    </main>
  );
}
