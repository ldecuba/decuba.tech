import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    description: z.string(),
    featureImage: z.string().default('/images/decuba-tech-hero.png'),
    published: z.boolean().default(true),
    series: z.string().optional(),
  }),
});

export const collections = { posts };
