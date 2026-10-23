import { beforeEach, describe, expect, it } from 'vitest';

import {
  FINISHED_AT,
  getProgress,
  isFinished,
  isInProgress,
  saveProgress,
  toggleSaved,
} from '../reading-state';

// The module only touches window.localStorage and window events.
function installWindow(storage) {
  const target = new EventTarget();
  globalThis.window = Object.assign(target, { localStorage: storage });
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

describe('reading state', () => {
  beforeEach(() => installWindow(memoryStorage()));

  it('remembers progress per post', () => {
    saveProgress('spark-basics', 0.4);
    expect(getProgress('spark-basics').percent).toBe(0.4);
    expect(getProgress('git-essentials')).toBeNull();
  });

  it('keeps a finished post finished when the reader scrolls back up', () => {
    saveProgress('inside-git', 0.97);
    saveProgress('inside-git', 0.2);

    const entry = getProgress('inside-git');
    expect(isFinished(entry)).toBe(true);
    expect(entry.percent).toBeGreaterThanOrEqual(FINISHED_AT);
  });

  it('treats only the middle of a post as in progress', () => {
    expect(isInProgress({ percent: 0.01 })).toBe(false);
    expect(isInProgress({ percent: 0.5 })).toBe(true);
    expect(isInProgress({ percent: 0.99 })).toBe(false);
    expect(isInProgress(null)).toBe(false);
  });

  it('toggles saved posts and tells listeners', () => {
    let changes = 0;
    window.addEventListener('buildwithvibs:reading-change', () => changes++);

    toggleSaved('tcp-and-udp');
    expect(JSON.parse(window.localStorage.getItem('buildwithvibs:reading')).saved['tcp-and-udp']).toBeTypeOf('number');
    toggleSaved('tcp-and-udp');
    expect(JSON.parse(window.localStorage.getItem('buildwithvibs:reading')).saved).toEqual({});
    expect(changes).toBe(2);
  });

  it('behaves as "nothing saved" when storage is blocked', () => {
    installWindow({
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('SecurityError');
      },
    });

    expect(() => saveProgress('spark-basics', 0.5)).not.toThrow();
    expect(() => toggleSaved('spark-basics')).not.toThrow();
    expect(getProgress('spark-basics')).toBeNull();
  });

  it('ignores corrupted stored data', () => {
    window.localStorage.setItem('buildwithvibs:reading', '{not json');
    expect(getProgress('spark-basics')).toBeNull();
  });
});
