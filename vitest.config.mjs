import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// Mirrors the "@/*" path in jsconfig.json so tests can import app code that uses it.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
