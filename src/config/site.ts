import { resolveTheme } from '../themes/registry';

function getOptionalEnv(name: string, fallback: string): string {
  return import.meta.env[name]?.trim() || fallback;
}

const siteName = getOptionalEnv('SITE_NAME', 'Light Static Blog');
const homeTitle = getOptionalEnv('SITE_HOME_TITLE', 'Blog personnel');

export const siteConfig = {
  name: siteName,
  homeTitle,
  homeMetaTitle: getOptionalEnv('SITE_HOME_META_TITLE', `${homeTitle} | ${siteName}`),
  tagline: getOptionalEnv('SITE_TAGLINE', '// Développement. Notes. Projets.'),
  description: getOptionalEnv(
    'SITE_DESCRIPTION',
    'Blog personnel statique consacré au développement, aux notes techniques et aux projets personnels.'
  ),
  postsPerPage: 6,
  theme: resolveTheme(import.meta.env.SITE_THEME),
} as const;
