import { defineConfig } from 'astro/config';

export default defineConfig({
  base: '/light-static-blog/',
  output: 'static',
  build: {
    outDir: 'dist'
  }
});
