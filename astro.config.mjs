import { defineConfig } from 'astro/config';

const normalizeBase = (value) => {
  const resolved = value?.trim();
  if (!resolved) {
    throw new Error(
      "La variable d'environnement BASE_PATH est obligatoire. Exemple: BASE_PATH='/light-static-blog/' (GitHub Pages) ou BASE_PATH='/' (OVH)."
    );
  }

  return resolved.endsWith('/') ? resolved : `${resolved}/`;
};

const rawSite = process.env.SITE?.trim();
if (!rawSite) {
  throw new Error(
    "La variable d'environnement SITE est obligatoire. Exemple: SITE='https://karlos-fr.github.io/light-static-blog' (GitHub Pages) ou SITE='https://votre-domaine.tld' (OVH)."
  );
}

const site = rawSite.endsWith('/') ? rawSite.slice(0, -1) : rawSite;

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  site,
  output: 'static',
  build: {
    outDir: 'dist'
  }
});
