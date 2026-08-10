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

export const siteConfig = {
  name: siteName,
  homeMetaTitle: getOptionalEnv('SITE_HOME_META_TITLE', `${siteName} | Blog personnel`),
  tagline: getOptionalEnv('SITE_TAGLINE', '// Développement. Notes. Projets.', { allowEmpty: true }),
  description: getOptionalEnv(
    'SITE_DESCRIPTION',
    'Blog personnel statique consacré au développement, aux notes techniques et aux projets personnels.'
  ),
  postsPerPage: 6,
  theme: resolveTheme(import.meta.env.SITE_THEME),
} as const;
