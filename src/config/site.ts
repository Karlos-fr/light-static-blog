import { resolveTheme } from '../themes/registry';

export const siteConfig = {
  name: 'Gildas Lechevalier',
  tagline: '// Développement. Rétro. Outils.',
  description: 'Blog personnel sur le code, les jeux rétro et le bricolage technique',
  postsPerPage: 6,
  theme: resolveTheme(import.meta.env.SITE_THEME),
} as const;
