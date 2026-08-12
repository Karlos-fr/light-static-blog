/**
 * Endpoint statique du sitemap XML.
 *
 * Il liste les pages principales, les pages paginées, les articles et les pages
 * de tags avec leurs URLs absolues canoniques.
 */
import { siteConfig } from '../config/site';
import { getAllTags, getPublicPosts } from '../lib/content';
import { getPageCount } from '../lib/pagination';
import { getAbsolutePageUrl } from '../lib/urls';

/** Force Astro à générer ce fichier au build statique. */
export const prerender = true;

/** Entrée individuelle du sitemap. */
type SitemapEntry = {
  loc: string;
  lastmod?: Date;
};

/** Échappe une valeur injectée dans le XML du sitemap. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Génère le sitemap XML complet. */
export async function GET() {
  const posts = await getPublicPosts();
  const tags = await getAllTags();

  const entries: SitemapEntry[] = [
    { loc: getAbsolutePageUrl() },
    { loc: getAbsolutePageUrl('about') },
    { loc: getAbsolutePageUrl('tags') },
  ];

  const totalPages = getPageCount(posts.length, siteConfig.postsPerPage);
  for (let page = 2; page <= totalPages; page += 1) {
    entries.push({ loc: getAbsolutePageUrl('page', String(page)) });
  }

  posts.forEach((post) => {
    entries.push({
      loc: getAbsolutePageUrl(post.slug),
      lastmod: post.data.updatedDate ?? post.data.pubDate,
    });
  });

  tags.forEach((tag) => {
    entries.push({ loc: getAbsolutePageUrl('tags', tag) });
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
