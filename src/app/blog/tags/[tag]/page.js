import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostList } from '@/components/blog/PostList';
import { formatTag, getAllTags, getPostsByTag } from '@/lib/posts';
import { SITE_OG_IMAGES, SITE_TWITTER_IMAGES } from '@/lib/share-image';

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const label = formatTag(tag);
  const title = `${label} · Blog · Vibhavari Bellutagi`;
  const description = `Posts tagged ${label}.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/tags/${tag}/` },
    openGraph: {
      images: SITE_OG_IMAGES,
      url: `/blog/tags/${tag}/`,
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
}

export default async function BlogTagPage({ params }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const tags = await getAllTags();
  const tagLabels = Object.fromEntries(tags.map(({ tag: slug, label }) => [slug, label]));
  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="section">
      <div className="container container-blog">
        <Link className="text-link back-link" href="/blog/">
          ← All posts
        </Link>
        <div className="section-head">
          <p className="eyebrow">Tag</p>
          <h1>{formatTag(tag)}</h1>
          <p className="section-lede">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}.
          </p>
        </div>

        <PostList posts={posts} tagLabels={tagLabels} />
      </div>
    </main>
  );
}
