import { getAllTags, getPublicPosts } from '../lib/content';
import { getAbsoluteUrl, getPath } from '../lib/urls';

export const prerender = true;

type SitemapEntry = {
  loc: string;
  lastmod?: Date;
};

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
  const tags = await getAllTags();

  const entries: SitemapEntry[] = [
    { loc: getAbsoluteUrl() },
    { loc: getAbsoluteUrl('about') },
    { loc: getAbsoluteUrl('tags') },
  ];

  posts.forEach((post) => {
    entries.push({
      loc: getAbsoluteUrl(post.slug),
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    });
  });

  tags.forEach((tag) => {
    entries.push({ loc: getAbsoluteUrl('tags', tag) });
  });

  const urls = entries
    .map(
      ({ loc, lastmod }) => `<url>
  <loc>${escapeXml(loc)}</loc>${
    lastmod ? `\n  <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''
  }
</url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${getPath('sitemap.xsl')}"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
