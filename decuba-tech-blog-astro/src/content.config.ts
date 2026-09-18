import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    primaryCategory: z.string().optional(),
    categories: z.array(z.string()).default([]),
    level: z.enum(['Beginner', 'Intermediate', 'Expert']).default('Intermediate'),
    description: z.string(),
    featureImage: z.string().default('/images/decuba-tech-hero.png'),
    published: z.boolean().default(true),
    series: z.string().optional(),
    bodyHtml: z.string().optional(),
  }),
});

export const collections = { posts };
