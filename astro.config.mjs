import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * 兼容 Obsidian Enveloppe 默认上传图片到 public/uploads 时的路径差异：
 * 无论生成的 Markdown 链接是 public/uploads/x.png、/public/uploads/x.png 还是 /uploads/x.png，均自动归一为 /uploads/x.png
 */
function remarkNormalizeObsidianUploads() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'image' && typeof node.url === 'string') {
        node.url = node.url.replace(/^(?:\.\.\/|\.\/|\/)*public\/uploads\//, '/uploads/');
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://ztscream.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkNormalizeObsidianUploads],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      wrap: false,
    },
  },
});
