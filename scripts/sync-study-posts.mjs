// Copies published posts from the study repo (system-design-public) into blog/posts
// before the site is built. Runs in CI only; the copied files are never committed.
//
//   node scripts/sync-study-posts.mjs <path-to-study-repo>
//
// Rules:
// - Only weeks/*/post/index.md with `published: true` are copied. The check happens
//   before anything is written, so a draft can never reach blog/posts.
// - title, date and slug are required. A post missing one fails the build.
// - A slug already used by a site post (or by another study post) fails the build.
//   Failing loudly beats silently overwriting or hiding a post.
// - Safe to run twice: each target folder is replaced, and posts.json never gets
//   duplicates.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  if (!match) return meta;
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return meta;
}

// "Nov 15, 2026" -> "2026-11-15". Parsed by hand so the result never depends on the
// machine's time zone.
export function toIsoDate(display) {
  const m = String(display || '').trim().match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m || !MONTHS[m[1].toLowerCase()]) return null;
  const [, mon, day, year] = m;
  return `${year}-${String(MONTHS[mon.toLowerCase()]).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Reads the study repo and returns the posts to publish, or throws with every problem
// found at once (so one CI run shows all of them).
export function collectStudyPosts(studyRoot) {
  const weeksDir = path.join(studyRoot, 'weeks');
  if (!fs.existsSync(weeksDir)) throw new Error(`No weeks/ folder in ${studyRoot}. Is this the study repo?`);

  const posts = [];
  const problems = [];
  for (const week of fs.readdirSync(weeksDir).sort()) {
    const file = path.join(weeksDir, week, 'post', 'index.md');
    if (!fs.existsSync(file)) continue;
    const meta = parseFrontmatter(fs.readFileSync(file, 'utf8'));
    if (meta.published !== 'true') continue;

    const where = `weeks/${week}/post/index.md`;
    const missing = ['title', 'date', 'slug'].filter((k) => !meta[k]);
    if (missing.length) { problems.push(`${where}: missing ${missing.join(', ')}`); continue; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) { problems.push(`${where}: slug "${meta.slug}" must be lowercase words joined by hyphens`); continue; }
    const iso = toIsoDate(meta.date);
    if (!iso) { problems.push(`${where}: date "${meta.date}" must look like "Nov 15, 2026"`); continue; }

    posts.push({ week, slug: meta.slug, folder: `${iso}-${meta.slug}`, sourceDir: path.dirname(file) });
  }
  if (problems.length) throw new Error('Study posts have problems:\n- ' + problems.join('\n- '));
  return posts;
}

function siteSlugs(postsDir, manifest, ownFolders) {
  const slugs = new Map();
  for (const folder of manifest) {
    if (ownFolders.has(folder)) continue; // a study post from an earlier run, not a site post
    const file = path.join(postsDir, folder, 'index.md');
    const meta = fs.existsSync(file) ? parseFrontmatter(fs.readFileSync(file, 'utf8')) : {};
    slugs.set(meta.slug || folder.split('-').slice(3).join('-'), folder);
  }
  return slugs;
}

export function syncStudyPosts({ studyRoot, siteRoot }) {
  const postsDir = path.join(siteRoot, 'blog', 'posts');
  const manifestPath = path.join(postsDir, 'posts.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const posts = collectStudyPosts(studyRoot);
  const ownFolders = new Set(posts.map((p) => p.folder));

  const taken = siteSlugs(postsDir, manifest, ownFolders);
  const seen = new Map();
  const clashes = [];
  for (const p of posts) {
    if (taken.has(p.slug)) clashes.push(`weeks/${p.week}: slug "${p.slug}" is already used by blog/posts/${taken.get(p.slug)}`);
    else if (seen.has(p.slug)) clashes.push(`weeks/${p.week}: slug "${p.slug}" is also used by weeks/${seen.get(p.slug)}`);
    seen.set(p.slug, p.week);
  }
  if (clashes.length) throw new Error('Slug clash. Rename the study post:\n- ' + clashes.join('\n- '));

  for (const p of posts) {
    const target = path.join(postsDir, p.folder);
    fs.rmSync(target, { recursive: true, force: true });
    fs.cpSync(p.sourceDir, target, { recursive: true });
  }

  const next = [...new Set([...manifest, ...ownFolders])].sort().reverse();
  fs.writeFileSync(manifestPath, JSON.stringify(next, null, 2) + '\n');
  return posts.map((p) => p.folder);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const studyRoot = process.argv[2];
  if (!studyRoot) {
    console.error('Usage: node scripts/sync-study-posts.mjs <path-to-study-repo>');
    process.exit(1);
  }
  try {
    const copied = syncStudyPosts({ studyRoot: path.resolve(studyRoot), siteRoot: process.cwd() });
    console.log(copied.length ? `Synced ${copied.length} study post(s):\n  ${copied.join('\n  ')}` : 'No published study posts yet.');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
