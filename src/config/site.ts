/**
 * Configuration centrale du site.
 *
 * Ce module agrège les valeurs personnalisables par variables d'environnement
 * avec des valeurs par défaut génériques pour le dépôt public.
 */
import { resolveTheme } from '../themes/registry';

/** Lit une variable d'environnement optionnelle et applique un fallback fiable. */
function getOptionalEnv(
  name: string,
  fallback: string,
  options: { allowEmpty?: boolean } = {}
): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();

  return trimmedValue || (options.allowEmpty ? '' : fallback);
}

/** Nom public du site, utilisé dans le header, le SEO et les flux. */
const siteName = getOptionalEnv('SITE_NAME', 'Light Static Blog');

/** Description éditoriale par défaut, utilisée aussi comme base SEO/RSS. */
const siteDescription = getOptionalEnv(
  'SITE_DESCRIPTION',
  'Une solution de blog statique simple avec Astro et Markdown, prête pour GitHub Pages. Festina lente : publier sobrement, sans complexité.'
);

/** Configuration exportée et consommée par les pages, layouts, flux et thèmes. */
export const siteConfig = {
  name: siteName,
  homeMetaTitle: getOptionalEnv('SITE_HOME_META_TITLE', `${siteName} | Blog statique Astro`),
  tagline: getOptionalEnv('SITE_TAGLINE', 'Festina lente : un blog statique simple pour GitHub Pages.', { allowEmpty: true }),
  description: siteDescription,
  socialImage: getOptionalEnv('SITE_SOCIAL_IMAGE', '/images/social-card.png'),
  feedTitle: getOptionalEnv('SITE_FEED_TITLE', siteName),
  feedDescription: getOptionalEnv('SITE_FEED_DESCRIPTION', siteDescription),
  feedIcon: getOptionalEnv('SITE_FEED_ICON', '/images/feed-icon.png'),
  feedLogo: getOptionalEnv('SITE_FEED_LOGO', '/images/feed-icon.png'),
  feedAccentColor: getOptionalEnv('SITE_FEED_ACCENT_COLOR', '#f26522'),
  postsPerPage: 6,
  theme: resolveTheme(import.meta.env.SITE_THEME),
} as const;
