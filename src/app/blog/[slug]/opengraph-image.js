import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image';
import { formatTag, getAllPosts } from '@/lib/posts';
import { getTopic } from '@/lib/topics';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Blog post by Vibhavari Bellutagi';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const post = (await getAllPosts()).find((item) => item.slug === slug);
  return renderOgImage({
    eyebrow: `Blog · ${getTopic(post).name}`,
    title: post.title,
    tags: post.tags.map(formatTag),
  });
}
