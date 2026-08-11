import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

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

const publicDir = join(process.cwd(), 'public');

const addClassName = (properties, className) => {
  const current = properties.className;
  const classNames = Array.isArray(current)
    ? current
    : typeof current === 'string'
      ? current.split(/\s+/).filter(Boolean)
      : [];

  if (!classNames.includes(className)) {
    classNames.push(className);
  }

  properties.className = classNames;
};

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

const getPublicImagePath = (value, base) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  let path = value.split(/[?#]/, 1)[0];

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) {
    return undefined;
  }

  if (base !== '/' && path.startsWith(base)) {
    path = `/${path.slice(base.length)}`;
  }

  if (!path.startsWith('/')) {
    return undefined;
  }

  return join(publicDir, ...path.split('/').filter(Boolean));
};

const getPngDimensions = (filePath) => {
  const buffer = readFileSync(filePath);

  if (
    buffer.length < 24 ||
    buffer.readUInt32BE(0) !== 0x89504e47 ||
    buffer.readUInt32BE(4) !== 0x0d0a1a0a
  ) {
    return undefined;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
};

const getImageDimensions = (src, base) => {
  const filePath = getPublicImagePath(src, base);
  if (!filePath || !existsSync(filePath)) {
    return undefined;
  }

  const extension = extname(filePath).toLowerCase();

  return extension === '.png' ? getPngDimensions(filePath) : undefined;
};

const getImageOrientation = (dimensions) => {
  if (!dimensions) {
    return undefined;
  }

  const ratio = dimensions.width / dimensions.height;

  if (ratio >= 1.2) {
    return 'landscape';
  }

  if (ratio <= 0.85) {
    return 'portrait';
  }

  return 'square';
};

const getMeaningfulChildren = (node) => {
  if (!Array.isArray(node.children)) {
    return [];
  }

  return node.children.filter(
    (child) => child.type !== 'text' || child.value.trim() !== ''
  );
};

const getLinkUrl = (href) => {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) {
    return undefined;
  }

  try {
    return new URL(href);
  } catch {
    return undefined;
  }
};

const enhanceLinkNode = (node, siteOrigin) => {
  if (node?.type !== 'element' || node.tagName !== 'a') {
    return;
  }

  node.properties = node.properties || {};
  const url = getLinkUrl(node.properties.href);
  if (!url || url.origin === siteOrigin) {
    return;
  }

  node.properties.target = node.properties.target || '_blank';
  node.properties.rel = node.properties.rel || 'noopener noreferrer';
  addClassName(node.properties, 'external-link');

  if (url.hostname === 'github.com' || url.hostname.endsWith('.github.com')) {
    addClassName(node.properties, 'github-link');
  }
};

const enhanceImageNode = (node, base) => {
  if (node?.type !== 'element' || node.tagName !== 'img') {
    return undefined;
  }

  node.properties = node.properties || {};
  node.properties.loading = node.properties.loading || 'lazy';
  node.properties.decoding = node.properties.decoding || 'async';
  node.properties.tabIndex = node.properties.tabIndex ?? 0;
  node.properties.dataZoomable = 'true';
  addClassName(node.properties, 'article-image');

  const dimensions = getImageDimensions(node.properties.src, base);
  if (dimensions) {
    node.properties.width = node.properties.width || dimensions.width;
    node.properties.height = node.properties.height || dimensions.height;
  }

  const orientation = getImageOrientation(dimensions);
  if (orientation) {
    addClassName(node.properties, `article-image--${orientation}`);
  }

  return { dimensions, orientation };
};

function rehypeArticleContentEnhancements({ base, siteOrigin }) {
  return (tree) => {
    const visit = (node) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node.children)) {
        node.children = node.children.map((child) => {
          if (child?.type === 'element' && child.tagName === 'p') {
            const meaningfulChildren = getMeaningfulChildren(child);
            const image = meaningfulChildren[0];

            if (
              meaningfulChildren.length === 1 &&
              image?.type === 'element' &&
              image.tagName === 'img'
            ) {
              const { orientation } = enhanceImageNode(image, base) || {};
              const alt = image.properties?.alt;
              const figure = {
                type: 'element',
                tagName: 'figure',
                properties: {
                  className: [
                    'article-figure',
                    ...(orientation ? [`article-figure--${orientation}`] : []),
                  ],
                },
                children: [image],
              };

              if (typeof alt === 'string' && alt.trim()) {
                figure.children.push({
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [{ type: 'text', value: alt.trim() }],
                });
              }

              return figure;
            }
          }

          return child;
        });
      }

      if (node.properties && typeof node.properties === 'object') {
        enhanceLinkNode(node, siteOrigin);
        enhanceImageNode(node, base);

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
    rehypePlugins: [[rehypeArticleContentEnhancements, { base, siteOrigin: new URL(site).origin }]]
  },
  build: {
    outDir: 'dist'
  }
});
