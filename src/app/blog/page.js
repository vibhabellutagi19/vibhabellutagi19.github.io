import { BlogIndex } from '@/components/blog/BlogIndex';
import { getAllPosts, getAllTags } from '@/lib/posts';

const title = 'Blog · Vibhavari Bellutagi';
const description = 'Technical essays on data engineering, Git, and software systems.';

export const metadata = {
  title,
  description,
  openGraph: {
    url: '/blog/',
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

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <main className="section blog-index">
      <div className="container container-blog">
        <div className="section-head">
          <p className="eyebrow">Writing</p>
          <h1>Blog</h1>
          <p className="section-lede">
            Notes on data engineering, Git, networking and the systems behind software. {posts.length} posts
            across {tags.length} topics.
          </p>
        </div>

        <BlogIndex posts={posts} tags={tags} />
      </div>
    </main>
  );
}
