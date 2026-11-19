import Link from 'next/link';

import { getAllTags } from '@/lib/posts';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

const title = 'Tags · Blog · Vibhavari Bellutagi';
const description = 'Browse blog posts by topic.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/blog/tags/' },
  openGraph: {
    images: SITE_OG_IMAGES,
    url: '/blog/tags/',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    images: SITE_TWITTER_IMAGES,
    title,
    description,
  },
};

export default async function BlogTagsIndexPage() {
  const tags = await getAllTags();

  return (
    <main className="section">
      <div className="container container-narrow">
        <Link className="text-link back-link" href="/blog/">
          ← All posts
        </Link>
        <div className="section-head">
          <p className="eyebrow">Browse</p>
          <h1>Tags</h1>
          <p className="section-lede">{tags.length} topics.</p>
        </div>

        <p className="post-tags">
          {tags.map(({ tag, label, count }) => (
            <Link key={tag} className="tag-chip" href={`/blog/tags/${tag}/`}>
              {label} · {count}
            </Link>
          ))}
        </p>
      </div>
    </main>
  );
}
