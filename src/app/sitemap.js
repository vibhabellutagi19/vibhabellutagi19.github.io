import { getAllPosts, getAllTags } from '@/lib/posts';

const SITE_URL = 'https://buildwithvibs.in';
export const dynamic = 'force-static';

export default async function sitemap() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}/`,
    lastModified: new Date(),
  }));

  const tagEntries = tags.map(({ tag }) => ({
    url: `${SITE_URL}/blog/tags/${tag}/`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
    },
    ...tagEntries,
    ...postEntries,
  ];
}
