import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { siteConfig } from '../config/site';
import { getPublicPosts } from '../lib/content';
import { getAbsoluteUrl, getCanonicalUrl, getPath } from '../lib/urls';

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

function getImageMimeType(path: string): string | undefined {
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

  return extension ? mimeTypes[extension] : undefined;
}

function getAbsoluteContentUrl(value: string, articleUrl: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) {
    return value.startsWith('//') ? new URL(value, articleUrl).toString() : value;
  }

  if (value.startsWith('/')) {
    return getCanonicalUrl(value);
  }

  return new URL(value, `${articleUrl}/`).toString();
}

function absolutizeHtmlUrls(html: string, articleUrl: string): string {
  const withAttributes = html.replace(
    /\b(href|src|poster)=("([^"]*)"|'([^']*)')/gi,
    (_match, attribute: string, _quotedValue: string, doubleValue?: string, singleValue?: string) => {
      const value = doubleValue ?? singleValue ?? '';
      const quote = doubleValue === undefined ? "'" : '"';
      const absoluteValue = getAbsoluteContentUrl(value, articleUrl);

      return `${attribute}=${quote}${absoluteValue}${quote}`;
    }
  );

  return withAttributes.replace(
    /\bsrcset=("([^"]*)"|'([^']*)')/gi,
    (_match, _quotedValue: string, doubleValue?: string, singleValue?: string) => {
      const value = doubleValue ?? singleValue ?? '';
      const quote = doubleValue === undefined ? "'" : '"';
      const absoluteValue = value.includes('data:')
        ? value
        : value
            .split(',')
            .map((candidate) => {
              const match = candidate.trim().match(/^(\S+)(.*)$/);
              return match
                ? `${getAbsoluteContentUrl(match[1], articleUrl)}${match[2]}`
                : candidate;
            })
            .join(', ');

      return `srcset=${quote}${absoluteValue}${quote}`;
    }
  );
}

function getImageUrls(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc=(?:"([^"]+)"|'([^']+)')[^>]*>/gi)]
    .map((match) => match[1] ?? match[2])
    .filter((url): url is string => Boolean(url));
}

export async function GET() {
  const posts = await getPublicPosts();
  const siteUrl = getAbsoluteUrl();
  const container = await AstroContainer.create();
  const items: string[] = [];
  const lastBuildDate = posts
    .map((post) => post.data.updatedDate ?? post.data.pubDate)
    .sort((a, b) => b.getTime() - a.getTime())[0]
    ?.toUTCString();

  for (const post of posts) {
    const url = getAbsoluteUrl(post.slug);
    const pubDate = new Date(post.data.pubDate).toUTCString();
    const coverUrl = post.data.cover
      ? getAbsoluteUrl(post.data.cover)
      : undefined;
    const { Content } = await post.render();
    const renderedContent = await container.renderToString(Content);
    const articleContent = absolutizeHtmlUrls(renderedContent, url);
    const coverHtml = coverUrl
      ? `<p><img src="${escapeXml(coverUrl)}" alt="Illustration de ${escapeXml(post.data.title)}" /></p>`
      : '';
    const fullContent = `${coverHtml}${articleContent}`;
    const imageUrls = [...new Set([
      ...(coverUrl ? [coverUrl] : []),
      ...getImageUrls(articleContent),
    ])];
    const media = imageUrls
      .map((imageUrl) => {
        const mimeType = getImageMimeType(imageUrl);
        const type = mimeType ? ` type="${mimeType}"` : '';
        return `
      <media:content url="${escapeXml(imageUrl)}"${type} medium="image" />`;
      })
      .join('');
    const thumbnail = imageUrls[0]
      ? `
      <media:thumbnail url="${escapeXml(imageUrls[0])}" />`
      : '';
    const categories = post.data.tags
      .map((tag) => `
      <category>${escapeXml(tag)}</category>`)
      .join('');

    items.push(`
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeCdata(post.data.description)}]]></description>
      <content:encoded><![CDATA[${escapeCdata(fullContent)}]]></content:encoded>${categories}${media}${thumbnail}
    </item>`);
  }

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="${getPath('rss.xsl')}"?>
  <rss version="2.0"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteUrl}</link>
      <description>${escapeXml(siteConfig.description)}</description>
      <language>fr</language>${lastBuildDate ? `
      <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ''}
      <atom:link href="${getAbsoluteUrl('rss.xml')}" rel="self" type="application/rss+xml" />
      ${items.join('\n')}
    </channel>
  </rss>`;

  return new Response(feed.trim(), {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  });
}
