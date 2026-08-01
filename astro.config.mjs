import { defineConfig } from 'astro/config';

const normalizeBase = (value) => {
  const resolved = value ?? '/';
  return resolved.endsWith('/') ? resolved : `${resolved}/`;
};

const rawSite = process.env.SITE ?? 'https://karlos-fr.github.io/light-static-blog';
const site = rawSite.endsWith('/') ? rawSite.slice(0, -1) : rawSite;

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH ?? '/light-static-blog'),
  site,
  output: 'static',
  build: {
    outDir: 'dist'
  }
});
