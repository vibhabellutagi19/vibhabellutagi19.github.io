// Likes API for the blog.
//
//   GET    /likes/:slug  -> { count, liked }
//   POST   /likes/:slug  -> like (once per visitor)
//   DELETE /likes/:slug  -> unlike
//
// Counts live in KV under `count:<slug>`. Each like also stores a marker under
// `liker:<slug>:<hash>`, where the hash is a salted SHA-256 of the visitor's IP,
// so one visitor can't like a post twice and raw IPs are never stored.

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 120;

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// Any local dev server, whatever port it lands on.
const LOCALHOST_ORIGIN = /^http:\/\/localhost:\d+$/;

function isAllowedOrigin(origin, env) {
  return LOCALHOST_ORIGIN.test(origin) || getAllowedOrigins(env).includes(origin);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && isAllowedOrigin(origin, env)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors },
  });
}

async function hashVisitor(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const data = new TextEncoder().encode(`${env.IP_SALT || ''}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readCount(env, slug) {
  const value = await env.LIKES.get(`count:${slug}`);
  const count = Number.parseInt(value || '0', 10);
  return Number.isNaN(count) ? 0 : count;
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const match = new URL(request.url).pathname.match(/^\/likes\/([^/]+)\/?$/);
    if (!match) {
      return json({ error: 'Not found' }, 404, cors);
    }

    const slug = match[1];
    if (slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
      return json({ error: 'Invalid slug' }, 400, cors);
    }

    // Only the site itself may change counts; reads are open.
    if (request.method !== 'GET' && !cors['Access-Control-Allow-Origin']) {
      return json({ error: 'Forbidden' }, 403, cors);
    }

    const markerKey = `liker:${slug}:${await hashVisitor(request, env)}`;
    const countKey = `count:${slug}`;
    const liked = (await env.LIKES.get(markerKey)) !== null;
    let count = await readCount(env, slug);

    switch (request.method) {
      case 'GET':
        return json({ count, liked }, 200, cors);

      case 'POST':
        if (!liked) {
          count += 1;
          await env.LIKES.put(markerKey, '1');
          await env.LIKES.put(countKey, String(count));
        }
        return json({ count, liked: true }, 200, cors);

      case 'DELETE':
        if (liked) {
          count = Math.max(0, count - 1);
          await env.LIKES.delete(markerKey);
          await env.LIKES.put(countKey, String(count));
        }
        return json({ count, liked: false }, 200, cors);

      default:
        return json({ error: 'Method not allowed' }, 405, cors);
    }
  },
};
