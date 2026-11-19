import { describe, expect, it } from 'vitest';

import {
  buildNotes,
  countNoteTags,
  groupByWeek,
  extractRecall,
  extractWikilinks,
  getRelatedNotes,
  parseNoteDate,
  renderInline,
  replaceWikilinks,
  validateNote,
} from '../notes';

const file = (slug, fields = {}, body = 'Body.', { isDraftFile = false } = {}) => {
  const meta = {
    title: slug,
    type: 'concept',
    status: 'published',
    date: '2026-11-19',
    summary: `About ${slug}.`,
    ...fields,
  };
  const frontmatter = Object.entries(meta)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return { slug, raw: `---\n${frontmatter}\n---\n${body}`, isDraftFile };
};

describe('parseNoteDate', () => {
  it('formats ISO dates without time-zone drift', () => {
    expect(parseNoteDate('2026-11-19')).toMatchObject({ iso: '2026-11-19', display: 'Nov 19, 2026' });
  });

  it('rejects other formats and impossible dates', () => {
    expect(parseNoteDate('Nov 19, 2026')).toBeNull();
    expect(parseNoteDate('2026-02-30')).toBeNull();
    expect(parseNoteDate('')).toBeNull();
  });
});

describe('wikilinks', () => {
  it('extracts distinct slugs and ignores code', () => {
    const md = 'See [[Redis Cluster]] and [[sqlite-wal|WAL]].\n\n`[[not-a-link]]`\n\n```\n[[also-not]]\n```\n[[redis-cluster]]';
    expect(extractWikilinks(md)).toEqual(['redis-cluster', 'sqlite-wal']);
  });

  it('links published notes and leaves the rest as plain text', () => {
    const notes = { 'redis-cluster': { slug: 'redis-cluster', title: 'Redis Cluster hash slots' } };
    const html = replaceWikilinks('[[redis-cluster]], [[redis-cluster|slots]] and [[group-commit]]', (slug) => notes[slug] ?? null);

    expect(html).toBe(
      '[Redis Cluster hash slots](/notes/redis-cluster/), [slots](/notes/redis-cluster/) and ' +
        '<span class="wikilink-missing" title="Not published yet">group commit</span>'
    );
  });

  it('escapes labels of missing links', () => {
    expect(replaceWikilinks('[[x|<b>]]', () => null)).toContain('&lt;b&gt;');
  });
});

describe('extractRecall', () => {
  it('pulls Q/A cards out of the note body', () => {
    const md = 'Intro.\n\n:::recall\nQ: Why shard SQLite?\nA: One writer per file,\nso more files = more writers.\n\nQ: Orphan question\n:::\n\nOutro.';
    const { content, cards } = extractRecall(md);

    expect(cards).toEqual([{ q: 'Why shard SQLite?', a: 'One writer per file, so more files = more writers.' }]);
    expect(content).not.toContain(':::recall');
    expect(content).toContain('Outro.');
  });

  it('ignores a recall block shown inside a code fence', () => {
    const { content, cards } = extractRecall('```md\n:::recall\nQ: q\nA: a\n:::\n```');
    expect(cards).toEqual([]);
    expect(content).toContain(':::recall');
  });

  it('renders inline code safely', () => {
    expect(renderInline('Use `<b>` & go')).toBe('Use <code>&lt;b&gt;</code> &amp; go');
  });
});

describe('validateNote', () => {
  const note = (metadata, content = '') => ({ slug: 'ok-note', metadata, content });
  const valid = { title: 'T', type: 'concept', date: '2026-11-19', summary: 'S' };

  it('accepts a valid concept note', () => {
    expect(validateNote(note(valid))).toEqual([]);
  });

  it('requires a source URL on source notes and a week on cohort notes', () => {
    expect(validateNote(note({ ...valid, type: 'source' })).join()).toMatch(/source_url/);
    expect(validateNote(note({ ...valid, type: 'cohort' })).join()).toMatch(/cohort_week/);
  });

  it('blocks publishing with verify markers or an over-long tweet', () => {
    const problems = validateNote(note({ ...valid, status: 'published', tweet: 'x'.repeat(281) }, 'Claim <!-- verify -->'));
    expect(problems.join()).toMatch(/verify/);
    expect(problems.join()).toMatch(/281 characters/);
  });

  it('allows verify markers in drafts', () => {
    expect(validateNote(note({ ...valid, status: 'draft' }, '<!-- verify: check this -->'))).toEqual([]);
  });

  it('rejects bad slugs and dates', () => {
    const problems = validateNote({ slug: 'Bad Slug', metadata: { ...valid, date: '19/11/2026' }, content: '' });
    expect(problems.join()).toMatch(/kebab-case/);
    expect(problems.join()).toMatch(/YYYY-MM-DD/);
  });
});

