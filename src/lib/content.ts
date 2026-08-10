import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

const RESERVED_POST_SLUGS = new Set([
  'about',
  'blog',
  'page',
  'tags',
  'rss.xml',
  'sitemap.xml',
]);

function assertAvailablePostSlugs(posts: BlogEntry[]): void {
  const reservedSlug = posts.find((post) => RESERVED_POST_SLUGS.has(post.slug));

  if (reservedSlug) {
    throw new Error(
      `Le slug d'article "${reservedSlug.slug}" est réservé par une route du site.`
    );
  }
}

export function normalizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getDisplayTag(tag: string): string {
  return tag
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function getPublicPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog');
  const publicPosts = posts.filter((post) => !post.data.draft);

  assertAvailablePostSlugs(publicPosts);

  return publicPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

const TAG_ACCENTS = ['primary', 'violet', 'blue', 'orange'] as const;

export function getTagAccent(tag: string): (typeof TAG_ACCENTS)[number] {
  const normalizedTag = normalizeTag(tag);
  const accentGroups: Record<(typeof TAG_ACCENTS)[number], string[]> = {
    primary: ['test', 'rss'],
    violet: ['retro', 'gamedev', 'jeu', 'jeux'],
    blue: ['bricolage', 'outils', 'shell', 'sysadmin'],
    orange: ['dev', 'javascript', 'methodologie', 'productivite'],
  };

  const semanticAccent = TAG_ACCENTS.find((accent) =>
    accentGroups[accent].some((keyword) => normalizedTag.includes(keyword))
  );
  if (semanticAccent) {
    return semanticAccent;
  }

  const score = normalizedTag
    .split('')
    .reduce((total, character, index) => total + character.charCodeAt(0) * (index + 3), 0);

  return TAG_ACCENTS[score % TAG_ACCENTS.length];
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublicPosts();

  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  return [...tags].sort();
}

export async function getPublicPostsByTag(tag: string): Promise<BlogEntry[]> {
  const normalized = normalizeTag(tag);
  const posts = await getPublicPosts();

  return posts.filter((post) =>
    post.data.tags.some((postTag) => normalizeTag(postTag) === normalized)
  );
}
