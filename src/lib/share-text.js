// Text for sharing a quote from a post or note on X.

// X counts any link as 23 characters; leave room for it, the quotes and a space.
const MAX_QUOTE = 280 - 23 - 4;

/** The tweet text for a selection: quoted, whitespace collapsed, cut at a word if too long. */
export function quoteForTweet(selection) {
  const text = selection.replace(/\s+/g, ' ').trim();
  if ([...text].length <= MAX_QUOTE) {
    return `“${text}”`;
  }
  const cut = text.slice(0, MAX_QUOTE - 1);
  const atWord = cut.lastIndexOf(' ') > MAX_QUOTE / 2 ? cut.slice(0, cut.lastIndexOf(' ')) : cut;
  return `“${atWord.trimEnd()}…”`;
}
