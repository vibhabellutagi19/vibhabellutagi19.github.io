'use client';

import { useEffect, useState } from 'react';

import { preferredTheme, THEME_KEY } from '@/lib/theme';

// The theme is already set before paint by THEME_SCRIPT in the root layout;
// this button flips it and remembers the choice.

function hasSavedChoice() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === 'dark' || saved === 'light';
  } catch {
    return false;
  }
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(preferredTheme());

    // Follow the system setting until the reader picks a theme themselves.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => {
      if (!hasSavedChoice()) {
        const next = event.matches ? 'dark' : 'light';
        apply(next);
        setTheme(next);
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';

  function toggle() {
    apply(next);
    setTheme(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the theme still changes for this page view.
    }
  }

  return (
    <button
      type="button"
      className="icon-btn header-icon"
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} theme` : 'Switch theme'}
      title={theme ? `Switch to ${next} theme` : 'Switch theme'}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
