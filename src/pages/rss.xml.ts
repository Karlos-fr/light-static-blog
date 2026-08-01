import { getPublicPosts } from '../lib/content';

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
  const rawSite = import.meta.env.SITE?.trim();
  if (!rawSite) {
    throw new Error(
      "La variable d'environnement SITE est obligatoire pour générer le flux RSS."
    );
  }

  const site = rawSite.replace(/\/$/, '');
  );

  const items = posts
    .map((post) => {
      const url = `${site}/blog/${post.slug}`;
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
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Light Static Blog</title>
      <link>${site}</link>
      <description>Blog personnel: geekeries, projets Codex, portages de jeux et bricolages techniques.</description>
      <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
      ${items}
    </channel>
  </rss>`;

  return new Response(feed.trim(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
