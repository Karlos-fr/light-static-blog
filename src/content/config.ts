import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  blog,
  pages,
};
