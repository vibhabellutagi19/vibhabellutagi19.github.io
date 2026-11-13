import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { syncStudyPosts, toIsoDate } from '../sync-study-posts.mjs';

let tmp, site, study;

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}
function studyPost(week, { slug, date = 'Nov 22, 2026', published = true, title = 'A post' }) {
  write(
    path.join(study, 'weeks', week, 'post', 'index.md'),
    `---\ntitle: "${title}"\ndate: "${date}"\nslug: "${slug}"\npublished: ${published}\n---\n\nBody.\n`
  );
}
const manifest = () => JSON.parse(fs.readFileSync(path.join(site, 'blog/posts/posts.json'), 'utf8'));

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-'));
  site = path.join(tmp, 'site');
  study = path.join(tmp, 'study');
  write(path.join(site, 'blog/posts/2026-10-22-prevent-double-booking-postgres/index.md'), '---\ntitle: "x"\nslug: "prevent-double-booking-postgres"\n---\n');
  write(path.join(site, 'blog/posts/posts.json'), JSON.stringify(['2026-10-22-prevent-double-booking-postgres']));
  fs.mkdirSync(path.join(study, 'weeks'), { recursive: true });
});
afterEach(() => fs.rmSync(tmp, { recursive: true, force: true }));

describe('toIsoDate', () => {
  it('turns the display date into a folder date without time zone drift', () => {
    expect(toIsoDate('Nov 5, 2026')).toBe('2026-11-05');
    expect(toIsoDate('November 22, 2026')).toBe('2026-11-22');
    expect(toIsoDate('22/11/2026')).toBeNull();
  });
});

describe('syncStudyPosts', () => {
  it('copies a published post and puts it first in posts.json', () => {
    studyPost('w01-qr-core', { slug: 'viral-cafe' });
    write(path.join(study, 'weeks/w01-qr-core/post/assets/p99.png'), 'png');

    syncStudyPosts({ studyRoot: study, siteRoot: site });

    expect(manifest()).toEqual(['2026-11-22-viral-cafe', '2026-10-22-prevent-double-booking-postgres']);
    expect(fs.existsSync(path.join(site, 'blog/posts/2026-11-22-viral-cafe/assets/p99.png'))).toBe(true);
  });

  it('never copies a draft', () => {
    studyPost('w01-qr-core', { slug: 'viral-cafe', published: false });

    syncStudyPosts({ studyRoot: study, siteRoot: site });

    expect(manifest()).toEqual(['2026-10-22-prevent-double-booking-postgres']);
    expect(fs.existsSync(path.join(site, 'blog/posts/2026-11-22-viral-cafe'))).toBe(false);
  });

  it('fails on a slug the site already uses, and writes nothing', () => {
    studyPost('w01-qr-core', { slug: 'prevent-double-booking-postgres' });

    expect(() => syncStudyPosts({ studyRoot: study, siteRoot: site })).toThrow(/already used/);
    expect(manifest()).toEqual(['2026-10-22-prevent-double-booking-postgres']);
  });

  it('fails when two study posts share a slug', () => {
    studyPost('w01-qr-core', { slug: 'same' });
    studyPost('w02-drop', { slug: 'same', date: 'Nov 29, 2026' });

    expect(() => syncStudyPosts({ studyRoot: study, siteRoot: site })).toThrow(/also used/);
  });

  it('fails on a bad date instead of guessing', () => {
    studyPost('w01-qr-core', { slug: 'viral-cafe', date: '22/11/2026' });

    expect(() => syncStudyPosts({ studyRoot: study, siteRoot: site })).toThrow(/must look like/);
  });

  it('gives the same result when run twice', () => {
    studyPost('w01-qr-core', { slug: 'viral-cafe' });

    syncStudyPosts({ studyRoot: study, siteRoot: site });
    const first = manifest();
    syncStudyPosts({ studyRoot: study, siteRoot: site });

    expect(manifest()).toEqual(first);
  });
});
