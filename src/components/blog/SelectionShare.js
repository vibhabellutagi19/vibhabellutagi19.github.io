'use client';

import { useEffect, useRef, useState } from 'react';

import { quoteForTweet } from '@/lib/share-text';

// Select a sentence in a post or note, and a small "Share on X" button appears under it.
// The tweet quotes the selection and links to the page.
const MIN_CHARS = 12;

export function SelectionShare({ targetId, url }) {
  const [state, setState] = useState(null); // { text, top, left }
  const buttonRef = useRef(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) {
      return undefined;
    }

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const selection = window.getSelection();
        const text = selection?.toString() ?? '';
        if (!selection || selection.isCollapsed || text.trim().length < MIN_CHARS) {
          setState(null);
          return;
        }
        const range = selection.getRangeAt(0);
        // Only selections inside the article body, and not inside code.
        const container = range.commonAncestorContainer;
        const element = container.nodeType === 1 ? container : container.parentElement;
        if (!target.contains(element) || element.closest('pre, code')) {
          setState(null);
          return;
        }
        const rect = range.getBoundingClientRect();
        setState({
          text,
          top: rect.bottom + window.scrollY + 10,
          left: Math.min(Math.max(rect.left + rect.width / 2 + window.scrollX, 80), window.innerWidth - 80),
        });
      });
    };

    document.addEventListener('selectionchange', update);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('selectionchange', update);
    };
  }, [targetId]);

  if (!state) {
    return null;
  }

  const href = `https://x.com/intent/tweet?text=${encodeURIComponent(quoteForTweet(state.text))}&url=${encodeURIComponent(url)}`;

  return (
    <a
      ref={buttonRef}
      className="selection-share"
      style={{ top: state.top, left: state.left }}
      href={href}
      target="_blank"
      rel="noreferrer"
      // Keep the selection: a mousedown on the button would otherwise clear it before the click.
      onMouseDown={(event) => event.preventDefault()}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.48 21H2.4l7.17-8.2L2 3h6.32l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58l11.09 14.47Z"
        />
      </svg>
      Share quote
    </a>
  );
}
