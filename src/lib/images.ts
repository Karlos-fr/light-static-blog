/**
 * Utilitaires de métadonnées d'images publiques.
 *
 * Astro ne connaît pas automatiquement les dimensions des fichiers placés dans
 * public/. Ce module extrait les dimensions PNG utiles aux balises HTML/SEO.
 */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

/** Chemin absolu vers le dossier public du projet. */
const publicDir = join(process.cwd(), 'public');

/** Dimensions intrinsèques d'une image. */
export type ImageDimensions = {
  width: number;
  height: number;
};

/** Convertit une URL publique locale en chemin disque, si elle pointe vers public/. */
function getPublicImagePath(value: string): string | undefined {
  let path = value.split(/[?#]/, 1)[0];

  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) {
    return undefined;
  }

  const base = import.meta.env.BASE_URL;
  if (base !== '/' && path.startsWith(base)) {
    path = `/${path.slice(base.length)}`;
  }

  if (!path.startsWith('/')) {
    return undefined;
  }

  return join(publicDir, ...path.split('/').filter(Boolean));
}

/** Lit les dimensions d'un PNG à partir de son en-tête binaire. */
function getPngDimensions(filePath: string): ImageDimensions | undefined {
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
}

/** Retourne les dimensions connues d'une image publique locale supportée. */
export function getImageDimensions(src: string): ImageDimensions | undefined {
  const filePath = getPublicImagePath(src);
  if (!filePath || !existsSync(filePath)) {
    return undefined;
  }

  const extension = extname(filePath).toLowerCase();

  return extension === '.png' ? getPngDimensions(filePath) : undefined;
}
