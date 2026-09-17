/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * A multi-page build rather than a single-page app with a router.
 *
 * Three real HTML documents means three real URLs, each with its own title,
 * description and social card, and no client-side router or SPA fallback to
 * configure on the host. A recruiter who lands on /work/ from a search result
 * gets the work page, not an empty shell that then fetches it.
 */
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work/index.html'),
        about: resolve(__dirname, 'about/index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