describe('buildNotes', () => {
  it('drops drafts and notes without a status from a build', () => {
    const notes = buildNotes([
      file('published'),
      file('marked-draft', { status: 'draft' }),
      file('no-status', { status: undefined }),
      file('in-drafts-folder', {}, 'Body.', { isDraftFile: true }),
    ]);
    expect(notes.map((note) => note.slug)).toEqual(['published']);
  });

  it('keeps drafts in dev, even invalid ones', () => {
    const notes = buildNotes([file('draft', { status: 'draft', summary: undefined })], { includeDrafts: true });
    expect(notes.map((note) => [note.slug, note.status])).toEqual([['draft', 'draft']]);
  });

  it('treats anything in notes/drafts as a draft, whatever its status says', () => {
    const notes = buildNotes([file('sneaky', { status: 'published' }, 'Body.', { isDraftFile: true })], { includeDrafts: true });
    expect(notes[0].status).toBe('draft');
  });

  it('fails the build on an invalid published note, listing every problem', () => {
    expect(() => buildNotes([file('a', { title: undefined }), file('b', { date: 'soon' })])).toThrow(
      /notes\/a\.md: title is required[\s\S]*notes\/b\.md: date/
    );
  });

  it('fails on a slug used in notes/ and notes/drafts/', () => {
    expect(() => buildNotes([file('dup'), file('dup', {}, 'x', { isDraftFile: true })], { includeDrafts: true })).toThrow(
      /used twice/
    );
  });

  it('sorts newest first and computes backlinks from published notes only', () => {
    const notes = buildNotes([
      file('concept', { date: '2026-11-01' }),
      file('source-a', { date: '2026-11-19' }, 'Uses [[concept]].'),
      file('source-b', { date: '2026-11-10' }, 'Also [[Concept]] and [[missing]].'),
      file('draft', { status: 'draft' }, 'Mentions [[concept]].'),
    ]);

    expect(notes.map((note) => note.slug)).toEqual(['source-a', 'source-b', 'concept']);
    const concept = notes.find((note) => note.slug === 'concept');
    expect(concept.backlinks.map((link) => link.slug)).toEqual(['source-a', 'source-b']);
    expect(notes.find((note) => note.slug === 'source-b').unresolvedLinks).toEqual(['missing']);
  });

  it('parses tags, blog posts, the AI flag and recall cards', () => {
    const [note] = buildNotes([
      file(
        'n',
        { tags: 'Databases, SQLite', blog_posts: 'prevent-double-booking-postgres', ai_assisted: 'false' },
        ':::recall\nQ: q?\nA: a.\n:::'
      ),
    ]);
    expect(note.tags).toEqual(['databases', 'sqlite']);
    expect(note.blogPosts).toEqual(['prevent-double-booking-postgres']);
    expect(note.aiAssisted).toBe(false);
    expect(note.recall).toEqual([{ q: 'q?', a: 'a.' }]);
  });
});

describe('getRelatedNotes', () => {
  it('ranks by shared tags and skips notes already linked either way', () => {
    const notes = buildNotes([
      file('main', { tags: 'a, b' }, '[[linked]]'),
      file('linked', { tags: 'a, b' }),
      file('two-shared', { tags: 'a, b', date: '2026-11-01' }),
      file('one-shared', { tags: 'a' }),
      file('none', { tags: 'z' }),
    ]);
    const main = notes.find((note) => note.slug === 'main');
    expect(getRelatedNotes(notes, main).map((note) => note.slug)).toEqual(['two-shared', 'one-shared']);
  });
});

describe('tag vocabulary', () => {
  const allowedTags = ['databases', 'redis'];

  it('fails the build on a published note with a tag outside notes/tags.json', () => {
    expect(() => buildNotes([file('a', { tags: 'databases, db' })], { allowedTags })).toThrow(/tag "db" isn't in notes\/tags\.json/);
  });

  it('accepts listed tags, and skips the check when there is no list', () => {
    expect(buildNotes([file('a', { tags: 'Databases, redis' })], { allowedTags })).toHaveLength(1);
    expect(buildNotes([file('a', { tags: 'anything' })])).toHaveLength(1);
  });

  it('only warns for drafts', () => {
    const notes = buildNotes([file('d', { status: 'draft', tags: 'db' })], { includeDrafts: true, allowedTags });
    expect(notes).toHaveLength(1);
  });

  it('counts tags, most used first', () => {
    const notes = buildNotes([file('a', { tags: 'redis, databases' }), file('b', { tags: 'databases' })]);
    expect(countNoteTags(notes)).toEqual([
      { tag: 'databases', count: 2 },
      { tag: 'redis', count: 1 },
    ]);
  });
});

describe('groupByWeek', () => {
  it('groups cohort notes by week in course order, oldest first within a week', () => {
    const notes = buildNotes([
      file('w2', { type: 'cohort', cohort_week: '2', date: '2027-01-12' }),
      file('w1-late', { type: 'cohort', cohort_week: '1', date: '2027-01-08' }),
      file('w1-early', { type: 'cohort', cohort_week: '1', date: '2027-01-05' }),
      file('not-cohort', { type: 'concept' }),
    ]);
    expect(groupByWeek(notes).map(({ week, notes: items }) => [week, items.map((note) => note.slug)])).toEqual([
      [1, ['w1-early', 'w1-late']],
      [2, ['w2']],
    ]);
  });
});
