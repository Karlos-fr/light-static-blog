import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

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

  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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
