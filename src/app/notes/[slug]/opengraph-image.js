import { getAllNotes } from '@/lib/notes';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image';
import { formatTag } from '@/lib/posts';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Note by Vibhavari Bellutagi';

export async function generateStaticParams() {
  const notes = await getAllNotes();
  // Mirrors the page: a placeholder keeps the static export building on a day with no published notes.
  return notes.length > 0 ? notes.map((note) => ({ slug: note.slug })) : [{ slug: '_none' }];
}

export default async function Image({ params }) {
  const { slug } = await params;
  const note = (await getAllNotes()).find((item) => item.slug === slug);
  return renderOgImage({
    eyebrow: note ? `Notes · ${note.typeLabel}${note.cohortWeek ? ` · Week ${note.cohortWeek}` : ''}` : 'Notes',
    title: note ? note.title : 'Notes',
    tags: note ? note.tags.map(formatTag) : [],
  });
}
