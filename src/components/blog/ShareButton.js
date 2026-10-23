'use client';

import { useEffect, useState } from 'react';

const RESET_MS = 2000;

// Opens the device's own share sheet where there is one (phones, Safari, Chrome on Mac and
// Windows), which is how readers save to Reading List, Pocket or a message to themselves.
// Elsewhere it copies the link.
export function ShareButton({ title, text, url }) {
  const [label, setLabel] = useState('Share');

  useEffect(() => {
    if (label === 'Share') {
      return undefined;
    }
    const timer = setTimeout(() => setLabel('Share'), RESET_MS);
    return () => clearTimeout(timer);
  }, [label]);

  async function share() {
    const data = { title, text, url };
    if (navigator.share && navigator.canShare?.(data) !== false) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        // Closing the share sheet isn't a failure, so don't fall back to copying.
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setLabel('Link copied');
    } catch {
      setLabel('Copy failed');
    }
  }

  return (
    <button type="button" className="share-button" onClick={share}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      <span aria-live="polite">{label}</span>
    </button>
  );
}
