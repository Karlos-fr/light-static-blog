import { siteConfig } from '../../config/site';
import { getThemeCss } from '../../themes/registry';
import foundations from '../../themes/shared/foundations.css?raw';
import layout from '../../themes/shared/layout.css?raw';
import components from '../../themes/shared/components.css?raw';

export const prerender = true;

export function GET() {
  const theme = getThemeCss(siteConfig.theme);

  return new Response([foundations, layout, components, theme].join('\n'), {
    headers: {
      'content-type': 'text/css; charset=utf-8',
    },
  });
}
