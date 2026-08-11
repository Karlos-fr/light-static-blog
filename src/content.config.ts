import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z
      .array(z.string().trim().min(1, 'Un tag ne peut pas être vide.'))
      .min(1, 'Un article doit contenir au moins un tag.'),
    draft: z.boolean().default(false),
    cover: z
      .string()
      .trim()
      .min(1, 'La couverture ne peut pas être une chaîne vide.')
      .optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  blog,
  pages,
};
