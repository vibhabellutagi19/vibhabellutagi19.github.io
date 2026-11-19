'use client';

import { useEffect, useRef, useState } from 'react';

// Pagefind builds its index from the exported HTML after `next build` (see package.json),
// and serves it from /pagefind/. Its script loads on this page only, when the reader searches.
const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'Blog', label: 'Blog' },
  { id: 'Notes', label: 'Notes' },
];
const MAX_RESULTS = 20;

let pagefindPromise;

function loadPagefind() {
  pagefindPromise ??= import(/* webpackIgnore: true */ '/pagefind/pagefind.js').then(async (pagefind) => {
    await pagefind.init();
    return pagefind;
  });
  return pagefindPromise;
}

function readQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return { query: params.get('q') ?? '', filter: FILTERS.some((f) => f.id === params.get('in')) ? params.get('in') : 'all' };
}

function writeQueryToUrl(query, filter) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (filter !== 'all') params.set('in', filter);
  const search = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
}

export function Search() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [results, setResults] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | unavailable
  const inputRef = useRef(null);

  useEffect(() => {
    const initial = readQueryFromUrl();
    setQuery(initial.query);
    setFilter(initial.filter);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    writeQueryToUrl(query.trim(), filter);
    if (!query.trim()) {
      setResults(null);
      return undefined;
    }

    let cancelled = false;
    setStatus('loading');
    loadPagefind()
      .then(async (pagefind) => {
        const options = filter === 'all' ? {} : { filters: { type: filter } };
        const search = await pagefind.debouncedSearch(query.trim(), options, 200);
        // `null` means a newer keystroke replaced this search.
        if (!search || cancelled) return;
        const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((result) => result.data()));
        if (!cancelled) {
          setResults({ total: search.results.length, items: data });
          setStatus('ready');
        }
      })
      .catch(() => {
        // No index: running `next dev`, where search isn't built.
        pagefindPromise = undefined;
        if (!cancelled) setStatus('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [query, filter]);

  return (
    <div className="search">
      <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor="search-input">
          Search posts and notes
        </label>
        <input
          ref={inputRef}
          id="search-input"
          className="search-input"
          type="search"
          placeholder="Search posts and notes…"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="post-filters" role="group" aria-label="Search in">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="filter-chip"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </form>

      <div aria-live="polite">
        {status === 'unavailable' && (
          <p className="search-status">
            Search runs on the built site. Try <code>pnpm build</code> then <code>npx serve out</code>.
          </p>
        )}
        {status !== 'unavailable' && results && (
          <p className="search-status">
            {results.total === 0
              ? `Nothing found for “${query.trim()}”.`
              : `${results.total} ${results.total === 1 ? 'result' : 'results'}${results.total > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ''}`}
          </p>
        )}
      </div>

      {results?.items.length > 0 && (
        <ul className="search-results">
          {results.items.map((item) => (
            <li key={item.url}>
              <a className="search-result" href={item.url}>
                <span className="note-type">{item.filters?.type?.[0] ?? ''}</span>
                <span className="post-title">{item.meta?.title}</span>
                {/* Pagefind's excerpt is escaped page text with <mark> around the matches. */}
                <span className="post-excerpt" dangerouslySetInnerHTML={{ __html: item.excerpt }} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
