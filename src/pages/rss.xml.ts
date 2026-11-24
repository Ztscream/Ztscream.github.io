import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../site.config';
import { isPublished, resolveDate, resolveTitle, sortByDateDesc, stripMarkdown } from '../utils/content';

export const GET: APIRoute = async (context) => {
  const [blogs, notes] = await Promise.all([
    getCollection('blog', isPublished),
    getCollection('notes', isPublished),
  ]);

  const combined = [
    ...blogs.map((b) => ({ entry: b, prefix: '/blog' })),
    ...notes.map((n) => ({ entry: n, prefix: '/notes' })),
  ].sort((a, b) => resolveDate(b.entry).getTime() - resolveDate(a.entry).getTime());

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: combined.map(({ entry, prefix }) => ({
      title: resolveTitle(entry),
      pubDate: resolveDate(entry),
      description: entry.data.description || stripMarkdown(entry.body).slice(0, 140),
      link: `${prefix}/${entry.id}/`,
    })),
  });
};
