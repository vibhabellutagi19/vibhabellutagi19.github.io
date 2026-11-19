import { Search } from '@/components/search/Search';

const title = 'Search · Vibhavari Bellutagi';
const description = 'Search every blog post and note.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/search/' },
  // A results page has nothing of its own to rank for.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="section search-page">
      <div className="container container-narrow">
        <p className="eyebrow">Search</p>
        <h1>Find a post or a note</h1>
        <Search />
      </div>
    </main>
  );
}
