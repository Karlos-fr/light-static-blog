import { getAllTags, getPublicPosts } from '../lib/content';

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
  const tags = await getAllTags();
  const site = (import.meta.env.SITE ?? 'https://karlos-fr.github.io/light-static-blog').replace(
    /\/$/,
    ''
  );

  const urls = [
    `${site}/`,
    `${site}/blog`,
    `${site}/about`,
    `${site}/tags`,
  ];

  posts.forEach((post) => {
    urls.push(`${site}/blog/${post.slug}`);
  });

  tags.forEach((tag) => {
    urls.push(`${site}/tags/${tag}`);
  });

  const entries = urls
    .map(
      (url) => `<url>
  <loc>${escapeXml(url)}</loc>
</url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
