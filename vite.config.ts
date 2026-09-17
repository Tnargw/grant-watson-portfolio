/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs so the built site works from any path, not just a
  // domain root. Cloudflare Pages serves from the root, but this keeps
  // `dist/` portable to subpath hosts and static previews as well.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    reportCompressedSize: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
