import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z
  .object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    description: z.string().optional().default(''),
    tags: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .transform((val) => {
        if (!val) return [];
        return Array.isArray(val) ? val : val.split(/[,，\s]+/).filter(Boolean);
      }),
    draft: z.boolean().optional().default(false),
    share: z.boolean().optional(),
    category: z.string().optional(),
  })
  .passthrough();

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: baseSchema,
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: baseSchema.extend({
    topic: z.string().optional().default('未分类'),
    order: z.number().optional(),
  }),
});

const memos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/memos' }),
  schema: baseSchema,
});

export const collections = { blog, notes, memos };
