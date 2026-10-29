'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { profile } from '@/data/site';

const navItems = [
  { href: '/#work', label: 'Work' },
  { href: '/#what-i-build', label: 'What I build' },
  { href: '/#process', label: 'Process' },
  { href: '/#about', label: 'About' },
  { href: '/blog/', label: 'Blog' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${open ? ' is-open' : ''}`}>
      <div className="container header-row">
        <Link className="brand" href="/" onClick={close}>
          Vibhavari Bellutagi
        </Link>

        <nav id="site-nav" className="site-nav" aria-label="Main">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-extra">
            <a className="btn btn-ghost" href={profile.whatsappUrl} target="_blank" rel="noreferrer" onClick={close}>
              WhatsApp
            </a>
            <a className="btn btn-primary" href={profile.bookingUrl} target="_blank" rel="noreferrer" onClick={close}>
              Book a call
            </a>
          </div>
        </nav>

        <a className="btn btn-primary btn-sm header-cta" href={profile.bookingUrl} target="_blank" rel="noreferrer">
          Book a call
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  );
}
