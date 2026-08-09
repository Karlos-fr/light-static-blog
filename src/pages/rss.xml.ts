import { getPublicPosts } from '../lib/content';
import { getAbsoluteUrl } from '../lib/urls';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getPublicPosts();
  const siteUrl = getAbsoluteUrl();

  const items = posts
    .map((post) => {
      const url = getAbsoluteUrl('blog', post.slug);
      const pubDate = new Date(post.data.pubDate).toUTCString();

      return `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Light Static Blog</title>
      <link>${siteUrl}</link>
      <description>Blog personnel: geekeries, projets Codex, portages de jeux et bricolages techniques.</description>
      <atom:link href="${getAbsoluteUrl('rss.xml')}" rel="self" type="application/rss+xml" />
      ${items}
    </channel>
  </rss>`;

  return new Response(feed.trim(), {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  });
}
