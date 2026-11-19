import { COHORT_NAME } from '@/lib/notes';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og-image';

export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${COHORT_NAME}: notes by Vibhavari Bellutagi`;

export default function Image() {
  return renderOgImage({ eyebrow: 'Learning in public', title: `${COHORT_NAME}: my notes, week by week` });
}
