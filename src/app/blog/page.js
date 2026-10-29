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
          <a className="text-link rss-link" href="/feed.xml">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="5" cy="19" r="2" />
              <path d="M3 11a10 10 0 0 1 10 10M3 4a17 17 0 0 1 17 17" />
            </svg>
            Follow via RSS
          </a>
        </div>

        <BlogIndex posts={posts} tags={tags} />
      </div>
    </main>
  );
}
