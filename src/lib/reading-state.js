'use client';

import { useSyncExternalStore } from 'react';

// Per-reader state kept in this browser only: how far they got in each post, and the posts
// they saved for later. Nothing is sent anywhere. Storage can be missing or blocked (private
// windows, cleared data), so every read and write falls back to "nothing saved".

const KEY = 'buildwithvibs:reading';
const CHANGE_EVENT = 'buildwithvibs:reading-change';
export const FINISHED_AT = 0.95;
const EMPTY = { progress: {}, saved: {} };

let cachedRaw;
let cachedState = EMPTY;

function readRaw() {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : EMPTY;
      cachedState = { progress: parsed.progress ?? {}, saved: parsed.saved ?? {} };
    } catch {
      cachedState = EMPTY;
    }
  }
  return cachedState;
}

function getServerSnapshot() {
  return EMPTY;
}

function write(update) {
  const next = update(getSnapshot());
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange) {
  // `storage` fires for changes made in other tabs; CHANGE_EVENT for this one.
  const onStorage = (event) => {
    if (event.key === KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** `{ progress: { [slug]: { percent, updatedAt } }, saved: { [slug]: savedAt } }`, empty on the server. */
export function useReadingState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Remembers where the reader is in a post. Once finished, a post stays finished. */
export function saveProgress(slug, percent) {
  write((state) => {
    const previous = state.progress[slug];
    const finished = previous?.percent >= FINISHED_AT;
    return {
      ...state,
      progress: {
        ...state.progress,
        [slug]: { percent: finished ? Math.max(percent, previous.percent) : percent, updatedAt: Date.now() },
      },
    };
  });
}

/** The stored entry for one post, read once - for code that must see it before tracking overwrites it. */
export function getProgress(slug) {
  return getSnapshot().progress[slug] ?? null;
}

export function toggleSaved(slug) {
  write((state) => {
    const saved = { ...state.saved };
    if (saved[slug]) {
      delete saved[slug];
    } else {
      saved[slug] = Date.now();
    }
    return { ...state, saved };
  });
}

export function isInProgress(entry) {
  return Boolean(entry) && entry.percent >= 0.05 && entry.percent < FINISHED_AT;
}

export function isFinished(entry) {
  return Boolean(entry) && entry.percent >= FINISHED_AT;
}
