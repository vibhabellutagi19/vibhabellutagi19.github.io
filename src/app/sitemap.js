import { COHORT_PATH, countNoteTags, getAllNotes, noteHref, noteTagHref } from '@/lib/notes';
import { getAllPosts, getAllTags } from '@/lib/posts';

const SITE_URL = 'https://buildwithvibs.in';
export const dynamic = 'force-static';

export default async function sitemap() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const notes = await getAllNotes();

  const noteEntries = notes
    .filter((note) => note.status === 'published')
    .map((note) => ({ url: `${SITE_URL}${noteHref(note.slug)}`, lastModified: new Date(`${note.date}T00:00:00Z`) }));
  const noteTagEntries = countNoteTags(notes.filter((note) => note.status === 'published')).map(({ tag }) => ({
    url: `${SITE_URL}${noteTagHref(tag)}`,
  }));

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
    {
      url: `${SITE_URL}/blog/tags/`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/notes/`,
      lastModified: new Date(),
    },
    { url: `${SITE_URL}${COHORT_PATH}`, lastModified: new Date() },
    { url: `${SITE_URL}/notes/tags/`, lastModified: new Date() },
    ...noteTagEntries,
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: new Date(),
    },
    ...tagEntries,
    ...postEntries,
    ...noteEntries,
  ];
}
