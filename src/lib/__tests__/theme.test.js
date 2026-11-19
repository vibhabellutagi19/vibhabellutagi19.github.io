import { describe, expect, it } from 'vitest';

import { THEME_SCRIPT } from '../theme';

describe('THEME_SCRIPT', () => {
  const run = ({ saved = null, systemDark = false, storageBlocked = false } = {}) => {
    const root = { dataset: {} };
    const storage = {
      getItem: () => {
        if (storageBlocked) throw new Error('blocked');
        return saved;
      },
    };
    // eslint-disable-next-line no-new-func -- runs the inline <head> script with stand-in browser globals
    new Function('localStorage', 'matchMedia', 'document', THEME_SCRIPT)(storage, () => ({ matches: systemDark }), {
      documentElement: root,
    });
    return root.dataset.theme;
  };

  it("uses the reader's saved choice over the system setting", () => {
    expect(run({ saved: 'dark' })).toBe('dark');
    expect(run({ saved: 'light', systemDark: true })).toBe('light');
  });

  it('falls back to the system setting', () => {
    expect(run({ systemDark: true })).toBe('dark');
    expect(run()).toBe('light');
  });

  it('ignores junk in storage and survives blocked storage', () => {
    expect(run({ saved: 'purple', systemDark: true })).toBe('dark');
    expect(run({ storageBlocked: true })).toBe('light');
  });
});
