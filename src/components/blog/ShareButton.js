'use client';

import { useEffect, useRef, useState } from 'react';

const COPIED_MS = 1500;

// Outline icons from Tabler Icons (MIT, tabler.io/icons), merged into one path each.
const ICONS = {
  share:
    'M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M8.7 10.7l6.6 -3.4M8.7 13.3l6.6 3.4',
  whatsapp:
    'M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1',
  x: 'M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772',
  linkedin:
    'M8 11v5M8 8v.01M12 16v-5M16 16v-3a2 2 0 1 0 -4 0M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z',
  link: 'M9 15l6 -6M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function shareLinks(title, url) {
  const u = encodeURIComponent(url);
  return [
    { name: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: 'x', label: 'X', href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${u}` },
    { name: 'linkedin', label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
}

/** Share icon that opens a menu: WhatsApp, X, LinkedIn, copy link, and the device share sheet where there is one. */
export function ShareButton({ title, text, url }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canShareNatively, setCanShareNatively] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setCanShareNatively(typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  // Close on a click outside, and move focus into the menu when it opens.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function close({ refocus = true } = {}) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function onMenuKeyDown(event) {
    const items = [...menuRef.current.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (event.key === 'Tab') {
      close({ refocus: false });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Copy this link:', url);
      close();
    }
  }

  async function shareNatively() {
    close();
    try {
      await navigator.share({ title, text, url });
    } catch {
      // Closing the share sheet isn't an error worth showing.
    }
  }

  return (
    <div className="share" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="share-button"
        data-status={copied ? 'copied' : undefined}
        aria-label="Share this post"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Share this post"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name={copied ? 'check' : 'share'} />
      </button>

      {open && (
        <div ref={menuRef} className="share-menu" role="menu" aria-label="Share this post" onKeyDown={onMenuKeyDown}>
          {shareLinks(title, url).map(({ name, label, href }) => (
            <a
              key={name}
              role="menuitem"
              className={`share-item share-${name}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => close({ refocus: false })}
            >
              <Icon name={name} />
              {label}
            </a>
          ))}
          <button type="button" role="menuitem" className="share-item" onClick={copyLink}>
            <Icon name={copied ? 'check' : 'link'} />
            <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
          </button>
          {canShareNatively && (
            <button type="button" role="menuitem" className="share-item" onClick={shareNatively}>
              <Icon name="more" />
              More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}
