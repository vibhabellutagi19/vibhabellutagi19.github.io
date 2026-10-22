# blog-likes

Cloudflare Worker that stores like counts for blog posts in Workers KV. The site
calls it from `src/components/blog/LikeButton.js`.

## Deploy

```sh
cd worker
npm install
npx wrangler login
npx wrangler kv namespace create LIKES   # paste the printed id into wrangler.toml
npx wrangler secret put IP_SALT          # any long random string
npx wrangler deploy
```

Then put the deployed URL (e.g. `https://blog-likes.<you>.workers.dev`) in
`likes.apiUrl` in `src/data/site.js`.

## API

| Method | Path           | Effect                          |
| ------ | -------------- | ------------------------------- |
| GET    | `/likes/:slug` | `{ count, liked }`              |
| POST   | `/likes/:slug` | Like, once per visitor          |
| DELETE | `/likes/:slug` | Remove this visitor's like      |

Writes are only accepted from origins in `ALLOWED_ORIGINS` (see `wrangler.toml`).
Visitors are identified by a salted hash of their IP, so people behind the same
network share one like.
