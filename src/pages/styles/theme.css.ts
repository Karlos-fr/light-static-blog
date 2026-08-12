/**
 * Endpoint CSS global du site.
 *
 * Il assemble les fondations partagées, le layout commun, les composants communs
 * et la feuille du thème actif en remplaçant le préfixe des assets thématiques.
 */
import { siteConfig } from '../../config/site';
import { getThemeCss } from '../../themes/registry';
import { getPath } from '../../lib/urls';
import foundations from '../../themes/shared/foundations.css?raw';
import layout from '../../themes/shared/layout.css?raw';
import components from '../../themes/shared/components.css?raw';

/** Force Astro à générer cette feuille CSS au build statique. */
export const prerender = true;

/** Génère la feuille CSS finale consommée par toutes les pages. */
export function GET() {
  const themeAssetsPath = `${getPath('theme-assets', siteConfig.theme)}/`;
  const theme = getThemeCss(siteConfig.theme).replaceAll(
    '__THEME_ASSETS__/',
    themeAssetsPath
  );

  return new Response([foundations, layout, components, theme].join('\n'), {
    headers: {
      'content-type': 'text/css; charset=utf-8',
    },
  });
}
