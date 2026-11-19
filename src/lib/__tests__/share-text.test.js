import { describe, expect, it } from 'vitest';

import { quoteForTweet } from '../share-text';

describe('quoteForTweet', () => {
  it('quotes the selection and collapses whitespace', () => {
    expect(quoteForTweet('  One writer\n  per file. ')).toBe('“One writer per file.”');
  });

  it('cuts long selections at a word so the tweet fits with the link', () => {
    const quote = quoteForTweet('word '.repeat(80));
    expect([...quote].length).toBeLessThanOrEqual(280 - 23 - 2);
    expect(quote.endsWith('word…”')).toBe(true);
  });
});
