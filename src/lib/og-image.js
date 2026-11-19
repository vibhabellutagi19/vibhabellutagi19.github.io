// Link preview cards (Open Graph / X) for posts and notes, drawn at build time.
// One card per page, so a shared link shows that page's title instead of the generic site image.
import fs from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { profile } from '@/data/site';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const COLORS = {
  paper: '#f4efe6',
  charcoal: '#1e1e1c',
  soft: '#5a554c',
  line: '#c9bca4',
  accent: '#2457d6',
};

// Satori reads WOFF/TTF, not the WOFF2 that next/font serves, so the card uses its own copies.
const FONT_FILES = [
  { name: 'Fraunces', file: '@fontsource/fraunces/files/fraunces-latin-600-normal.woff', weight: 600 },
  { name: 'Inter', file: '@fontsource/inter/files/inter-latin-400-normal.woff', weight: 400 },
  { name: 'Inter', file: '@fontsource/inter/files/inter-latin-600-normal.woff', weight: 600 },
];

let assetsPromise;

function loadAssets() {
  assetsPromise ??= Promise.all([
    Promise.all(
      FONT_FILES.map(async ({ name, file, weight }) => ({
        name,
        weight,
        style: 'normal',
        data: await fs.readFile(path.join(process.cwd(), 'node_modules', file)),
      }))
    ),
    fs.readFile(path.join(process.cwd(), 'public', profile.avatar)),
  ]).then(([fonts, avatar]) => ({ fonts, avatar: `data:image/jpeg;base64,${avatar.toString('base64')}` }));
  return assetsPromise;
}

/** Long titles get smaller type so they still fit in three lines. */
export function titleSize(title) {
  const length = [...title].length;
  if (length <= 40) return 76;
  if (length <= 70) return 64;
  if (length <= 100) return 54;
  return 46;
}

/** Card text: titles past ~140 characters are cut at a word, so the layout never overflows. */
export function fitTitle(title, max = 140) {
  if ([...title].length <= max) return title;
  const cut = title.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : max).trimEnd()}…`;
}

export async function renderOgImage({ eyebrow, title, tags = [], site = 'buildwithvibs.in' }) {
  const { fonts, avatar } = await loadAssets();
  const text = fitTitle(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: COLORS.paper,
          color: COLORS.charcoal,
          fontFamily: 'Inter',
          borderTop: `14px solid ${COLORS.charcoal}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: COLORS.accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Fraunces',
              fontWeight: 600,
              fontSize: titleSize(text),
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1040,
            }}
          >
            {text}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws plain <img> */}
            <img src={avatar} width={64} height={64} alt="" style={{ borderRadius: 32 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 600 }}>{profile.name}</div>
              <div style={{ display: 'flex', fontSize: 22, color: COLORS.soft }}>{site}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  padding: '8px 18px',
                  border: `2px solid ${COLORS.line}`,
                  borderRadius: 999,
                  fontSize: 22,
                  color: COLORS.soft,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  );
}
