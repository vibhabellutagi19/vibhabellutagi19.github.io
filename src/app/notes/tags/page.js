import Link from 'next/link';

import { countNoteTags, getAllNotes, noteTagHref } from '@/lib/notes';
import { formatTag } from '@/lib/posts';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

const title = 'Topics · Notes · Vibhavari Bellutagi';
const description = 'Every topic in my notes, from databases to distributed systems.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/notes/tags/' },
  openGraph: { images: SITE_OG_IMAGES, url: '/notes/tags/', title, description },
  twitter: { card: 'summary_large_image', images: SITE_TWITTER_IMAGES, title, description },
};

export default async function NoteTagsPage() {
  const tags = countNoteTags((await getAllNotes()).filter((note) => note.status === 'published'));

  return (
    <main className="section">
      <div className="container container-narrow">
        <Link className="text-link back-link" href="/notes/">
          ← All notes
        </Link>
        <div className="section-head">
          <p className="eyebrow">Browse notes</p>
          <h1>Topics</h1>
          <p className="section-lede">
            {tags.length} {tags.length === 1 ? 'topic' : 'topics'}.
          </p>
        </div>
        <p className="post-tags">
          {tags.map(({ tag, count }) => (
            <Link key={tag} className="tag-chip" href={noteTagHref(tag)}>
              {formatTag(tag)} · {count}
            </Link>
          ))}
        </p>
      </div>
    </main>
  );
}
