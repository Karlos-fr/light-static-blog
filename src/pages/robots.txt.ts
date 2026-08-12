/**
 * Endpoint statique robots.txt.
 *
 * Il autorise l'indexation du site et référence le sitemap généré avec l'URL
 * absolue cohérente avec SITE/BASE_URL.
 */
import { getAbsoluteUrl } from '../lib/urls';

/** Force Astro à générer ce fichier au build statique. */
export const prerender = true;

/** Génère le contenu texte du robots.txt. */
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${getAbsoluteUrl('sitemap.xml')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
