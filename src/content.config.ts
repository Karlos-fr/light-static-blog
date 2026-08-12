/**
 * Déclaration des collections de contenu Astro.
 *
 * Ce fichier définit les schémas Markdown attendus pour les articles de blog
 * et les pages éditoriales, afin de valider le contenu au build.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Collection des articles Markdown publiables. */
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

/** Collection des pages éditoriales simples, comme la page À propos. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

/** Registre des collections exposé à Astro Content. */
export const collections = {
  blog,
  pages,
};
