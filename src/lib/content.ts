import { getCollection, type CollectionEntry } from 'astro:content';

import { tagAccents, type TagAccent } from '../config/tags';

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

function assertDeclaredTags(posts: BlogEntry[]): void {
  const declaredTags = new Set(Object.keys(tagAccents).map(normalizeTag));
  const missingTags = new Set<string>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const normalizedTag = normalizeTag(tag);

      if (!declaredTags.has(normalizedTag)) {
        missingTags.add(normalizedTag);
      }
    });
  });

  if (missingTags.size > 0) {
    throw new Error(
      [
        'Tags non déclarés dans src/config/tags.ts :',
        ...[...missingTags].sort().map((tag) => `- ${tag}`),
        '',
        'Ajoutez chaque tag dans tagAccents avec un accent visuel avant de builder.',
      ].join('\n')
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
  assertDeclaredTags(publicPosts);

  return publicPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export function getTagAccent(tag: string): TagAccent {
  const normalizedTag = normalizeTag(tag);

  return tagAccents[normalizedTag];
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublicPosts();

  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  return [...tags].sort();
}

export async function getTagStats(): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getPublicPosts();
  const stats = new Map<string, number>();

  posts.forEach((post) => {
    const postTags = new Set(post.data.tags.map((tag) => normalizeTag(tag)));
    postTags.forEach((tag) => {
      stats.set(tag, (stats.get(tag) ?? 0) + 1);
    });
  });

  return [...stats.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getPublicPostsByTag(tag: string): Promise<BlogEntry[]> {
  const normalized = normalizeTag(tag);
  const posts = await getPublicPosts();

  return posts.filter((post) =>
    post.data.tags.some((postTag) => normalizeTag(postTag) === normalized)
  );
}
