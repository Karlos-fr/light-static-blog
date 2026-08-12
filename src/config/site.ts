import { resolveTheme } from '../themes/registry';

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

const siteName = getOptionalEnv('SITE_NAME', 'Light Static Blog');
const siteDescription = getOptionalEnv(
  'SITE_DESCRIPTION',
  'Une solution de blog statique simple avec Astro et Markdown, prête pour GitHub Pages. Festina lente : publier sobrement, sans complexité.'
);

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
