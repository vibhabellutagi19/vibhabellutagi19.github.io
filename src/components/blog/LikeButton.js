'use client';

import { useEffect, useState } from 'react';

import { likes } from '@/data/site';

// Talks to the Cloudflare Worker in /worker. Renders nothing until the API answers,
// so the button never appears in a broken state.
export function LikeButton({ slug }) {
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const url = `${likes.apiUrl}/likes/${slug}`;

  useEffect(() => {
    if (!likes.apiUrl) {
      return undefined;
    }

    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setState(data))
      .catch(() => {});

    return () => controller.abort();
  }, [url]);

  if (!state) {
    return null;
  }

  async function toggle() {
    const previous = state;
    const liked = !state.liked;
    setPending(true);
    setState({ liked, count: Math.max(0, state.count + (liked ? 1 : -1)) });

    try {
      const res = await fetch(url, { method: liked ? 'POST' : 'DELETE' });
      if (!res.ok) {
        throw new Error(`Like request failed: ${res.status}`);
      }
      setState(await res.json());
    } catch {
      setState(previous);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="like">
      <p className="like-prompt">Enjoyed this post?</p>
      <button
        type="button"
        className="like-button"
        aria-pressed={state.liked}
        aria-label={state.liked ? 'Unlike this post' : 'Like this post'}
        disabled={pending}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 20.5s-7.5-4.6-9.4-9.3C1.3 7.9 3.4 4.5 6.9 4.5c2 0 3.6 1.1 4.6 2.6l.5.7.5-.7c1-1.5 2.6-2.6 4.6-2.6 3.5 0 5.6 3.4 4.3 6.7-1.9 4.7-9.4 9.3-9.4 9.3z" />
        </svg>
        <span className="like-count">{state.count}</span>
      </button>
    </div>
  );
}
