// Notes: short, linked write-ups of what I learn (blogs I read, cohort sessions).
// They live in notes/*.md and are served at /notes/<slug>/. See notes/README.md for the format.
//
// Safety rules, enforced here so a mistake fails the build instead of reaching the site:
// - Only `status: published` notes are built. A note without a status is a draft.
// - notes/drafts/ is git-ignored and only read by `next dev`, so drafts never reach the public repo.
// - A published note that is invalid, or still has a `<!-- verify -->` marker, fails the build.
import fs from 'node:fs/promises';
import path from 'node:path';

import { getHeadings, mapOutsideCode, mapOutsideFences, parseFrontmatter, renderMarkdownToHtml, slugify } from './markdown';

const NOTES_DIR = path.join(process.cwd(), 'notes');
const DRAFTS_DIR = path.join(NOTES_DIR, 'drafts');
// The only tags a note may use, so "db", "database" and "databases" never split one topic in three.
const TAGS_FILE = path.join(NOTES_DIR, 'tags.json');

export const NOTES_PATH = '/notes';
export const COHORT_NAME = 'Software-dev cohort';
export const COHORT_PATH = `${NOTES_PATH}/cohort/`;

export const NOTE_TYPES = {
  source: 'Blog note',
  concept: 'Concept',
  cohort: 'Cohort',
  log: 'Log',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERIFY_MARKER = /<!--\s*verify\b[\s\S]*?-->/i;
const WIKILINK = /\[\[([^\]|\n]+?)(?:\|([^\]\n]+))?\]\]/g;
const TWEET_LIMIT = 280;

export function noteHref(slug) {
  return `${NOTES_PATH}/${slug}/`;
}

export function noteTagHref(tag) {
  return `${NOTES_PATH}/tags/${tag}/`;
}

export function cohortWeekHref(week) {
  return `${COHORT_PATH}#week-${week}`;
}

/** "2026-11-19" -> { iso, display: "Nov 19, 2026", time } or null. Parsed by hand so the day never shifts with the time zone. */
export function parseNoteDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match.map(Number);
  const time = Date.UTC(year, month - 1, day);
  const check = new Date(time);
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null;
  }
  return { iso: match[0], display: `${MONTHS[month - 1]} ${day}, ${year}`, time };
}

