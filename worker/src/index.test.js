import { beforeEach, describe, expect, it } from 'vitest';

import worker from './index';

const SITE = 'https://buildwithvibs.in';

function createEnv() {
  const store = new Map();
  return {
    ALLOWED_ORIGINS: `${SITE},http://localhost:3000`,
    IP_SALT: 'test-salt',
    LIKES: {
      get: async (key) => (store.has(key) ? store.get(key) : null),
      put: async (key, value) => {
        store.set(key, value);
      },
      delete: async (key) => {
        store.delete(key);
      },
    },
  };
}

function call(env, method, path, { ip = '1.1.1.1', origin = SITE } = {}) {
  const headers = { 'CF-Connecting-IP': ip };
  if (origin) {
    headers.Origin = origin;
  }
  return worker.fetch(new Request(`https://likes.example${path}`, { method, headers }), env);
}

describe('likes worker', () => {
  let env;

  beforeEach(() => {
    env = createEnv();
  });

  it('starts at zero', async () => {
    const res = await call(env, 'GET', '/likes/spark-basics');
    expect(await res.json()).toEqual({ count: 0, liked: false });
  });

  it('counts one like per visitor', async () => {
    await call(env, 'POST', '/likes/spark-basics');
    await call(env, 'POST', '/likes/spark-basics');
    await call(env, 'POST', '/likes/spark-basics', { ip: '2.2.2.2' });

    const res = await call(env, 'GET', '/likes/spark-basics');
    expect(await res.json()).toEqual({ count: 2, liked: true });
  });

  it('unlikes only an existing like', async () => {
    await call(env, 'POST', '/likes/git-essentials');
    await call(env, 'DELETE', '/likes/git-essentials');
    const res = await call(env, 'DELETE', '/likes/git-essentials');
    expect(await res.json()).toEqual({ count: 0, liked: false });
  });

  it('rejects writes from other origins', async () => {
    const res = await call(env, 'POST', '/likes/spark-basics', { origin: 'https://evil.example' });
    expect(res.status).toBe(403);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('rejects invalid slugs and unknown routes', async () => {
    expect((await call(env, 'GET', '/likes/Bad_Slug')).status).toBe(400);
    expect((await call(env, 'GET', '/stats')).status).toBe(404);
  });

  it('answers CORS preflight for the site', async () => {
    const res = await call(env, 'OPTIONS', '/likes/spark-basics');
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
  });
});
