import { BlogIndex } from '@/components/blog/BlogIndex';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { groupByTopic } from '@/lib/topics';

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
  const topics = groupByTopic(posts);

  return (
    <main className="section blog-index">
      <div className="container">
        <div className="blog-head">
          <div>
            <p className="eyebrow">Writing</p>
            <h1>
              {posts.length} posts on how things <span className="serif">actually</span> work.
            </h1>
            <p className="section-lede">
              Notes on data engineering, Git, networking and the systems behind software. Pick a topic and read it
              in order, or browse by date.
            </p>
          </div>
          <a className="text-link rss-link" href="/feed.xml">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="5" cy="19" r="2" />
              <path d="M3 11a10 10 0 0 1 10 10M3 4a17 17 0 0 1 17 17" />
            </svg>
            Follow via RSS
          </a>
        </div>

        <BlogIndex posts={posts} topics={topics} tags={tags} />
      </div>
    </main>
  );
}
