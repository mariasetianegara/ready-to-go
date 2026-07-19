import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project under /ready-to-go/ (decision D7).
// base is applied in dev AND prod so the local URL matches production
// and any base-path bug fails a test instead of surprising deploy.
export default defineConfig({
  base: '/ready-to-go/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Playwright specs live in /e2e and are run by Playwright, not Vitest.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
