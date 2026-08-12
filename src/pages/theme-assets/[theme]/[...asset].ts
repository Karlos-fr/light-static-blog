/**
 * Endpoint statique des assets de thème.
 *
 * Il expose uniquement les fichiers présents dans src/themes/<theme>/assets
 * pour le thème actif, avec des en-têtes de cache longue durée.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import type { APIContext, GetStaticPaths } from 'astro';

import { siteConfig } from '../../../config/site';

/** Force Astro à générer les assets de thème au build statique. */
export const prerender = true;

/** Racine disque contenant les thèmes du projet. */
const themesRoot = path.join(process.cwd(), 'src', 'themes');

/** Types MIME connus pour servir correctement les assets thématiques. */
const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/** Liste récursivement les fichiers d'assets d'un thème. */
async function listAssetFiles(directory: string, prefix = ''): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listAssetFiles(fullPath, relativePath);
      }

      return entry.isFile() ? [relativePath] : [];
    })
  );

  return files.flat();
}

/** Vérifie qu'un chemin d'asset demandé ne tente pas de sortir du dossier assets. */
function isSafeAssetPath(assetPath: string): boolean {
  return Boolean(assetPath) && !assetPath.includes('\\') && !assetPath.split('/').includes('..');
}

/** Déclare à Astro les assets du thème actif à générer. */
export const getStaticPaths: GetStaticPaths = async () => {
  const themes = await readdir(themesRoot, { withFileTypes: true });
  const paths = await Promise.all(
    themes
      .filter((theme) => theme.isDirectory() && theme.name === siteConfig.theme)
      .map(async (theme) => {
        const assetsRoot = path.join(themesRoot, theme.name, 'assets');
        const assets = await listAssetFiles(assetsRoot);

        return assets.map((asset) => ({
          params: {
            theme: theme.name,
            asset,
          },
        }));
      })
  );

  return paths.flat();
};

/** Sert un asset de thème après validation stricte du chemin demandé. */
export async function GET({ params }: APIContext) {
  const theme = params.theme;
  const asset = params.asset;

  if (!theme || !asset || !isSafeAssetPath(asset)) {
    return new Response('Theme asset not found', { status: 404 });
  }

  const assetsRoot = path.join(themesRoot, theme, 'assets');
  const filePath = path.normalize(path.join(assetsRoot, asset));
  const relativeToAssetsRoot = path.relative(assetsRoot, filePath);

  if (relativeToAssetsRoot.startsWith('..') || path.isAbsolute(relativeToAssetsRoot)) {
    return new Response('Theme asset not found', { status: 404 });
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return new Response('Theme asset not found', { status: 404 });
    }

    const body = await readFile(filePath);
    const contentType = contentTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';

    return new Response(body, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Theme asset not found', { status: 404 });
  }
}
