'use client';

import { useEffect, useState } from 'react';

const MIN_HEADINGS = 3;

// Long posts list only their sections (h2); the subsections would push the list off-screen.
const COMPACT_SECTIONS = 4;
const COMPACT_HEADINGS = 10;

// Posts that only use h3 (the Hashnode imports) list those at the top level.
function getEntries(headings) {
  const sections = headings.filter((heading) => heading.level === 2).length;
  const compact = sections >= COMPACT_SECTIONS && headings.length > COMPACT_HEADINGS;
  return headings
    .filter((heading) => !compact || heading.level === 2)
    .map((heading) => ({ ...heading, nested: sections > 0 && heading.level === 3 }));
}

// When subsections are hidden, reading one highlights the section it belongs to.
function getListedActiveId(headings, entries, activeId) {
  const listed = new Set(entries.map((entry) => entry.id));
  const index = headings.findIndex((heading) => heading.id === activeId);
  for (let i = index; i >= 0; i -= 1) {
    if (listed.has(headings[i].id)) {
      return headings[i].id;
    }
  }
  return null;
}

function TocList({ entries, activeId, onNavigate }) {
  return (
    <ol className="toc-list">
      {entries.map(({ id, text, nested }) => (
        <li key={id} className={nested ? 'is-nested' : undefined}>
          <a href={`#${id}`} aria-current={id === activeId ? 'location' : undefined} onClick={onNavigate}>
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * A sticky "On this page" list beside the article on wide screens, and a collapsible one above
 * it on narrower screens. The section being read is highlighted in both.
 */
export function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState(null);
  const [open, setOpen] = useState(false);
  const entries = getEntries(headings);

  useEffect(() => {
    const elements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) {
      return undefined;
    }

    // The active section is the last heading that has scrolled past the top fifth of the window.
    const update = () => {
      const line = window.innerHeight * 0.2;
      let current = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) {
          current = element.id;
        } else {
          break;
        }
      }
      // A short last section never reaches the line, so the bottom of the page counts as reaching it.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom && elements.at(-1).getBoundingClientRect().top < window.innerHeight) {
        current = elements.at(-1).id;
      }
      setActiveId(current);
    };

    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
      }
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [headings]);

  if (headings.length < MIN_HEADINGS) {
    return null;
  }

  const listedActiveId = getListedActiveId(headings, entries, activeId);
  const activeText = entries.find((entry) => entry.id === listedActiveId)?.text;

  return (
    <>
      <details className="toc toc-inline" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary>
          <span className="toc-title">On this page</span>
          {activeText && !open && <span className="toc-current">{activeText}</span>}
        </summary>
        <TocList entries={entries} activeId={listedActiveId} onNavigate={() => setOpen(false)} />
      </details>

      {/* Spans the article's full height so the inner list can stick while the post scrolls. */}
      <nav className="toc-side" aria-label="On this page">
        <div className="toc toc-side-inner">
          <p className="toc-title">On this page</p>
          <TocList entries={entries} activeId={listedActiveId} />
        </div>
      </nav>
    </>
  );
}
