import { getPublicPosts } from '../lib/content';
import { getAbsoluteUrl, getPath } from '../lib/urls';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCdata(value: string): string {
  return value.replace(/]]>/g, ']]]]><![CDATA[>');
}

function getImageMimeType(path: string): string {
  const extension = path.split(/[?#]/, 1)[0].split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    avif: 'image/avif',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  };

  return extension ? (mimeTypes[extension] ?? 'application/octet-stream') : 'application/octet-stream';
}

export async function GET() {
  const posts = await getPublicPosts();
  const siteUrl = getAbsoluteUrl();

  const items = posts
    .map((post) => {
      const url = getAbsoluteUrl(post.slug);
      const pubDate = new Date(post.data.pubDate).toUTCString();
      const imageUrl = post.data.cover
        ? getAbsoluteUrl(post.data.cover)
        : undefined;
      const descriptionHtml = imageUrl
        ? `<p><img src="${escapeXml(imageUrl)}" alt="Illustration de ${escapeXml(post.data.title)}" /></p><p>${escapeXml(post.data.description)}</p>`
        : `<p>${escapeXml(post.data.description)}</p>`;
      const media = imageUrl
        ? `
      <media:content url="${escapeXml(imageUrl)}" type="${getImageMimeType(post.data.cover!)}" medium="image" />
      <media:thumbnail url="${escapeXml(imageUrl)}" />`
        : '';

      return `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeCdata(descriptionHtml)}]]></description>
      <content:encoded><![CDATA[${escapeCdata(descriptionHtml)}]]></content:encoded>${media}
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="${getPath('rss.xsl')}"?>
  <rss version="2.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:media="http://search.yahoo.com/mrss/">
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
