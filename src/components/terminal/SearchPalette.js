'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { searchItems } from '@/lib/terminal/searchIndex';

function typeBadge(type) {
  switch (type) {
    case 'blog':
      return 'md';
    case 'section':
      return 'dir';
    case 'experience':
      return 'git';
    case 'project':
      return 'dir';
    case 'action':
      return 'cmd';
    default:
      return type;
  }
}

export function SearchPalette({ open, onClose, searchIndex, onSelect }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => searchItems(searchIndex, query, 10), [searchIndex, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return undefined;
    }

    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  function selectItem(item) {
    onSelect(item);
    onClose();
  }

  return (
    <div className="palette-backdrop" role="presentation" onClick={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-label="Search portfolio"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="palette-head">
          <span className="glyph">/</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts, experience, sections…"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, results.length - 1));
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === 'Enter' && results[activeIndex]) {
                event.preventDefault();
                selectItem(results[activeIndex]);
              }
            }}
          />
          <kbd>esc</kbd>
        </div>

        <ul className="palette-results" role="listbox">
          {results.length === 0 ? (
            <li className="palette-empty">No matches for “{query}”</li>
          ) : (
            results.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={index === activeIndex ? 'active' : ''}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectItem(item)}
                >
                  <span className={`badge ${typeBadge(item.type)}`}>{typeBadge(item.type)}</span>
                  <span className="label">{item.label}</span>
                  <span className="hint">{item.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="palette-foot">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>⌘K search</span>
        </div>
      </div>
    </div>
  );
}
