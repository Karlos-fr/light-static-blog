/**
 * Construction centralisée des chemins et URL du site.
 *
 * Toutes les pages passent par ces helpers pour rester cohérentes avec SITE et
 * BASE_URL, notamment sur GitHub Pages ou lors d'un déploiement en sous-dossier.
 */

/** Base path Astro courant, toujours suffixé selon la configuration du build. */
const baseUrl = import.meta.env.BASE_URL;

/** Découpe des morceaux de chemin en segments propres, sans slash vide. */
function getSegments(parts: string[]): string[] {
  return parts.flatMap((part) => part.split('/')).filter(Boolean);
}

/** Construit un chemin relatif au BASE_URL, sans forcer le slash final. */
export function getPath(...parts: string[]): string {
  const path = getSegments(parts).join('/');

  return path ? `${baseUrl}${path}` : baseUrl;
}

/** Construit un chemin relatif au BASE_URL avec slash final de page. */
export function getPagePath(...parts: string[]): string {
  const path = getPath(...parts);

  return path.endsWith('/') ? path : `${path}/`;
}

/** Construit une URL absolue vers une ressource, sans forcer le slash final. */
export function getAbsoluteUrl(...parts: string[]): string {
  const rawSite = import.meta.env.SITE?.trim();
  if (!rawSite) {
    throw new Error(
      "La variable d'environnement SITE est obligatoire pour construire une URL absolue."
    );
  }

  const site = new URL(rawSite);

  return new URL(getPath(...parts), site.origin).toString();
}

/** Construit une URL absolue canonique vers une page avec slash final. */
export function getAbsolutePageUrl(...parts: string[]): string {
  const rawSite = import.meta.env.SITE?.trim();
  if (!rawSite) {
    throw new Error(
      "La variable d'environnement SITE est obligatoire pour construire une URL absolue."
    );
  }

  const site = new URL(rawSite);

  return new URL(getPagePath(...parts), site.origin).toString();
}

/** Calcule l'URL canonique d'un pathname Astro, page ou fichier. */
export function getCanonicalUrl(pathname: string): string {
  const baseSegments = getSegments([baseUrl]);
  const pathSegments = getSegments([pathname]);
  const includesBase = baseSegments.every(
    (segment, index) => pathSegments[index] === segment
  );
  const routeSegments = includesBase
    ? pathSegments.slice(baseSegments.length)
    : pathSegments;
  const lastSegment = routeSegments.at(-1) ?? '';
  const isFileUrl = /\.[a-z0-9]+$/i.test(lastSegment);

  return isFileUrl
    ? getAbsoluteUrl(...routeSegments)
    : getAbsolutePageUrl(...routeSegments);
}
