'use client';

import { useEffect } from 'react';

const RESET_MS = 2000;

// The copy buttons are part of the post HTML (see highlightCodeBlocks in lib/markdown.js);
// this wires them up with one listener instead of hydrating every code block.
export function CodeCopy() {
  useEffect(() => {
    const timers = new Map();

    async function onClick(event) {
      const button = event.target.closest?.('.code-copy');
      if (!button) {
        return;
      }

      const code = button.closest('.code-block')?.querySelector('pre');
      if (!code) {
        return;
      }

      try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ''));
        button.textContent = 'Copied';
        button.dataset.state = 'copied';
      } catch {
        button.textContent = 'Press Ctrl+C';
        button.dataset.state = 'failed';
        window.getSelection()?.selectAllChildren(code);
      }

      clearTimeout(timers.get(button));
      timers.set(
        button,
        setTimeout(() => {
          button.textContent = 'Copy';
          delete button.dataset.state;
        }, RESET_MS)
      );
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return null;
}
