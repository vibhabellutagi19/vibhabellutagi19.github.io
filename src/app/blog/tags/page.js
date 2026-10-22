import Link from 'next/link';

import { getAllTags } from '@/lib/posts';

const title = 'Tags · Blog · Vibhavari Bellutagi';
const description = 'Browse blog posts by topic.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/blog/tags/' },
  openGraph: {
    url: '/blog/tags/',
    title,
    description,
    images: ['/opengraph-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image.jpg'],
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
