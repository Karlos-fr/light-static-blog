import { getAbsoluteUrl } from '../lib/urls';

export const prerender = true;

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
