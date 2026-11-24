import type { CollectionEntry } from 'astro:content';

export type AnyEntry =
  | CollectionEntry<'blog'>
  | CollectionEntry<'notes'>
  | CollectionEntry<'memos'>;

/**
 * 判断内容是否应当公开展示：
 * - draft 为 true 时隐藏
 * - 如果显式设置了 Obsidian 的 share: false，也视为未公开草稿
 */
export function isPublished(entry: AnyEntry): boolean {
  if (entry.data.draft === true) return false;
  if (entry.data.share === false) return false;
  return true;
}

/**
 * 免配置标题兜底：优先取 YAML title -> 正文第一个一级标题 -> 文件名
 */
export function resolveTitle(entry: AnyEntry): string {
  if (entry.data.title && entry.data.title.trim()) {
    return entry.data.title.trim();
  }
  if (entry.body) {
    const match = entry.body.match(/^#\s+(.+)$/m);
    if (match?.[1]) return match[1].trim();
  }
  const rawName = entry.id.split('/').pop() ?? entry.id;
  return rawName.replace(/\.(md|mdx)$/i, '');
}

/**
 * 免配置日期兜底：缺失日期时回退到默认基准时间，保证归档排序稳定不报错
 */
export function resolveDate(entry: AnyEntry): Date {
  if (entry.data.date instanceof Date && !isNaN(entry.data.date.getTime())) {
    return entry.data.date;
  }
  return new Date('2026-01-01T00:00:00Z');
}

export function sortByDateDesc<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort(
    (a, b) => resolveDate(b).getTime() - resolveDate(a).getTime()
  );
}

export function formatMonthDay(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}-${d}`;
}

export function formatFullDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function estimateReadingMinutes(body?: string): number {
  if (!body) return 1;
  const clean = body.replace(/```[\s\S]*?```/g, '').replace(/[#>*_`~\-\[\]()!]/g, '');
  const cjkCount = (clean.match(/[\u4e00-\u9fa5]/g) || []).length;
  const wordCount = (clean.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\S+/g) || []).length;
  const minutes = Math.ceil((cjkCount + wordCount * 1.5) / 360);
  return Math.max(1, minutes);
}

export function stripMarkdown(md?: string): string {
  if (!md) return '';
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
