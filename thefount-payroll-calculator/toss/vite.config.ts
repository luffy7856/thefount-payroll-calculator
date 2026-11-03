import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* The Toss mini app build: a static, relative-path bundle in toss/dist (no basePath, no server). */
export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2019', assetsInlineLimit: 0, sourcemap: false },
  server: { port: 8981, strictPort: true, fs: { allow: ['..'] } },
  preview: { port: 8982, strictPort: true },
});
