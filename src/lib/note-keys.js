// Notes reuse the blog's per-reader features (likes, saved, reading progress), which are keyed
// by slug. A note can share a slug with a post, so its keys are namespaced. Safe in the browser.

/** Key for saved/progress state in this browser (src/lib/reading-state.js). */
export function noteStateKey(slug) {
  return `note:${slug}`;
}

/** Key for the likes Worker, which only accepts kebab-case slugs. */
export function noteLikeKey(slug) {
  return `note-${slug}`;
}
