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
  'Blog personnel statique consacré au développement, aux notes techniques et aux projets personnels.'
);

export const siteConfig = {
  name: siteName,
  homeMetaTitle: getOptionalEnv('SITE_HOME_META_TITLE', `${siteName} | Blog personnel`),
  tagline: getOptionalEnv('SITE_TAGLINE', '// Développement. Notes. Projets.', { allowEmpty: true }),
  description: siteDescription,
  feedTitle: getOptionalEnv('SITE_FEED_TITLE', siteName),
  feedDescription: getOptionalEnv('SITE_FEED_DESCRIPTION', siteDescription),
  feedIcon: getOptionalEnv('SITE_FEED_ICON', '/images/feed-icon.png'),
  feedLogo: getOptionalEnv('SITE_FEED_LOGO', '/images/feed-icon.png'),
  feedAccentColor: getOptionalEnv('SITE_FEED_ACCENT_COLOR', '#f26522'),
  postsPerPage: 6,
  theme: resolveTheme(import.meta.env.SITE_THEME),
} as const;
