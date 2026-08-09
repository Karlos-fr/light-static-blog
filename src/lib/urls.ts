const baseUrl = import.meta.env.BASE_URL;

function getSegments(parts: string[]): string[] {
  return parts.flatMap((part) => part.split('/')).filter(Boolean);
}

export function getPath(...parts: string[]): string {
  const path = getSegments(parts).join('/');

  return path ? `${baseUrl}${path}` : baseUrl;
}

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

export function getCanonicalUrl(pathname: string): string {
  const baseSegments = getSegments([baseUrl]);
  const pathSegments = getSegments([pathname]);
  const includesBase = baseSegments.every(
    (segment, index) => pathSegments[index] === segment
  );
  const routeSegments = includesBase
    ? pathSegments.slice(baseSegments.length)
    : pathSegments;

  return getAbsoluteUrl(...routeSegments);
}
