// Light or dark, chosen by the reader or taken from their system setting.
export const THEME_KEY = 'buildwithvibs:theme';

/** The reader's saved choice, else their system setting. Browser only. */
export function preferredTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Storage blocked: fall back to the system setting.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Runs in <head> before the page paints, so a dark-mode reader never sees a white flash.
export const THEME_SCRIPT = `(function () {
  var theme = 'light';
  try {
    var saved = localStorage.getItem('${THEME_KEY}');
    theme = saved === 'dark' || saved === 'light'
      ? saved
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (error) {}
  document.documentElement.dataset.theme = theme;
})();`;
