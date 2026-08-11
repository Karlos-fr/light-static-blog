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

const rootRelativeUrlAttributes = ['href', 'src', 'poster', 'cite'];

const prefixRootRelativeUrl = (value, base) => {
  if (
    typeof value !== 'string' ||
    base === '/' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith(base)
  ) {
    return value;
  }

  return `${base.replace(/\/$/, '')}${value}`;
};

const prefixRootRelativeSrcset = (value, base) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .split(',')
    .map((candidate) => {
      const match = candidate.trim().match(/^(\S+)(.*)$/);

      return match
        ? `${prefixRootRelativeUrl(match[1], base)}${match[2]}`
        : candidate;
    })
    .join(', ');
};

function rehypeBasePathForRootRelativeUrls({ base }) {
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (node.properties && typeof node.properties === 'object') {
        for (const attribute of rootRelativeUrlAttributes) {
          node.properties[attribute] = prefixRootRelativeUrl(
            node.properties[attribute],
            base
          );
        }

        node.properties.srcset = prefixRootRelativeSrcset(
          node.properties.srcset,
          base
        );
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}

const base = normalizeBase(process.env.BASE_PATH);
const rawSite = process.env.SITE?.trim();
if (!rawSite) {
  throw new Error(
    "La variable d'environnement SITE est obligatoire. Exemple: SITE='https://karlos-fr.github.io/light-static-blog' (GitHub Pages) ou SITE='https://votre-domaine.tld' (OVH)."
  );
}

const site = rawSite.endsWith('/') ? rawSite.slice(0, -1) : rawSite;

if (!process.env.AUTHOR_NAME?.trim()) {
  throw new Error(
    "La variable d'environnement AUTHOR_NAME est obligatoire. Exemple: AUTHOR_NAME='Nom de l auteur'."
  );
}

export default defineConfig({
  base,
  site,
  output: 'static',
  markdown: {
    rehypePlugins: [[rehypeBasePathForRootRelativeUrls, { base }]]
  },
  build: {
    outDir: 'dist'
  }
});
