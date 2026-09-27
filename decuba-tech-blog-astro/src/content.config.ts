import { defineCollection, z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';

const postsDirectory = new URL('./content/posts/', import.meta.url);
const postsLoader = {
  name: 'decuba-posts',
  async load({ store, parseData }) {
    store.clear();
    let entries;
    try {
      entries = await readdir(postsDirectory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
      const fileUrl = new URL(entry.name, postsDirectory);
      const filePath = `src/content/posts/${entry.name}`;
      const id = entry.name.replace(/\.json$/i, '');
      const raw = JSON.parse(await readFile(fileUrl, 'utf8'));
      const data = await parseData({ id, data: raw, filePath });
      store.set({ id, data, filePath });
    }
  },
};

const posts = defineCollection({
  loader: postsLoader,
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    primaryCategory: z.string().optional(),
    categories: z.array(z.string()).default([]),
    level: z.enum(['Beginner', 'Intermediate', 'Expert']).default('Intermediate'),
    description: z.string(),
    featureImage: z.string().default('/images/decuba-tech-hero.png'),
    featureImageAlt: z.string().default(''),
    published: z.boolean().default(true),
    series: z.string().optional(),
    slug: z.string().optional(),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    bodyHtml: z.string().optional(),
  }),
});

export const collections = { posts };
