import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  isPublished,
  resolveDate,
  resolveTitle,
  sortByDateDesc,
  stripMarkdown,
} from '../utils/content';

export const GET: APIRoute = async () => {
  const [blogs, notes, memos] = await Promise.all([
    getCollection('blog', isPublished),
    getCollection('notes', isPublished),
    getCollection('memos', isPublished),
  ]);

  const items = [
    ...sortByDateDesc(blogs).map((entry) => {
      const plain = stripMarkdown(entry.body);
      return {
        title: resolveTitle(entry),
        section: '博客',
        url: `/blog/${entry.id}`,
        tags: (entry.data.tags || []).join(' '),
        topic: '',
        snippet: entry.data.description || plain.slice(0, 90),
        content: plain,
        date: resolveDate(entry).getTime(),
      };
    }),
    ...sortByDateDesc(notes).map((entry) => {
      const plain = stripMarkdown(entry.body);
      return {
        title: resolveTitle(entry),
        section: `笔记 · ${entry.data.topic || '未分类'}`,
        url: `/notes/${entry.id}`,
        tags: (entry.data.tags || []).join(' '),
        topic: entry.data.topic || '',
        snippet: entry.data.description || plain.slice(0, 90),
        content: plain,
        date: resolveDate(entry).getTime(),
      };
    }),
    ...sortByDateDesc(memos).map((entry) => {
      const plain = stripMarkdown(entry.body);
      return {
        title: resolveTitle(entry),
        section: '当下 · 闪念',
        url: `/now#${entry.id}`,
        tags: (entry.data.tags || []).join(' '),
        topic: '',
        snippet: plain.slice(0, 90),
        content: plain,
        date: resolveDate(entry).getTime(),
      };
    }),
  ].sort((a, b) => b.date - a.date);

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