function parseList(raw) {
  return (raw || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTags(raw) {
  return parseList(raw)
    .map((tag) =>
      tag
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .filter(Boolean);
}

/** The note slug a `[[target]]` points at: "Redis Cluster" and "redis-cluster" are the same link. */
export function wikilinkSlug(target) {
  return slugify(target.trim());
}

/** Every distinct note slug linked from `markdown`, in order of first use. */
export function extractWikilinks(markdown) {
  const slugs = [];
  mapOutsideCode(markdown, (part) => {
    for (const [, target] of part.matchAll(WIKILINK)) {
      const slug = wikilinkSlug(target);
      if (!slugs.includes(slug)) {
        slugs.push(slug);
      }
    }
    return part;
  });
  return slugs;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Turns `[[slug]]` and `[[slug|label]]` into links. `resolve(slug)` returns the linked note or null.
 * A link to a note that isn't published (a draft, or not written yet) becomes plain text,
 * so the site never points at a missing page or reveals a draft.
 */
export function replaceWikilinks(markdown, resolve) {
  return mapOutsideCode(markdown, (part) =>
    part.replace(WIKILINK, (_, target, label) => {
      const note = resolve(wikilinkSlug(target));
      // An unwritten note linked by slug reads better as words: "redis-cluster" -> "redis cluster".
      const fallback = /^[a-z0-9-]+$/.test(target.trim()) ? target.trim().replace(/-/g, ' ') : target;
      const text = (label || (note ? note.title : fallback)).trim();
      if (!note) {
        return `<span class="wikilink-missing" title="Not published yet">${escapeHtml(text)}</span>`;
      }
      return `[${text.replace(/[[\]]/g, '\\$&')}](${noteHref(note.slug)})`;
    })
  );
}

/**
 * Pulls the `:::recall` block out of a note. Inside it, each card is a `Q:` line followed by an `A:` line.
 * Returns the note without the block, and the cards.
 */
export function extractRecall(markdown) {
  const cards = [];
  const collect = (_, body) => {
    let current = null;
    body.split('\n').forEach((line) => {
      const q = line.match(/^\s*Q:\s*(.+)$/);
      const a = line.match(/^\s*A:\s*(.+)$/);
      if (q) {
        current = { q: q[1].trim(), a: '' };
        cards.push(current);
      } else if (a && current) {
        current.a = a[1].trim();
      } else if (current && current.a && line.trim()) {
        current.a = `${current.a} ${line.trim()}`;
      }
    });
    return '\n';
  };

  // Outside code fences only, so a note can show the :::recall syntax in a code block.
  const content = mapOutsideFences(markdown, (text) => text.replace(/\n?:::recall\n([\s\S]*?)\n:::\n?/g, collect));
  return { content, cards: cards.filter((card) => card.a) };
}

/** Recall text is short: escape it and keep `inline code`. */
export function renderInline(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function estimateReadTime(content) {
  const words = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/**
 * Problems with one note, as messages. A published note with any of these fails the build.
 * `allowedTags` is the list in notes/tags.json; leave it out to skip the tag check.
 */
export function validateNote(note, { allowedTags } = {}) {
  const problems = [];
  const { slug, metadata, content } = note;

  if (!SLUG_PATTERN.test(slug)) {
    problems.push(`file name "${slug}.md" must be kebab-case (a-z, 0-9, hyphens)`);
  }
  if (!metadata.title) {
    problems.push('title is required');
  }
  if (!NOTE_TYPES[metadata.type]) {
    problems.push(`type must be one of ${Object.keys(NOTE_TYPES).join(', ')}`);
  }
  if (metadata.status && !['draft', 'published'].includes(metadata.status)) {
    problems.push('status must be draft or published');
  }
  if (!parseNoteDate(metadata.date)) {
    problems.push('date must be a real date written YYYY-MM-DD');
  }
  if (!metadata.summary) {
    problems.push('summary is required (one line, used in lists and link previews)');
  }
  if (metadata.type === 'source' && !/^https:\/\//.test(metadata.source_url || '')) {
    problems.push('source_url (https) is required for a source note');
  }
  if (metadata.type === 'cohort' && !/^\d+$/.test(metadata.cohort_week || '')) {
    problems.push('cohort_week (a number) is required for a cohort note');
  }
  if (metadata.tweet && [...metadata.tweet].length > TWEET_LIMIT) {
    problems.push(`tweet is ${[...metadata.tweet].length} characters; the limit is ${TWEET_LIMIT}`);
  }
  if (allowedTags) {
    (note.tags ?? []).forEach((tag) => {
      if (!allowedTags.includes(tag)) {
        problems.push(`tag "${tag}" isn't in notes/tags.json: use an existing tag, or add it there if it's a new topic`);
      }
    });
  }
  if (metadata.status === 'published' && VERIFY_MARKER.test(content)) {
    problems.push('still has a <!-- verify --> marker: check the claim against the source, then remove the marker');
  }

  return problems;
}

function toNote({ slug, raw, isDraftFile }) {
  const { metadata, content: body } = parseFrontmatter(raw);
  const { content, cards } = extractRecall(body);
  const date = parseNoteDate(metadata.date);
  const status = isDraftFile ? 'draft' : metadata.status === 'published' ? 'published' : 'draft';

  return {
    slug,
    metadata,
    status,
    title: metadata.title || slug,
    type: metadata.type,
    typeLabel: NOTE_TYPES[metadata.type] || 'Note',
    date: date?.iso ?? '',
    displayDate: date?.display ?? '',
    time: date?.time ?? 0,
    summary: metadata.summary || '',
    sourceUrl: metadata.source_url || null,
    sourceAuthor: metadata.source_author || null,
    tags: parseTags(metadata.tags),
    tweet: metadata.tweet || null,
    cohortWeek: metadata.cohort_week ? Number(metadata.cohort_week) : null,
    aiAssisted: metadata.ai_assisted !== 'false',
    blogPosts: parseList(metadata.blog_posts),
    readTime: estimateReadTime(content),
    recall: cards,
    links: extractWikilinks(content),
    content,
  };
}

/**
 * Builds the note list from raw files: `[{ slug, raw, isDraftFile }]`.
 * Drafts are kept only when `includeDrafts` is set (local dev). Throws if a published note is invalid.
 */
export function buildNotes(files, { includeDrafts = false, allowedTags } = {}) {
  const seen = new Set();
  const failures = [];
  const notes = [];

  files.forEach((file) => {
    if (seen.has(file.slug)) {
      failures.push(`notes/${file.slug}.md: the slug is used twice (check notes/drafts/)`);
      return;
    }
    seen.add(file.slug);

    const note = toNote(file);
    const problems = validateNote(note, { allowedTags });
    if (note.status === 'published' && problems.length > 0) {
      failures.push(...problems.map((problem) => `notes/${note.slug}.md: ${problem}`));
      return;
    }
    if (note.status === 'draft') {
      if (!includeDrafts) {
        return;
      }
      if (problems.length > 0) {
        console.warn(`[notes] draft ${note.slug}: ${problems.join('; ')}`);
      }
    }
    notes.push(note);
  });

  if (failures.length > 0) {
    throw new Error(`Invalid notes:\n- ${failures.join('\n- ')}`);
  }

  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const sorted = notes.sort((a, b) => b.time - a.time || a.title.localeCompare(b.title));

  return sorted.map((note) => ({
    ...note,
    backlinks: sorted
      .filter((other) => other.slug !== note.slug && other.links.includes(note.slug))
      .map(({ slug, title, type, typeLabel, summary }) => ({ slug, title, type, typeLabel, summary })),
    unresolvedLinks: note.links.filter((slug) => !bySlug.has(slug)),
  }));
}

async function readMarkdownFiles(dir, isDraftFile) {
  let names;
  try {
    names = await fs.readdir(dir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const files = names.filter((name) => name.endsWith('.md') && name !== 'README.md').sort();
  return Promise.all(
    files.map(async (name) => ({
      slug: name.replace(/\.md$/, ''),
      raw: await fs.readFile(path.join(dir, name), 'utf8'),
      isDraftFile,
    }))
  );
}

async function readAllowedTags() {
  try {
    const tags = JSON.parse(await fs.readFile(TAGS_FILE, 'utf8'));
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')) {
      throw new Error('notes/tags.json must be a list of tag names, e.g. ["databases", "redis"]');
    }
    return tags;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }
}

/** Drafts show up while running `next dev` only, marked as drafts. */
export function shouldIncludeDrafts() {
  return process.env.NODE_ENV === 'development';
}

let cache;

export async function getAllNotes() {
  const includeDrafts = shouldIncludeDrafts();
  // In dev, re-read on every request so edits show up; a build reads once.
  if (cache && !includeDrafts) {
    return cache;
  }

  const files = [
    ...(await readMarkdownFiles(NOTES_DIR, false)),
    ...(includeDrafts ? await readMarkdownFiles(DRAFTS_DIR, true) : []),
  ];
  const notes = buildNotes(files, { includeDrafts, allowedTags: await readAllowedTags() });
  if (!includeDrafts) {
    cache = notes;
  }
  return notes;
}

export async function getNoteBySlug(slug) {
  const notes = await getAllNotes();
  const note = notes.find((item) => item.slug === slug);
  if (!note) {
    return null;
  }

  const bySlug = new Map(notes.map((item) => [item.slug, item]));
  const linked = replaceWikilinks(note.content, (target) => bySlug.get(target) ?? null);
  const html = await renderMarkdownToHtml(linked, note.slug, { assetBase: `/notes-media/${note.slug}` });

  return { ...note, html, headings: getHeadings(html) };
}

/** Notes sharing the most tags with `note`, newest first among equals, skipping ones already linked. */
export function getRelatedNotes(notes, note, { limit = 3 } = {}) {
  const skip = new Set([note.slug, ...note.links, ...note.backlinks.map((item) => item.slug)]);
  return notes
    .filter((item) => !skip.has(item.slug))
    .map((item) => ({ item, score: item.tags.filter((tag) => note.tags.includes(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.time - a.item.time)
    .slice(0, limit)
    .map(({ item }) => item);
}

/** Tags in use by `notes`, most used first: `[{ tag, count }]`. */
export function countNoteTags(notes) {
  const counts = new Map();
  notes.forEach((note) => note.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Cohort notes by week, in course order: `[{ week, notes }]`, each week oldest note first. */
export function groupByWeek(notes) {
  const weeks = new Map();
  notes
    .filter((note) => note.type === 'cohort' && note.cohortWeek)
    .forEach((note) => weeks.set(note.cohortWeek, [...(weeks.get(note.cohortWeek) ?? []), note]));
  return [...weeks]
    .sort(([a], [b]) => a - b)
    .map(([week, items]) => ({ week, notes: items.sort((a, b) => a.time - b.time || a.title.localeCompare(b.title)) }));
}

